'use client';
import React, { useState } from 'react';
import axios from 'axios';

const RegisterPage = () => {
  const [tab, setTab] = useState('ngo');
  const [receiverLocation, setReceiverLocation] = useState({ latitude: '', longitude: '' });

  const [ngoData, setNgoData] = useState({
    darbanId: '', name: '', state: '', district: '', email: '', phoneNo: '', type: '', blockchainWalletAddress: ''
  });

  const [donorData, setDonorData] = useState({
    blockchainWalletAddress: '', name: '', phoneNo: '', email: ''
  });

  const [receiverData, setReceiverData] = useState({
    email: '', password: '', noOfFamilyMembers: '', familyLeaderName: ''
  });

  const handleNgoChange = e => setNgoData({ ...ngoData, [e.target.name]: e.target.value });
  const handleDonorChange = e => setDonorData({ ...donorData, [e.target.name]: e.target.value });
  const handleReceiverChange = e => setReceiverData({ ...receiverData, [e.target.name]: e.target.value });

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      pos => setReceiverLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      err => alert('Location error: ' + err.message)
    );
  };

  const handleSubmit = async e => {
    e.preventDefault();
    let url = '';
    let payload = {};

    try {
      if (tab === 'ngo') {
        url = 'http://localhost:3002/api/ngo';
        payload = ngoData;
      } else if (tab === 'donor') {
        url = 'http://localhost:3002/api/donor';
        payload = donorData;
      } else if (tab === 'receiver') {
        if (!receiverLocation.latitude) return alert('Please fetch location.');
        url = 'http://localhost:3002/api/register/aidreceiver';
        payload = { ...receiverData, ...receiverLocation };
      }

      const res = await axios.post(url, payload);
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
      <h1>Register</h1>
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={() => setTab('ngo')} disabled={tab === 'ngo'}>NGO</button>
        <button onClick={() => setTab('donor')} disabled={tab === 'donor'}>Donor</button>
        <button onClick={() => setTab('receiver')} disabled={tab === 'receiver'}>Aid Receiver</button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {tab === 'ngo' && Object.keys(ngoData).map(key => (
          <input key={key} name={key} value={ngoData[key]} placeholder={key} onChange={handleNgoChange} required />
        ))}

        {tab === 'donor' && Object.keys(donorData).map(key => (
          <input key={key} name={key} value={donorData[key]} placeholder={key} onChange={handleDonorChange} required />
        ))}

        {tab === 'receiver' && (
          <>
            <input name="email" value={receiverData.email} onChange={handleReceiverChange} placeholder="Email" required />
            <input name="password" type="password" value={receiverData.password} onChange={handleReceiverChange} placeholder="Password" required />
            <input name="noOfFamilyMembers" type="number" value={receiverData.noOfFamilyMembers} onChange={handleReceiverChange} placeholder="No. of Family Members" required />
            <input name="familyLeaderName" value={receiverData.familyLeaderName} onChange={handleReceiverChange} placeholder="Family Leader Name" required />
            <button type="button" onClick={getLocation}>Fetch Location</button>
            {receiverLocation.latitude && (
              <p>Location fetched: {receiverLocation.latitude}, {receiverLocation.longitude}</p>
            )}
          </>
        )}

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;
