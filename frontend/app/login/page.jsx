'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Login() {
  const [account, setAccount] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(true);

  useEffect(() => {
    // Check if MetaMask is installed
    if (typeof window !== 'undefined') {
      const { ethereum } = window;
      setIsMetaMaskInstalled(!!ethereum && ethereum.isMetaMask);
    }
  }, []);

  const connectWallet = async () => {
    setIsConnecting(true);
    setError('');

    try {
      if (window.ethereum) {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        
        // Listen for account changes
        window.ethereum.on('accountsChanged', (accounts) => {
          setAccount(accounts[0] || '');
        });
      } else {
        throw new Error('MetaMask is not installed');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to connect to MetaMask');
    } finally {
      setIsConnecting(false);
    }
  };

  const installMetaMask = () => {
    window.open('https://metamask.io/download/', '_blank');
  };

  return (
    <div className="min-h-screen bg-black p-4 flex items-center justify-center">
      <div className="bg-black rounded-lg shadow-xl p-8 max-w-md w-full border-2 border-yellow-500">
        <div className="flex justify-center mb-6">
          <div className="relative w-20 h-20">
            <Image 
              src="/api/placeholder/100/100"
              alt="MetaMask Logo"
              layout="fill"
              objectFit="contain"
            />
          </div>
        </div>
          
          <h1 className="text-2xl font-bold text-center mb-8 text-white">Connect with MetaMask</h1>
          
          {error && (
            <div className="bg-red-900/50 border border-red-600 text-red-200 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          {account ? (
            <div className="mb-6">
              <div className="bg-green-900/50 border border-green-600 text-green-200 px-4 py-3 rounded mb-4">
                Connected successfully!
              </div>
              <p className="text-center text-gray-300 mb-2">Your account:</p>
              <p className="bg-gray-800 p-3 rounded text-center font-mono text-sm break-all text-gray-200">
                {account}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {isMetaMaskInstalled ? (
                <button
                  onClick={connectWallet}
                  disabled={isConnecting}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
                >
                  {isConnecting ? (
                    <span>Connecting...</span>
                  ) : (
                    <span>Connect MetaMask</span>
                  )}
                </button>
              ) : (
                <button
                  onClick={installMetaMask}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
                >
                  Install MetaMask
                </button>
              )}
              
              <p className="text-center text-sm text-gray-400 mt-4">
                Connect your MetaMask wallet to access our decentralized application.
              </p>
            </div>
          )}
          
          <div className="mt-8 pt-6 border-t border-gray-700">
            <p className="text-xs text-center text-gray-400">
              By connecting your wallet, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
  );
}