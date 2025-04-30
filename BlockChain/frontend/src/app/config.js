/**
 * Configuration file for the Donation Platform
 * Contains contract addresses and other important constants
 */

export const CONTRACT_ADDRESSES = {
    NGO_REGISTRY: process.env.NEXT_PUBLIC_NGO_REGISTRY_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3", // Default local hardhat address
    AID_TRACKER: process.env.NEXT_PUBLIC_AID_TRACKER_ADDRESS || "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512", // Default local hardhat address
    DONATION_VAULT: process.env.NEXT_PUBLIC_DONATION_VAULT_ADDRESS || "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0" // Default local hardhat address
  };
  
  export const INFURA_PROJECT_ID = process.env.NEXT_PUBLIC_INFURA_PROJECT_ID || "your_infura_project_id";
  export const IPFS_GATEWAY = "https://ipfs.infura.io/ipfs/";
  
  // Network configuration - detects environment and uses appropriate network
  export const NETWORK = {
    development: {
      name: "localhost",
      chainId: 1337,
      rpcUrl: "http://127.0.0.1:8545"
    },
    test: {
      name: "sepolia",
      chainId: 11155111,
      rpcUrl: `https://sepolia.infura.io/v3/${INFURA_PROJECT_ID}`
    },
    production: {
      name: "mainnet",
      chainId: 1,
      rpcUrl: `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`
    },
    // Automatically select network based on environment
    current() {
      const env = process.env.NEXT_PUBLIC_ENV || 'development';
      return this[env];
    }
  };
  
  // API endpoints
  export const API = {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
  };
  
  // Blockchain Explorer URLs
  export const EXPLORER_URLS = {
    development: "http://localhost:8545",
    sepolia: "https://sepolia.etherscan.io",
    mainnet: "https://etherscan.io"
  };
  
  // Default gas settings
  export const GAS_SETTINGS = {
    gasLimit: 3000000,
    gasPrice: null // Use the network's suggested gas price
  };