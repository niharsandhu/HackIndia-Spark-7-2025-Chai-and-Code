'use client';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';

const Donate = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [amount, setAmount] = useState('');
  const [selectedNgo, setSelectedNgo] = useState('');
  const [ngos, setNgos] = useState([]);
  const [message, setMessage] = useState('');

  // Load NGO list (assumes backend API is providing the list)
  useEffect(() => {
    const fetchNgos = async () => {
      try {
        const response = await axios.get('http://localhost:3002/api/ngos');
        setNgos(response.data.ngos); // Because backend sends { ngos: [...] }
      } catch (error) {
        console.error('NGO fetch error:', error);
        setMessage('Error fetching NGO data.');
      }
    };
  
    fetchNgos();
  }, []);
  

  // Connect Metamask
  const connectMetamask = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        setWalletAddress(accounts[0]);
        setIsConnected(true);
      } catch (error) {
        setMessage('Failed to connect to Metamask');
      }
    } else {
      setMessage('Metamask not installed');
    }
  };

  // Handle donation submission
  const handleDonation = async () => {
    if (!walletAddress || !amount || !selectedNgo) {
      setMessage('Please connect wallet, enter amount and select NGO.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3002/api/donate', {
        donorWallet: walletAddress,
        amount,
      });

      if (response.status === 200) {
        setMessage(`Donation successful! Tx Hash: ${response.data.transactionHash}`);
      }
    } catch (error) {
      setMessage('Error while processing donation');
    }
  };

  return (
    <div>
      <h1>Donate to NGO</h1>
      {!isConnected ? (
        <button onClick={connectMetamask}>Connect Metamask</button>
      ) : (
        <p>Connected as {walletAddress}</p>
      )}

<div>
  <h3>Select NGO</h3>
  <select
    value={selectedNgo}
    onChange={(e) => setSelectedNgo(e.target.value)}
  >
    <option value="">--Select NGO--</option>
    {ngos.map((ngo) => (
      <option key={ngo._id} value={ngo._id}>
        {ngo.name}
      </option>
    ))}
  </select>
</div>


      <div>
        <h3>Enter Donation Amount (ETH)</h3>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount in ETH"
        />
      </div>

      <button onClick={handleDonation}>Donate</button>

      {message && <p>{message}</p>}
    </div>
  );
};

export default Donate;
