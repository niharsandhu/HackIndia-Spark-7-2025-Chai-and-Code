'use client';
import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [role, setRole] = useState('ngo'); // "ngo", "donor", or "aidreceiver"
  const [details, setDetails] = useState({
    email: '',
    password: '',
    blockchainWalletAddress: '',
  });

  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleLogin = async () => {
    try {
      let url = '';
      let payload = {};

      if (role === 'ngo' || role === 'donor') {
        url = `http://localhost:3002/api/login/${role}`;
        payload = {
          email: details.email,
          blockchainWalletAddress: details.blockchainWalletAddress,
        };
      } else if (role === 'aidreceiver') {
        url = `http://localhost:3002/api/login/aidReceiver`;
        payload = {
          email: details.email,
          password: details.password,
        };
      }

      const res = await axios.post(url, payload);

      // Store token and user ID in localStorage
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.ngoId || res.data.donorId || res.data.aidReceiverId);
      alert(`${role.toUpperCase()} login successful!`);

      // Redirect based on role
      if (role === 'ngo') {
        window.location.href = '/dashboard/ngo';
      } else if (role === 'donor') {
        window.location.href = '/dashboard/donor';
      } else {
        window.location.href = '/dashboard/aidreceiver';
      }

    } catch (error) {
      console.error('Login error:', error.response?.data?.message || error.message);
      alert(`Login failed: ${error.response?.data?.message || 'Server error'}`);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: 'auto' }}>
      <h2>Login</h2>

      <label>
        Select Role:
        <select value={role} onChange={handleRoleChange}>
          <option value="ngo">NGO</option>
          <option value="donor">Donor</option>
          <option value="aidreceiver">Aid Receiver</option>
        </select>
      </label>

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={details.email}
        onChange={handleChange}
        required
        style={{ display: 'block', marginTop: '1rem' }}
      />

      {(role === 'ngo' || role === 'donor') && (
        <input
          type="text"
          name="blockchainWalletAddress"
          placeholder="Blockchain Wallet Address"
          value={details.blockchainWalletAddress}
          onChange={handleChange}
          required
          style={{ display: 'block', marginTop: '1rem' }}
        />
      )}

      {role === 'aidreceiver' && (
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={details.password}
          onChange={handleChange}
          required
          style={{ display: 'block', marginTop: '1rem' }}
        />
      )}

      <button onClick={handleLogin} style={{ marginTop: '1.5rem' }}>
        Login
      </button>
    </div>
  );
};

export default Login;
