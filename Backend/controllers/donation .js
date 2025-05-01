const { isAddress, parseEther } = require('ethers');
const Ngo = require('../models/Ngo');
const dotenv = require('dotenv');
dotenv.config();

const DonationVaultABI = require('../../BlockChain/artifacts/contracts/DonationVault.sol/DonationVault.json').abi;
const { ethers } = require('ethers');

const provider = new ethers.JsonRpcProvider('http://localhost:8545');
const privateKey = process.env.PRIVATE_KEY;
const signer = new ethers.Wallet(privateKey, provider);

const DONATION_VAULT_ADDRESS = process.env.DONATION_VAULT_ADDRESS;
const donationVault = new ethers.Contract(DONATION_VAULT_ADDRESS, DonationVaultABI, signer);

// GET Contract Balance
const checkContractBalance = async () => {
  const balance = await provider.getBalance(DONATION_VAULT_ADDRESS);
  return balance;
};

// ✅ Donate to Contract — Wallet comes from frontend (MetaMask)
const donateToContract = async (req, res) => {
  try {
    const { donorWallet, amount } = req.body;

    if (!isAddress(donorWallet)) {
      return res.status(400).json({ message: 'Invalid donor wallet address' });
    }
    if (amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than zero' });
    }

    const donationAmount = parseEther(amount.toString());

    console.log(`Donating ${amount} ETH from ${donorWallet}`);

    // Interact with smart contract
    const tx = await donationVault.donateFor(donorWallet, {
      value: donationAmount,
      gasLimit: 200000,
    });

    const receipt = await tx.wait();
    const balance = await checkContractBalance();

    return res.status(200).json({
      message: 'Donation successful',
      transactionHash: tx.hash,
      blockNumber: receipt.blockNumber,
      newBalance: ethers.formatEther(balance)
    });
  } catch (error) {
    console.error('Error in donateToContract:', error);
    return res.status(500).json({ message: 'Error while processing donation', details: error.message });
  }
};

// ✅ Send Funds to NGO — NGO ID via GET (query or params), donor wallet still sent from frontend
const sendFundsToNGO = async (req, res) => {
  try {
    const { amount, donorWallet } = req.body;
    const ngoId = req.query.ngoId; // or use req.params.ngoId based on your route

    if (!ngoId || !ethers.isHexString('0x' + ngoId.substring(0, 8))) {
      return res.status(400).json({ message: 'Invalid or missing NGO ID' });
    }
    if (amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than zero' });
    }

    const ngo = await Ngo.findById(ngoId);
    if (!ngo) return res.status(404).json({ message: 'NGO not found' });
    if (!isAddress(ngo.blockchainWalletAddress)) return res.status(400).json({ message: 'Invalid NGO wallet address' });
    if (!ngo.status.isVerified) return res.status(400).json({ message: 'NGO is not verified or eligible for funds' });

    const donationAmount = parseEther(amount.toString());
    const contractBalance = await checkContractBalance();

    if (contractBalance < donationAmount) {
      return res.status(400).json({
        message: 'Insufficient contract balance',
        contractBalance: ethers.formatEther(contractBalance)
      });
    }

    const numericNgoId = parseInt(ngoId.substring(0, 8), 16);

    const tx = await donationVault.fundNGO(numericNgoId, donationAmount, ngo.blockchainWalletAddress, {
      gasLimit: 300000
    });

    const receipt = await tx.wait();
    ngo.totalDonationReceived = (ngo.totalDonationReceived || 0) + parseFloat(amount);
    await ngo.save();

    return res.status(200).json({
      message: 'Funds sent to NGO successfully',
      transactionHash: receipt.transactionHash,
      blockNumber: receipt.blockNumber
    });
  } catch (error) {
    console.error('Error sending funds to NGO:', error);
    return res.status(500).json({ message: 'Failed to send funds', details: error.message });
  }
};
const getAllNgos = async (req, res) => {
    try {
      const ngos = await Ngo.find({}, '_id name state district type blockchainWalletAddress status'); // Select specific fields
      res.status(200).json({ ngos });
    } catch (error) {
      console.error('Error fetching NGOs:', error);
      res.status(500).json({ message: 'Failed to retrieve NGOs', error: error.message });
    }
  };

module.exports = {
  donateToContract,
  sendFundsToNGO,
  checkContractBalance,
  getAllNgos
};

