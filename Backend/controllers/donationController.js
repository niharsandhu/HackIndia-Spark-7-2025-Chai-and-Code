const { ethers } = require('ethers');
require('dotenv').config();
const express = require('express');
const router = express.Router();
const AidTrackerArtifact = require("../../BlockChain/artifacts/contracts/AidTracker.sol/AidTracker.json");
const DonationVaultArtifact = require("../../BlockChain/artifacts/contracts/DonationVault.sol/DonationVault.json");
const NGORegistryArtifact = require("../../BlockChain/artifacts/contracts/NGORegistry.sol/NGORegistry.json");

// Import Mongoose Models
const User = require('../models/user');
const Ngo = require('../models/Ngo');
const DonationVaultModel = require('../models/DonationVault');

// Smart contract addresses (use your actual deployed addresses here)
const NGORegistryAddress = '0x1906d35B86C0fB12Be2716B1C0B3A9ff9eB82Db8';
const AidTrackerAddress = '0xf7A7072F9e5C0A3B6630362a8BcD61a591dBfDdf';
const DonationVaultAddress = '0xED84D9361b6dcbA41E48f004C54474e33412A635';

// Smart contract ABI (use actual ABIs from your compiled contract)
const NGORegistryABI = [
  "function registerNGO(address _wallet, string memory _name, string memory _metadata) public",
  "function updateNGOStatus(uint256 ngoId, bool approved, bool needsFunding) public",
  "function getNGOsInNeed() public view returns (uint256[] memory)"
];

const AidTrackerABI = [
  "function createAidCard(string memory beneficiaryId, string memory metadata) public",
  "function recordAidDistribution(string memory beneficiaryId, uint256 ngoId, uint256 amount, string memory details) public"
];

const DonationVaultABI = [
  "function getStats() public view returns (uint256 balance, uint256 donated, uint256 distributed, uint256 returned)",
  "function fundNGO(uint256 ngoId, uint256 amount) public",
  "function recordReturnedFunds(uint256 ngoId, uint256 amount) public payable"
];

// Set up ethers provider and signer
const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_URL); // Use Sepolia URL from .env
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Initialize contract instances
const NGORegistry = new ethers.Contract(NGORegistryAddress, NGORegistryArtifact.abi, signer);
const AidTracker = new ethers.Contract(AidTrackerAddress, AidTrackerArtifact.abi, signer);
const DonationVault = new ethers.Contract(DonationVaultAddress, DonationVaultArtifact.abi, signer);

// Routes

// 1. Donate to the platform
router.post('/donate', async (req, res) => {
    const { amount, ngoAddress, userId, donorWalletAddress } = req.body; // Destructure both amount, ngoAddress, userId, and donorWalletAddress
  
    if (!amount || !ngoAddress || !userId || !donorWalletAddress) {
      return res.status(400).json({ error: 'Missing amount, NGO address, userId, or donor wallet address' });
    }
  
    const donationAmount = ethers.parseEther(amount.toString());
  
    try {
      const transaction = await signer.sendTransaction({
        to: ngoAddress, // Use the provided NGO address here
        value: donationAmount,
        from: donorWalletAddress // Donor wallet address
      });
  
      await transaction.wait(); // Wait for the transaction to be mined
  
      // Update donation record in MongoDB
      const donationRecord = {
        donorId: userId,  // Assuming the user is authenticated and userId is passed
        amount: parseFloat(amount),
        transactionHash: transaction.hash,
        donorWalletAddress // Record the donor wallet address
      };

      // Update User model with the donation
      await User.findByIdAndUpdate(userId, {
        $push: {
          donations: {
            amount: parseFloat(amount),
            transactionHash: transaction.hash,
            ngoAddress,
            date: new Date()
          }
        }
      });

      // Update Donation Vault stats and MongoDB record
      await DonationVaultModel.updateOne({}, {
        $inc: { totalReceived: donationRecord.amount },
        $push: { donations: donationRecord }
      }, { upsert: true });

      const stats = await DonationVault.getStats();
      res.json({ success: true, stats });
    } catch (error) {
      console.error('Donation failed:', error);
      res.status(500).json({ error: 'Donation failed' });
    }
});

