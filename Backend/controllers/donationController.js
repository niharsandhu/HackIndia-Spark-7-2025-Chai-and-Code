const { isAddress, parseEther } = require('ethers');
const User = require('../models/user');
const Ngo = require('../models/Ngo');
const DonationVault = require('../models/vault');
const AidEntry = require('../models/aid');
const dotenv = require('dotenv');
dotenv.config();

// Import contract ABIs - these need to be in your project
const NGORegistryABI = require('../../BlockChain/artifacts/contracts/NGORegistry.sol/NGORegistry.json').abi;
const AidTrackerABI = require('../../BlockChain/artifacts/contracts/AidTracker.sol/AidTracker.json').abi;
const DonationVaultABI = require('../../BlockChain/artifacts/contracts/DonationVault.sol/DonationVault.json').abi;

// Configure blockchain connection
const { ethers } = require('ethers');
const provider = new ethers.JsonRpcProvider('http://localhost:8545'); // Default Hardhat local network
const privateKey = process.env.PRIVATE_KEY;
const signer = new ethers.Wallet(privateKey, provider);

// Contract addresses - should be set after deployment
const NGO_REGISTRY_ADDRESS = process.env.NGO_REGISTRY_ADDRESS;
const AID_TRACKER_ADDRESS = process.env.AID_TRACKER_ADDRESS;
const DONATION_VAULT_ADDRESS = process.env.DONATION_VAULT_ADDRESS;

// Initialize contract instances
const ngoRegistry = new ethers.Contract(NGO_REGISTRY_ADDRESS, NGORegistryABI, signer);
const aidTracker = new ethers.Contract(AID_TRACKER_ADDRESS, AidTrackerABI, signer);
const donationVault = new ethers.Contract(DONATION_VAULT_ADDRESS, DonationVaultABI, signer);



async function syncDonationStats() {
    try {
        const stats = await donationVault.getStats();

        // Check if stats are valid
        if (!stats || stats.length !== 4) {
            console.error("Invalid stats data received:", stats);
            return;
        }

        // Find or create the donation vault document
        let vault = await DonationVault.findOne();
        if (!vault) {
            vault = new DonationVault();
        }

        // Update with latest blockchain data
        vault.totalReceived = ethers.formatEther(stats[0]); // balance
        vault.totalDistributed = ethers.formatEther(stats[2]); // distributed
        vault.totalReturned = ethers.formatEther(stats[3]); // returned

        await vault.save();

        return vault;
    } catch (error) {
        console.error('Error syncing donation stats:', error);
        throw error;
    }
}


/**
 * NGO Management Controllers
 */
