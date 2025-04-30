'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminNgoVerification = () => {
  const [ngos, setNgos] = useState([]);
  const [selectedNgo, setSelectedNgo] = useState(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    // Fetch NGOs from the backend
    axios.get('http://localhost:3001/api/ngo/all')
      .then((response) => {
        setNgos(response.data);
      })
      .catch((error) => {
        console.error('Error fetching NGOs:', error);
      });
  }, []);

  const handleVerify = (walletAddress, status) => {
    axios.post('http://localhost:3001/api/ngo/verify', { walletAddress, status })
      .then((response) => {
        console.log(response.data.message);
        // Update the list of NGOs after verification
        setNgos((prevNgos) => prevNgos.map((ngo) =>
          ngo.walletAddress === walletAddress ? { ...ngo, status } : ngo
        ));
        setSelectedNgo(null); // Close the modal
      })
      .catch((error) => {
        console.error('Error verifying NGO:', error);
      });
  };

  return (
    <div>
      <h1>Admin: Verify NGOs</h1>
      <ul>
        {ngos.map((ngo) => (
          <li key={ngo.walletAddress}>
            {ngo.walletAddress} - Status: {ngo.status}
            <button onClick={() => setSelectedNgo(ngo)}>Verify</button>
          </li>
        ))}
      </ul>

      {selectedNgo && (
        <div className="modal">
          <h2>Verify NGO</h2>
          <p>Wallet Address: {selectedNgo.walletAddress}</p>
          <p>Darpan ID: {selectedNgo.darpanId}</p>
          <div>
            <button onClick={() => handleVerify(selectedNgo.walletAddress, 'Approved')}>Approve</button>
            <button onClick={() => handleVerify(selectedNgo.walletAddress, 'Rejected')}>Reject</button>
          </div>
          <button onClick={() => setSelectedNgo(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default AdminNgoVerification;