// 2. Fund an NGO
router.post('/fundNgo', async (req, res) => {
  const { ngoId, amount, userId, donorWalletAddress } = req.body; // Amount in Ether to fund NGO
  const fundingAmount = ethers.parseEther(amount.toString());

  try {
    const initialBalance = await provider.getBalance(NGORegistryAddress); // Get NGO's initial balance

    // Fund NGO through the DonationVault contract
    const transaction = await DonationVault.fundNGO(ngoId, fundingAmount);
    await transaction.wait(); // Wait for transaction confirmation

    // Update NGO balance in MongoDB
    const ngo = await Ngo.findById(ngoId);
    if (ngo) {
      ngo.totalReceived += parseFloat(amount);
      ngo.fundingHistory.push({
        amount: parseFloat(amount),
        transactionHash: transaction.hash,
        donorWalletAddress // Record the donor's wallet address
      });
      await ngo.save();
    }

    // Update User model with the funding record
    await User.findByIdAndUpdate(userId, {
      $push: {
        fundings: {
          ngoId: ngoId,
          amount: parseFloat(amount),
          transactionHash: transaction.hash,
          date: new Date()
        }
      }
    });

    // Update Donation Vault and MongoDB record
    await DonationVaultModel.updateOne({}, {
      $inc: { totalDistributed: parseFloat(amount) },
      $push: {
        fundings: {
          ngoId: ngoId,
          amount: parseFloat(amount),
          transactionHash: transaction.hash,
          donorWalletAddress // Include donor wallet address
        }
      }
    }, { upsert: true });

    const newBalance = await provider.getBalance(NGORegistryAddress); // Get NGO's new balance
    res.json({
      success: true,
      fundedAmount: fundingAmount,
      balanceChange: newBalance.sub(initialBalance)
    });
  } catch (error) {
    console.error('Funding NGO failed:', error);
    res.status(500).json({ error: 'Funding NGO failed' });
  }
});

// 3. Record returned funds
router.post('/returnFunds', async (req, res) => {
  const { ngoId, amount } = req.body; // Amount to be returned (in Ether)
  const returnAmount = ethers.parseEther(amount.toString());

  try {
    const transaction = await DonationVault.recordReturnedFunds(ngoId, returnAmount, { value: returnAmount });
    await transaction.wait(); // Wait for transaction confirmation

    // Update Donation Vault and MongoDB record
    await DonationVaultModel.updateOne({}, {
      $inc: { totalReturned: parseFloat(amount) },
      $push: {
        fundings: {
          ngoId,
          amount: 0,
          returnAmount: parseFloat(amount),
          date: new Date()
        }
      }
    });

    const stats = await DonationVault.getStats();
    res.json({ success: true, stats });
  } catch (error) {
    console.error('Return funds failed:', error);
    res.status(500).json({ error: 'Return funds failed' });
  }
});

// 4. Register NGO
router.post('/registerNgo', async (req, res) => {
  const { walletAddress, name, metadata, darpanId } = req.body;

  try {
    const transaction = await NGORegistry.registerNGO(walletAddress, name, metadata);
    await transaction.wait(); // Wait for transaction confirmation

    // Create NGO record in MongoDB
    await Ngo.create({
      name,
      walletAddress,
      darpanId, // ensure this is provided
      metadata
    });

    res.json({ success: true, message: 'NGO registered successfully' });
  } catch (error) {
    console.error('NGO registration failed:', error);
    res.status(500).json({ error: 'NGO registration failed' });
  }
});

// 5. Update NGO status
router.post('/updateNgoStatus', async (req, res) => {
  const { ngoId, approved, needsFunding } = req.body;

  try {
    const transaction = await NGORegistry.updateNGOStatus(ngoId, approved, needsFunding);
    await transaction.wait(); // Wait for transaction confirmation

    // Update NGO status in MongoDB
    await Ngo.findByIdAndUpdate(ngoId, {
      isApproved: approved,
      needsFunding
    });

    res.json({ success: true, message: 'NGO status updated' });
  } catch (error) {
    console.error('Update NGO status failed:', error);
    res.status(500).json({ error: 'Update NGO status failed' });
  }
});
// 6. Create Aid Card
router.post('/createAidCard', async (req, res) => {
    const { beneficiaryId, metadata } = req.body;
  
    if (!beneficiaryId || !metadata) {
      return res.status(400).json({ error: 'Missing beneficiaryId or metadata' });
    }
  
    try {
      const transaction = await AidTracker.createAidCard(beneficiaryId, metadata);
      await transaction.wait(); // Wait for transaction confirmation
  
      // Update database or perform other necessary actions
      res.json({ success: true, message: 'Aid card created successfully' });
    } catch (error) {
      console.error('Create aid card failed:', error);
      res.status(500).json({ error: 'Create aid card failed' });
    }
  });
  

module.exports = router;