const ngoController = {

    registerNGO: async (req, res) => {
        try {
          const { name, walletAddress, darpanId, metadata, email, phone } = req.body;
      
          if (!ethers.isAddress(walletAddress)) {
            return res.status(400).json({ success: false, message: 'Invalid wallet address' });
          }
      
          const existingNGO = await Ngo.findOne({
            $or: [{ walletAddress }, { darpanId }]
          });
      
          if (existingNGO) {
            return res.status(400).json({
              success: false,
              message: 'NGO with this wallet address or DARPAN ID already exists'
            });
          }
      
          const tx = await ngoRegistry.registerNGO(walletAddress, name, metadata);
          const receipt = await tx.wait();
      
          const event = receipt.logs
            .map(log => {
              try {
                return ngoRegistry.interface.parseLog(log);
              } catch (e) {
                return null;
              }
            })
            .find(event => event && event.name === 'NGORegistered');
      
          const blockchainId = event ? parseInt(event.args.ngoId.toString()) : 0;
      
          const newNGO = new Ngo({
            name,
            walletAddress,
            darpanId,
            metadata,
            isApproved: true,
            needsFunding: false,
            blockchainId // ✅ include this in schema
          });
      
          await newNGO.save();
      
          const ngoUser = new User({
            role: 'ngo',
            name,
            email,
            phone,
            walletAddress,
            darpanId,
            verified: true,
            ngoId: newNGO._id // ✅ link to NGO
          });
      
          await ngoUser.save();
      
          res.status(201).json({
            success: true,
            message: 'NGO registered successfully',
            data: {
              _id: newNGO._id,
              blockchainId,
              transactionHash: receipt.hash
            }
          });
      
        } catch (error) {
          console.error('Error registering NGO:', error);
          res.status(500).json({
            success: false,
            message: 'Error registering NGO',
            error: error.message
          });
        }
      }
,  
  updateNGOStatus: async (req, res) => {
    try {
      const { ngoId } = req.params;
      const { isApproved, needsFunding } = req.body;
      
      // Find NGO in MongoDB
      const ngo = await Ngo.findById(ngoId);
      if (!ngo) {
        return res.status(404).json({ success: false, message: 'NGO not found' });
      }
  
      const blockchainId = ngo.blockchainId; // ✅ safer and correct
      
      // Update status on blockchain
      const tx = await ngoRegistry.updateNGOStatus(blockchainId, isApproved, needsFunding);
      const receipt = await tx.wait();
  
      // Update MongoDB
      ngo.isApproved = isApproved;
      ngo.needsFunding = needsFunding;
      await ngo.save();
      
      res.json({
        success: true,
        message: 'NGO status updated successfully',
        data: {
          ngo: {
            _id: ngo._id,
            isApproved: ngo.isApproved,
            needsFunding: ngo.needsFunding
          },
          transactionHash: receipt.hash
        }
      });
    } catch (error) {
      console.error('Error updating NGO status:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error updating NGO status', 
        error: error.message 
      });
    }
  },
  
  getNGOsInNeed: async (req, res) => {
    try {
      // Get NGOs needing funding from blockchain
      const blockchainNGOIds = await ngoRegistry.getNGOsInNeed();
      
      // Get NGOs needing funding from MongoDB
      const mongoNGOs = await Ngo.find({ 
        isApproved: true, 
        needsFunding: true 
      });
      
      // Return MongoDB data as it's more detailed
      res.json({
        success: true,
        data: {
          ngos: mongoNGOs,
          blockchainCount: blockchainNGOIds.length
        }
      });
    } catch (error) {
      console.error('Error getting NGOs in need:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error getting NGOs in need', 
        error: error.message 
      });
    }
  },
  
  getNGOById: async (req, res) => {
    try {
      const { ngoId } = req.params;
      
      const ngo = await Ngo.findById(ngoId);
      if (!ngo) {
        return res.status(404).json({ success: false, message: 'NGO not found' });
      }
      
      res.json({
        success: true,
        data: ngo
      });
    } catch (error) {
      console.error('Error getting NGO:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error getting NGO', 
        error: error.message 
      });
    }
  },
  
  getAllNGOs: async (req, res) => {
    try {
      const ngos = await Ngo.find();
      
      res.json({
        success: true,
        data: ngos
      });
    } catch (error) {
      console.error('Error getting all NGOs:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error getting all NGOs', 
        error: error.message 
      });
    }
  }
};

const aidController = {
  /**
   * Create a new aid card for a beneficiary
   */
  createAidCard: async (req, res) => {
    try {
      const { beneficiaryId, metadata } = req.body;
      
      // Create aid card on blockchain
      const tx = await aidTracker.createAidCard(beneficiaryId, metadata);
      const receipt = await tx.wait();
      
      // We could create a MongoDB model for AidCards if needed
      // For now, we'll just return the blockchain transaction info
      
      res.status(201).json({
        success: true,
        message: 'Aid card created successfully',
        data: {
          beneficiaryId,
          metadata,
          transactionHash: receipt.hash
        }
      });
    } catch (error) {
      console.error('Error creating aid card:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error creating aid card', 
        error: error.message 
      });
    }
  },
  
  recordAidDistribution: async (req, res) => {
    try {
      const { beneficiaryId, ngoId, amount, details, aidType, quantity } = req.body;
      
      // Find NGO in MongoDB
      const ngo = await Ngo.findById(ngoId);
      if (!ngo) {
        return res.status(404).json({ success: false, message: 'NGO not found' });
      }
      
      // Get blockchain NGO ID (this would need to be mapped)
      const blockchainNgoId = req.body.blockchainId || 0;
      
      // Record distribution on blockchain
      const tx = await aidTracker.recordAidDistribution(
        beneficiaryId,
        blockchainNgoId,
        amount,
        details
      );
      const receipt = await tx.wait();
      
      // Create aid entry in MongoDB
      const aidEntry = new AidEntry({
        ngoId: ngo._id,
        aidType: aidType || 'food', // Default to food if not specified
        quantity,
        notes: details,
        transactionHash: receipt.hash
      });
      
      await aidEntry.save();
      
      res.status(201).json({
        success: true,
        message: 'Aid distribution recorded successfully',
        data: {
          aidEntry,
          transactionHash: receipt.hash
        }
      });
    } catch (error) {
      console.error('Error recording aid distribution:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error recording aid distribution', 
        error: error.message 
      });
    }
  },
  
  getAidDistribution: async (req, res) => {
    try {
      const { beneficiaryId } = req.params;
      
      // Get distribution count from blockchain
      const count = await aidTracker.getDistributionCount(beneficiaryId);
      
      // Get all distributions from blockchain
      const distributions = [];
      for (let i = 0; i < count; i++) {
        const distribution = await aidTracker.getDistribution(beneficiaryId, i);
        distributions.push({
          ngoId: distribution.ngoId.toString(),
          amount: ethers.formatEther(distribution.amount),
          timestamp: new Date(distribution.timestamp * 1000).toISOString(),
          details: distribution.details
        });
      }
      
      // Find matching aid entries in MongoDB
      const aidEntries = await AidEntry.find({
        transactionHash: { $in: distributions.map(d => d.transactionHash) }
      }).populate('ngoId', 'name');
      
      res.json({
        success: true,
        data: {
          beneficiaryId,
          distributionCount: count.toString(),
          distributions,
          detailedEntries: aidEntries
        }
      });
    } catch (error) {
      console.error('Error getting aid distributions:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error getting aid distributions', 
        error: error.message 
      });
    }
  }
};

