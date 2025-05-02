'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertTriangle, User, Wallet, Mail, Lock, ArrowRight, UserCheck, Building, Shield } from 'lucide-react';
import Image from 'next/image';

// We need to use dynamic import for motion components
import dynamic from 'next/dynamic';
const MotionDiv = dynamic(() => import('framer-motion').then(mod => mod.motion.div), { ssr: false });

const Login = () => {
  const [role, setRole] = useState('ngo');
  const [details, setDetails] = useState({
    email: '',
    password: '',
    blockchainWalletAddress: '',
  });
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [animateCount, setAnimateCount] = useState(false);

  useEffect(() => {
    setAnimateCount(true);
    const timer = setTimeout(() => {
      setAnimateCount(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
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
      
      // Redirect based on role
      if (role === 'ngo') {
        window.location.href = '/community';
      } else if (role === 'donor') {
        window.location.href = '/community';
      } else {
        window.location.href = '/community';
      }
    } catch (error) {
      console.error('Login error:', error.response?.data?.message || error.message);
      alert(`Login failed: ${error.response?.data?.message || 'Server error'}`);
    }
  };

  const getRoleIcon = (roleType) => {
    switch (roleType) {
      case 'ngo': 
        return <Building className="h-6 w-6" />;
      case 'donor': 
        return <Wallet className="h-6 w-6" />;
      case 'aidreceiver': 
        return <UserCheck className="h-6 w-6" />;
      default:
        return <User className="h-6 w-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      {/* Animated emergency dots */}
      <div className="absolute inset-0 overflow-hidden">
        {Array(10).fill(0).map((_, i) => (
          <MotionDiv
            key={i}
            initial={{
              x: Math.random() * 100 + '%',
              y: Math.random() * 100 + '%',
              opacity: 0.1 + Math.random() * 0.5
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.7, 0.3]
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
            className="absolute w-2 h-2 rounded-full bg-yellow-500"
          />
        ))}
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60"></div>
      <div className="absolute inset-0 backdrop-blur-sm">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-600/20 via-transparent to-transparent"></div>
      </div>

      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-black backdrop-blur-md p-8 rounded-xl shadow-2xl border border-gray-800 w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <MotionDiv
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-500">
                Global Relief
              </span> Access
            </h2>
            <p className="text-gray-400 mt-2">Sign in to continue your mission</p>
          </MotionDiv>

          {/* Live stats panel */}
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-gray-900/50 backdrop-blur-md p-3 rounded-xl shadow-lg flex items-center justify-between gap-4 mt-4 border border-gray-800"
          >
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center">
                <Shield className="text-red-500 h-4 w-4 mr-1" />
                <p className="text-gray-400 text-xs">Active NGOs</p>
              </div>
              <MotionDiv
                key={animateCount}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="text-lg font-bold text-white"
              >
                124
              </MotionDiv>
            </div>

            <div className="h-12 w-px bg-gray-700"></div>

            <div className="flex flex-col items-center text-center">
              <div className="flex items-center">
                <Wallet className="text-yellow-500 h-4 w-4 mr-1" />
                <p className="text-gray-400 text-xs">Donors</p>
              </div>
              <MotionDiv
                key={animateCount}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="text-lg font-bold text-white"
              >
                2.7K
              </MotionDiv>
            </div>

            <div className="h-12 w-px bg-gray-700"></div>

            <div className="flex flex-col items-center text-center">
              <div className="flex items-center">
                <UserCheck className="text-green-500 h-4 w-4 mr-1" />
                <p className="text-gray-400 text-xs">Aid Recipients</p>
              </div>
              <MotionDiv
                key={animateCount}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="text-lg font-bold text-white"
              >
                89K
              </MotionDiv>
            </div>
          </MotionDiv>
        </div>

        {/* Role selection */}
        <div className="mb-6">
          <label className="text-gray-300 block mb-2">Choose your role:</label>
          <div className="grid grid-cols-3 gap-4">
            {['ngo', 'donor', 'aidreceiver'].map((roleType) => (
              <MotionDiv
                key={roleType}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`cursor-pointer flex flex-col items-center justify-center p-4 rounded-lg border ${
                  role === roleType
                    ? 'border-yellow-500 bg-yellow-500/10'
                    : 'border-gray-700 bg-gray-800/40'
                }`}
                onClick={() => handleRoleChange(roleType)}
              >
                <div className={`mb-2 ${role === roleType ? 'text-yellow-400' : 'text-gray-400'}`}>
                  {getRoleIcon(roleType)}
                </div>
                <span className={`text-sm font-medium ${role === roleType ? 'text-yellow-400' : 'text-gray-300'}`}>
                  {roleType === 'ngo' 
                    ? 'NGO' 
                    : roleType === 'donor' 
                      ? 'Donor' 
                      : 'Aid Receiver'}
                </span>
              </MotionDiv>
            ))}
          </div>
        </div>

        {/* Form fields */}
        <div className="space-y-4">
          <div>
            <label className="text-gray-300 text-sm mb-1 block">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={details.email}
                onChange={handleChange}
                required
                className="w-full bg-gray-800/50 text-white border border-gray-700 rounded-lg py-3 pl-10 pr-3 focus:outline-none focus:border-yellow-500"
              />
            </div>
          </div>

          {(role === 'ngo' || role === 'donor') && (
            <div>
              <label className="text-gray-300 text-sm mb-1 block">Blockchain Wallet</label>
              <div className="relative">
                <Wallet className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  name="blockchainWalletAddress"
                  placeholder="Your wallet address"
                  value={details.blockchainWalletAddress}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800/50 text-white border border-gray-700 rounded-lg py-3 pl-10 pr-3 focus:outline-none focus:border-yellow-500"
                />
              </div>
            </div>
          )}

          {role === 'aidreceiver' && (
            <div>
              <label className="text-gray-300 text-sm mb-1 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={details.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800/50 text-white border border-gray-700 rounded-lg py-3 pl-10 pr-3 focus:outline-none focus:border-yellow-500"
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-end mt-2">
            <a href="#" className="text-sm text-yellow-400 hover:underline">
              Forgot password?
            </a>
          </div>
        </div>

        {/* Login button */}
        <MotionDiv
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="w-full mt-6"
          onHoverStart={() => setIsButtonHovered(true)}
          onHoverEnd={() => setIsButtonHovered(false)}
        >
          <button
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-400 text-black py-3 rounded-lg font-semibold flex items-center justify-center space-x-2"
          >
            <span>Sign In</span>
            <ArrowRight className={`h-5 w-5 transition-transform ${isButtonHovered ? 'translate-x-1' : ''}`} />
          </button>
        </MotionDiv>

        {/* Sign up link */}
        <div className="text-center mt-6">
          <p className="text-gray-400">
            Don't have an account?{' '}
            <a href="/register" className="text-yellow-400 hover:underline">
              Register here
            </a>
          </p>
        </div>

        {/* Security notice */}
        <div className="border-t border-gray-800 mt-8 pt-4 text-xs text-gray-500 flex items-start">
          <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
          <p>
            Your blockchain wallet is secured through our platform. 
            We never store private keys and use industry-standard encryption protocols.
          </p>
        </div>
      </MotionDiv>
    </div>
  );
};

export default Login;