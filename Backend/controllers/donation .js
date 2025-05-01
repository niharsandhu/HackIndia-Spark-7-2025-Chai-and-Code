const { isAddress, ethers } = require('ethers');
const Ngo = require('../models/Ngo'); // The Ngo model
const Donor = require('../models/Donar'); // The Donor model
const dotenv = require('dotenv');
dotenv.config();

// Import contract ABIs
const DonationVaultABI = require('../../BlockChain/artifacts/contracts/DonationVault.sol/DonationVault.json').abi;

// Configure blockchain connection
const provider = new ethers.JsonRpcProvider('http://localhost:8545'); // Assuming local Hardhat network
const privateKey = process.env.PRIVATE_KEY;
const signer = new ethers.Wallet(privateKey, provider);

// Contract address (this should be set after deployment)
const DONATION_VAULT_ADDRESS = process.env.DONATION_VAULT_ADDRESS;

// Initialize contract instance
const donationVault = new ethers.Contract(DONATION_VAULT_ADDRESS, DonationVaultABI, signer);

// Controller to send funds from donor wallet to NGO wallet
const sendFundsToNGO = async (req, res) => {
  try {
    const { donorId, ngoId, amount } = req.body;
    
    // Validate the amount
    if (amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than zero' });
    }
    
    // Get donor information from the database
    const donor = await Donor.findById(donorId);
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }
    
    // Validate the donor wallet address
    if (!isAddress(donor.blockchainWalletAddress)) {
      return res.status(400).json({ message: 'Invalid donor wallet address' });
    }
    
    // Get NGO details from the database
    const ngo = await Ngo.findById(ngoId);
    if (!ngo) {
      return res.status(404).json({ message: 'NGO not found' });
    }
    
    // Validate the NGO wallet address
    if (!isAddress(ngo.blockchainWalletAddress)) {
      return res.status(400).json({ message: 'Invalid NGO wallet address' });
    }
    
    // Check if the NGO is approved and eligible for funding
    if (!ngo.status.isVerified) {
      return res.status(400).json({ message: 'NGO is not approved or does not need funding' });
    }
    
    // Create a numeric ID for the blockchain
    const numericNgoId = parseInt(ngoId.substring(0, 8), 16);
    
    console.log(`Sending ${amount} ETH to NGO ID ${numericNgoId} at address ${ngo.blockchainWalletAddress}`);
    
    // Interact with the smart contract to send funds
    const tx = await donationVault.donateToNGO(
      numericNgoId,  // Use numeric ID instead of MongoDB ObjectId
      ngo.blockchainWalletAddress,
      { value: ethers.parseUnits(amount.toString(), "ether"), gasLimit: 300000 } // Corrected with parseUnits
    );
    
    console.log(`Transaction sent: ${tx.hash}`);
    
    // Wait for the transaction to be mined
    const receipt = await tx.wait();
    console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
    
    // Update NGO's totalAmountReceived
    ngo.totalDonationReceived = (ngo.totalDonationReceived || 0) + parseFloat(amount);
    await ngo.save();

    return res.status(200).json({
      message: 'Funds sent to NGO successfully.',
      transactionHash: receipt.transactionHash,
      blockNumber: receipt.blockNumber,
    });
  } catch (error) {
    console.error('Error in sendFundsToNGO:', error);
    
    // Handle specific contract errors
    if (error.reason) {
      return res.status(400).json({ 
        message: `Blockchain error: ${error.reason}`,
        details: error.shortMessage || error.message
      });
    }
    
    return res.status(500).json({ 
      message: 'Error while sending funds to NGO.',
      details: error.message
    });
  }
};

module.exports = {
  sendFundsToNGO,
};