const donationController = {
processDonation : async (req, res) => {
        try {
            const { userId, amount, transactionHash } = req.body;
    
            // Validate inputs
            if (!amount || amount <= 0) {
                return res.status(400).json({ success: false, message: 'Invalid donation amount' });
            }
    
            // Find donor in MongoDB
            const donor = await User.findById(userId);
            if (!donor) {
                return res.status(404).json({ success: false, message: 'Donor not found' });
            }
    
            // Get/create donation vault document
            let vault = await DonationVault.findOne();
            if (!vault) {
                vault = new DonationVault();
            }
    
            // Add donation to vault
            vault.donations.push({
                donorId: donor._id,
                amount,
                transactionHash,
                date: new Date()
            });
    
            vault.totalReceived += amount;
            await vault.save();
    
            // Update donor's donation history
            donor.totalDonations += amount;
            donor.donationHistory.push(vault.donations[vault.donations.length - 1]._id);
            await donor.save();
    
            // Sync with blockchain data
            await syncDonationStats();
    
            res.status(201).json({
                success: true,
                message: 'Donation processed successfully',
                data: {
                    donation: vault.donations[vault.donations.length - 1],
                    totalDonated: donor.totalDonations
                }
            });
        } catch (error) {
            console.error('Error processing donation:', error);
            res.status(500).json({
                success: false,
                message: 'Error processing donation',
                error: error.message
            });
        }
},
   fundNGO : async (req, res) => {
    try {
      const { ngoId, amount, donorWallet } = req.body;
  
      // Validate inputs
      if (!ngoId || !amount || !donorWallet) {
        return res.status(400).json({ success: false, message: 'Missing required parameters' });
      }
  
      if (amount <= 0) {
        return res.status(400).json({ success: false, message: 'Invalid funding amount' });
      }
  
  
      // Validate donor wallet address
      if (!isAddress(donorWallet)) {
        return res.status(400).json({ success: false, message: 'Invalid donor wallet address' });
      }
  
      console.log('Donor Wallet:', donorWallet); // Log donor wallet to check if it's correctly passed
  
      // Find NGO in MongoDB
      const ngo = await Ngo.findById(ngoId);
      if (!ngo) {
        return res.status(404).json({ success: false, message: 'NGO not found' });
      }
  
      console.log('NGO:', ngo); // Log NGO data to ensure it's fetched correctly
  
      // Validate NGO's wallet
      if (!ngo.walletAddress || !isAddress(ngo.walletAddress)) {
        return res.status(400).json({ success: false, message: 'NGO has invalid wallet address' });
      }
  
      // Validate NGO's blockchainId
      if (typeof ngo.blockchainId !== 'number') {
        return res.status(400).json({ success: false, message: 'NGO missing blockchainId' });
      }
  
      // Fund NGO on blockchain
      const tx = await donationVault.donateFor(donorWallet, {
        value: parseEther(amount.toString())
      });
      const receipt = await tx.wait();
  
      // Get or create donation vault document
      let vault = await DonationVault.findOne();
      if (!vault) {
        vault = new DonationVault();
      }
  
      // Add funding to vault
      vault.fundings.push({
        ngoId: ngo._id,
        amount,
        donorWallet,
        ngoWallet: ngo.walletAddress,
        transactionHash: receipt.hash,
        date: new Date()
      });
  
      vault.totalDistributed += amount;
      await vault.save();
  
      // Update NGO funding history
      ngo.totalReceived += amount;
      ngo.fundingHistory.push({
        amount,
        transactionHash: receipt.hash,
        donorWallet,
        ngoWallet: ngo.walletAddress,
        date: new Date()
      });
  
      await ngo.save();
  
      // Optionally sync blockchain stats (if required)
      // await syncDonationStats();
  
      // Return response
      res.status(201).json({
        success: true,
        message: 'NGO funded successfully',
        data: {
          funding: vault.fundings[vault.fundings.length - 1],
          transactionHash: receipt.hash,
          ngoTotalReceived: ngo.totalReceived
        }
      });
    } catch (error) {
      console.error('Error funding NGO:', error);
      res.status(500).json({
        success: false,
        message: 'Error funding NGO',
        error: error.message
      });
    }
  }
,  
  
  getDonationStats: async (req, res) => {
    try {
      // Sync with blockchain first
      await syncDonationStats();
      
      // Get MongoDB data
      const vault = await DonationVault.findOne();
      if (!vault) {
        return res.status(404).json({ success: false, message: 'Donation vault not found' });
      }
      
      // Get blockchain data
      const blockchainStats = await donationVault.getStats();
  
      // Validate blockchain stats response
      if (blockchainStats === "0x" || !blockchainStats) {
        return res.status(400).json({
          success: false,
          message: 'Invalid data from blockchain'
        });
      }
  
      res.json({
        success: true,
        data: {
          mongoDB: {
            totalReceived: vault.totalReceived,
            totalDistributed: vault.totalDistributed,
            totalReturned: vault.totalReturned,
            donationCount: vault.donations.length,
            fundingCount: vault.fundings.length
          },
          blockchain: {
            balance: ethers.formatEther(blockchainStats.balance),
            totalDonated: ethers.formatEther(blockchainStats.donated),
            totalDistributed: ethers.formatEther(blockchainStats.distributed),
            totalReturned: ethers.formatEther(blockchainStats.returned)
          }
        }
      });
    } catch (error) {
      console.error('Error getting donation stats:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error getting donation stats', 
        error: error.message 
      });
    }
  }
