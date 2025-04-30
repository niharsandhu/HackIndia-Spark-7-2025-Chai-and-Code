"use client";

import { useState } from 'react';
import { ethers } from 'ethers';
import Navbar from '../components/Navbar';
import { useWeb3 } from '../contexts/Web3Context';
import { uploadToIPFS } from '../utils/ipfs';

export default function DonatePage() {
  const { isConnected, account, signer, contracts } = useWeb3();
  const [amount, setAmount] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');

  const handleDonate = async (e) => {
    e.preventDefault();
    
    if (!isConnected || !signer) {
      setError('Please connect your wallet first.');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      // Convert amount to wei
      const amountInWei = ethers.utils.parseEther(amount);
      
      // Store donation metadata in IPFS
      let metadataCid = null;
      if (message || !isAnonymous) {
        const metadata = {
          donor: isAnonymous ? 'Anonymous' : account,
          message: message || '',
          date: new Date().toISOString(),
        };
        
        metadataCid = await uploadToIPFS(metadata);
      }
      
      // Send transaction to donate
      const tx = await signer.sendTransaction({
        to: contracts.donationVault.address,
        value: amountInWei,
        data: metadataCid ? ethers.utils.toUtf8Bytes(metadataCid) : '0x',
      });
      
      setTxHash(tx.hash);
      await tx.wait();
      
      // Clear form
      setAmount('');
      setMessage('');
      
      // Show success message
      alert('Donation successful!');
    } catch (err) {
      console.error('Donation error:', err);
      setError(`Failed to process donation: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-10">
            Make a Donation
          </h1>
          
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-10">
            <div className="px-4 py-5 sm:p-6">
              <div className="text-center mb-6">
                <p className="text-lg text-gray-700">
                  Your donation will be collected in our main wallet and distributed to NGOs in need.
                </p>
              </div>
              
              {!isConnected ? (
                <div className="text-center py-6">
                  <p className="text-red-600 mb-4">You need to connect your wallet to donate.</p>
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => window.connectWallet()}
                  >
                    Connect Wallet
                  </button>
                </div>
              ) : (
                <form onSubmit={handleDonate} className="space-y-6">
                  <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                      Donation Amount (ETH)
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        name="amount"
                        id="amount"
                        step="0.001"
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="0.1"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                      Message (Optional)
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="message"
                        name="message"
                        rows={3}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="Add a message with your donation"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="anonymous"
                      name="anonymous"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                    />
                    <label htmlFor="anonymous" className="ml-2 block text-sm text-gray-900">
                      Donate anonymously
                    </label>
                  </div>
                  
                  {error && (
                    <div className="text-red-600 text-sm">
                      {error}
                    </div>
                  )}
                  
                  <div>
                    <button
                      type="submit"
                      className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                        isLoading ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Processing...' : 'Donate'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
          
          {txHash && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">Transaction successful</h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>Your donation has been processed. Thank you for your generosity!</p>
                    <p className="mt-1">
                      <a
                        href={`https://etherscan.io/tx/${txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium underline text-green-700 hover:text-green-600"
                      >
                        View on Etherscan
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Why Donate?</h2>
            <p className="text-gray-700 mb-4">
              Your donations help us support verified NGOs around the world. 100% of your donation goes directly to the causes,
              with all transactions transparently recorded on the blockchain.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-white shadow rounded-lg p-6">
                <div className="text-blue-600 text-2xl mb-3">🔍</div>
                <h3 className="font-bold mb-2">Transparency</h3>
                <p className="text-gray-600">
                  All donations are tracked on the blockchain, providing complete transparency on how funds are used.
                </p>
              </div>
              <div className="bg-white shadow rounded-lg p-6">
                <div className="text-blue-600 text-2xl mb-3">🛡️</div>
                <h3 className="font-bold mb-2">Security</h3>
                <p className="text-gray-600">
                  Smart contracts ensure your donations are securely stored and properly distributed.
                </p>
              </div>
              <div className="bg-white shadow rounded-lg p-6">
                <div className="text-blue-600 text-2xl mb-3">📊</div>
                <h3 className="font-bold mb-2">Impact</h3>
                <p className="text-gray-600">
                  Track the impact of your donations through our aid tracker and see how your contribution makes a difference.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}