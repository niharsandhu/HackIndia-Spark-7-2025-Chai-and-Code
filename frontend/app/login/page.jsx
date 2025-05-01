'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation'; // Import useRouter

export default function Login() {
  const [role, setRole] = useState('');
  const [account, setAccount] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(true);
  const [nonce, setNonce] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [details, setDetails] = useState({
    name: '',
    email: '',
    phoneNo: '',
    darbanId: '',
    state: '',
    district: '',
    type: '',
    password: '',
    numberOfFamilyMembers: '',
    familyLeaderName: '',
    location: { lat: '', lng: '' }
  });

  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const { ethereum } = window;
      setIsMetaMaskInstalled(!!ethereum && ethereum.isMetaMask);
    }
  }, []);

  const handleRoleSelection = (selectedRole) => {
    setRole(selectedRole);
    setError('');
    setIsRegistered(false);
    setAccount('');
    setNonce('');
  };

  const connectWallet = async () => {
    setIsConnecting(true);
    setError('');
  
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
  
      // Check if the user is already registered
      const checkResponse = await axios.post('http://localhost:3002/api/check-registration', {
        address: accounts[0],
        role: role === 'ngo' ? 'NGO' : role === 'donor' ? 'Donor' : role,
      });
  
      if (checkResponse.data.isRegistered) {
        setIsRegistered(true);
  
        // Automatically request nonce
        const response = await axios.post('http://localhost:3002/api/request-nonce', {
          address: accounts[0],
          role: role === 'ngo' ? 'NGO' : role === 'donor' ? 'Donor' : role,
        });
  
        if (response.data.nonce) {
          setNonce(response.data.nonce);
          router.push('/');
          return; // Ensure the rest of the function doesn't run
        } else {
          throw new Error('Failed to retrieve nonce');
        }
      }
  
      window.ethereum.on('accountsChanged', (accounts) => {
        setAccount(accounts[0] || '');
      });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'MetaMask connection failed');
    } finally {
      setIsConnecting(false);
    }
  };
  

  const verifySignature = async (signature) => {
    try {
      const res = await axios.post('http://localhost:3002/api/verify-signature', {
        address: account,
        signature,
        role: role === 'ngo' ? 'NGO' : role === 'donor' ? 'Donor' : role,
        ...details,
      });

      if (res.data.message === 'Login successful') {
        alert('Login successful!');
        router.push('/'); // Redirect to homepage
      } else {
        throw new Error(res.data.message || 'Signature verification failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Signature verification failed');
    }
  };

  const handleSignMessage = async () => {
    if (!nonce) {
      setError('No nonce available');
      return;
    }

    try {
      const message = `Login request with nonce: ${nonce}`;
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, account],
      });

      verifySignature(signature);
    } catch (err) {
      setError(err.message || 'Message signing failed');
    }
  };

  const handleAidReceiverLogin = async () => {
    try {
      const res = await axios.post('http://localhost:3002/api/login-aidreceiver', {
        email: details.email,
        password: details.password,
      });

      if (res.data.message === 'Login successful') {
        alert('AidReceiver login successful!');
        router.push('/'); // Redirect to homepage
      } else {
        throw new Error(res.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmitDetails = async () => {
    if (!['ngo', 'donor', 'aidreceiver'].includes(role)) {
      setError('Invalid role selected');
      return;
    }

    try {
      const data = {
        role: role === 'ngo' ? 'NGO' : role === 'donor' ? 'Donor' : role,
        ...details,
        blockchainWalletAddress: account,
      };

      console.log('Submitting details:', data); // Log the data being sent

      if (role === 'ngo') {
        data.darbanId = details.darbanId;
        data.state = details.state;
        data.district = details.district;
        data.type = details.type;
      }

      const res = await axios.post('http://localhost:3002/api/register', data);

      if (res.data.message) {
        alert('Details submitted successfully!');
        setIsRegistered(true);
        try {
          const response = await axios.post('http://localhost:3002/api/request-nonce', {
            address: account,
            role: role === 'ngo' ? 'NGO' : role === 'donor' ? 'Donor' : role,
          });

          if (response.data.nonce) {
            setNonce(response.data.nonce);
          } else {
            throw new Error('Failed to retrieve nonce');
          }
        } catch (err) {
          console.error('Error requesting nonce:', err);
          setError('Failed to retrieve nonce. Please try again.');
        }
      } else {
        throw new Error(res.data.error);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };



  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-black border-2 border-yellow-500 rounded-lg shadow-lg p-6 max-w-md w-full">
        {!role ? (
          <div className="space-y-4">
            <h2 className="text-white text-xl font-bold text-center">Select Your Role</h2>
            <button onClick={() => handleRoleSelection('ngo')} className="btn">NGO</button>
            <button onClick={() => handleRoleSelection('donor')} className="btn">Donor</button>
            <button onClick={() => handleRoleSelection('aidreceiver')} className="btn">Aid Receiver</button>
          </div>
        ) : (
          <>
            <h2 className="text-white text-xl font-bold text-center mb-4">
              {role === 'aidreceiver' ? 'Aid Receiver Login' : `${role.toUpperCase()} MetaMask Login`}
            </h2>

            {role !== 'aidreceiver' && isMetaMaskInstalled && !account ? (
              <div className="flex justify-center">
                <button onClick={connectWallet} className="btn" disabled={isConnecting}>
                  {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
                </button>
              </div>
            ) : role === 'aidreceiver' ? (
              <div className="space-y-4">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="input"
                  value={details.email}
                  onChange={handleChange}
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="input"
                  value={details.password}
                  onChange={handleChange}
                />
                <button onClick={handleAidReceiverLogin} className="btn">Login</button>
              </div>
            ) : (
              <>
                {isRegistered ? (
                  <div>
                    {nonce ? (
                      <button onClick={handleSignMessage} className="btn">Sign Message</button>
                    ) : (
                      <p className="text-red-500 text-center mt-4">Nonce not available. Please try again.</p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4 mt-4">
                    <input
                      type="text"
                      name="name"
                      placeholder="Name"
                      className="input"
                      value={details.name}
                      onChange={handleChange}
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      className="input"
                      value={details.email}
                      onChange={handleChange}
                    />
                    <input
                      type="text"
                      name="phoneNo"
                      placeholder="Phone Number"
                      className="input"
                      value={details.phoneNo}
                      onChange={handleChange}
                    />
                    {role === 'ngo' && (
                      <>
                        <input
                          type="text"
                          name="darbanId"
                          placeholder="Darban ID"
                          className="input"
                          value={details.darbanId}
                          onChange={handleChange}
                        />
                        <input
                          type="text"
                          name="state"
                          placeholder="State"
                          className="input"
                          value={details.state}
                          onChange={handleChange}
                        />
                        <input
                          type="text"
                          name="district"
                          placeholder="District"
                          className="input"
                          value={details.district}
                          onChange={handleChange}
                        />
                        <input
                          type="text"
                          name="type"
                          placeholder="Type"
                          className="input"
                          value={details.type}
                          onChange={handleChange}
                        />
                      </>
                    )}
                    <button onClick={handleSubmitDetails} className="btn">
                      Submit Details
                    </button>
                  </div>
                )}
              </>
            )}

            {error && <p className="text-red-500 text-center mt-4">{error}</p>}
          </>
        )}
      </div>
    </div>
  );
}