,  
  
  getDonationHistory: async (req, res) => {
    try {
      const vault = await DonationVault.findOne()
        .populate('donations.donorId', 'name email walletAddress');
      
      if (!vault) {
        return res.status(404).json({ success: false, message: 'Donation vault not found' });
      }
      
      res.json({
        success: true,
        data: vault.donations
      });
    } catch (error) {
      console.error('Error getting donation history:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error getting donation history', 
        error: error.message 
      });
    }
  },
  
  getFundingHistory: async (req, res) => {
    try {
      const vault = await DonationVault.findOne()
        .populate('fundings.ngoId', 'name walletAddress');
      
      if (!vault) {
        return res.status(404).json({ success: false, message: 'Donation vault not found' });
      }
      
      res.json({
        success: true,
        data: vault.fundings
      });
    } catch (error) {
      console.error('Error getting funding history:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error getting funding history', 
        error: error.message 
      });
    }
  }
};


const userController = {
  /**
   * Create a new user (donor or family)
   */
  createUser: async (req, res) => {
    try {
      const { role, name, email, phone, walletAddress, password, ngoId } = req.body;
      
      // Validate inputs
      if (!['donor', 'family'].includes(role)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid role. Must be donor or family' 
        });
      }
      
      if (role === 'donor' && !ethers.isAddress(walletAddress)) {
        return res.status(400).json({ success: false, message: 'Invalid wallet address' });
      }
      
      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'User with this email already exists' });
      }
      
      // Create user
      const newUser = new User({
        role,
        name,
        email,
        phone,
        walletAddress: role === 'donor' ? walletAddress : undefined,
        password: role === 'family' ? password : undefined,
        ngoId: ngoId || undefined
      });
      
      await newUser.save();
      
      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: {
          _id: newUser._id,
          role: newUser.role,
          name: newUser.name,
          email: newUser.email
        }
      });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error creating user', 
        error: error.message 
      });
    }
  },
  
  /**
   * Get user by ID
   */
  getUserById: async (req, res) => {
    try {
      const { userId } = req.params;
      
      const user = await User.findById(userId)
        .populate('ngoId', 'name')
        .populate('donationHistory');
      
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      
      // Remove sensitive data
      const userData = user.toObject();
      delete userData.password;
      
      res.json({
        success: true,
        data: userData
      });
    } catch (error) {
      console.error('Error getting user:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error getting user', 
        error: error.message 
      });
    }
  }
};

module.exports = {
  ngoController,
  aidController,
  donationController,
  userController
};