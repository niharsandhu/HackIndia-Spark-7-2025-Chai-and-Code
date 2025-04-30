"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, NETWORK } from '../config';

// Import contract ABIs
import NGORegistryABI from '../abis/NGORegistry.json';
import AidTrackerABI from '../abis/AidTracker.json';
import DonationVaultABI from '../abis/DonationVault.json';

// Create context
const Web3Context = createContext();

export function Web3Provider({ children }) {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [chainId, setChainId] = useState(null);
  const [contracts, setContracts] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Initialize provider
  useEffect(() => {
    const initProvider = async () => {
      try {
        // Check if window.ethereum is available (MetaMask or similar)
        if (window.ethereum) {
          const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
          setProvider(web3Provider);
          
          // Initialize contracts
          initContracts(web3Provider);
          
          // Check if already connected
          const accounts = await web3Provider.listAccounts();
          if (accounts.length > 0) {
            const web3Signer = web3Provider.getSigner();
            setSigner(web3Signer);
            setAccount(accounts[0]);
            setIsConnected(true);
          }
          
          // Get network
          const network = await web3Provider.getNetwork();
          setChainId(network.chainId);
        } else {
          console.log("No ethereum wallet detected");
          // Initialize with read-only provider
          const infuraProvider = new ethers.providers.JsonRpcProvider(NETWORK.rpcUrl);
          setProvider(infuraProvider);
          initContracts(infuraProvider);
        }
      } catch (error) {
        console.error("Web3 initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initProvider();
  }, []);

  // Initialize contract instances
  const initContracts = (provider) => {
    try {
      const ngoRegistry = new ethers.Contract(
        CONTRACT_ADDRESSES.NGO_REGISTRY,
        NGORegistryABI.abi,
        provider
      );
      
      const aidTracker = new ethers.Contract(
        CONTRACT_ADDRESSES.AID_TRACKER,
        AidTrackerABI.abi,
        provider
      );
      
      const donationVault = new ethers.Contract(
        CONTRACT_ADDRESSES.DONATION_VAULT,
        DonationVaultABI.abi,
        provider
      );
      
      setContracts({
        ngoRegistry,
        aidTracker,
        donationVault
      });
    } catch (error) {
      console.error("Error initializing contracts:", error);
    }
  };

  // Handle account changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setSigner(provider.getSigner());
          setIsConnected(true);
        } else {
          setAccount(null);
          setSigner(null);
          setIsConnected(false);
        }
      };
      
      const handleChainChanged = () => {
        window.location.reload();
      };
      
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [provider]);

  // Connect wallet function
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        throw new Error("No Ethereum wallet found. Please install MetaMask or similar.");
      }
      
      setIsLoading(true);
      
      // Request accounts
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      
      if (accounts.length > 0) {
        const web3Signer = provider.getSigner();
        setSigner(web3Signer);
        setAccount(accounts[0]);
        setIsConnected(true);
        
        // Update contracts with signer
        updateContractsWithSigner(web3Signer);
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Update contracts with signer
  const updateContractsWithSigner = (signer) => {
    try {
      const ngoRegistry = new ethers.Contract(
        CONTRACT_ADDRESSES.NGO_REGISTRY,
        NGORegistryABI.abi,
        signer
      );
      
      const aidTracker = new ethers.Contract(
        CONTRACT_ADDRESSES.AID_TRACKER,
        AidTrackerABI.abi,
        signer
      );
      
      const donationVault = new ethers.Contract(
        CONTRACT_ADDRESSES.DONATION_VAULT,
        DonationVaultABI.abi,
        signer
      );
      
      setContracts({
        ngoRegistry,
        aidTracker,
        donationVault
      });
    } catch (error) {
      console.error("Error updating contracts with signer:", error);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setAccount(null);
    setSigner(null);
    setIsConnected(false);
    initContracts(provider); // Reset to read-only contracts
  };

  // Expose everything via context
  const contextValue = {
    provider,
    signer,
    account,
    isConnected,
    chainId,
    contracts,
    isLoading,
    connectWallet,
    disconnectWallet
  };

  return (
    <Web3Context.Provider value={contextValue}>
      {children}
    </Web3Context.Provider>
  );
}

// Custom hook to use the context
export function useWeb3() {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}

// Make connectWallet available globally
if (typeof window !== 'undefined') {
  window.connectWallet = async () => {
    const web3Provider = document.querySelector('[data-web3-provider]');
    if (web3Provider && web3Provider._reactInternals) {
      const context = web3Provider._reactInternals.return.stateNode.context;
      if (context && context.connectWallet) {
        await context.connectWallet();
      } else {
        console.error("Web3 context is not available.");
      }
    } else {
      console.error("Web3Provider is not rendered in the DOM.");
    }
  };
}