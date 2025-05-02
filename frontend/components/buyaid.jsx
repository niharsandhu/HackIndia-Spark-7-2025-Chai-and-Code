'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { AlertTriangle, X } from "lucide-react";

const BuyAid = ({ onClose }) => {
  const [aidType, setAidType] = useState('');
  const [quantityPurchased, setQuantityPurchased] = useState(1);
  const [unitCost, setUnitCost] = useState('');
  const [ngoId, setNgoId] = useState('');

  useEffect(() => {
    // Get NGO ID (userId) from localStorage
    const storedId = localStorage.getItem('userId');
    if (storedId) {
      setNgoId(storedId);
    } else {
      toast.error('NGO ID not found in localStorage');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { aidType, quantityPurchased, unitCost, ngoId };
    try {
      const res = await axios.post('http://localhost:3002/api/buy', data);
      toast.success(res.data.message);
      setAidType('');
      setQuantityPurchased(1);
      setUnitCost('');
      onClose(); // Close the modal after successful submission
    } catch (err) {
      toast.error(err.response?.data?.message || 'Purchase failed');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-black backdrop-blur-sm rounded-xl overflow-hidden shadow-xl border border-gray-700 p-6 w-full max-w-md">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-white">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-3xl font-bold mb-8 text-center">Purchase Aid</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="aidType" className="block text-sm font-medium text-gray-400">
              Aid Type
            </label>
            <select
              id="aidType"
              value={aidType}
              onChange={(e) => setAidType(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none"
              required
            >
              <option value="" disabled>Select Aid Type</option>
              <option value="Food">Food</option>
              <option value="Daily Essentials">Daily Essentials</option>
              <option value="Medicines">Medicines</option>
              <option value="Clothes">Clothes</option>
            </select>
          </div>
          <div>
            <label htmlFor="quantityPurchased" className="block text-sm font-medium text-gray-400">
              Quantity
            </label>
            <input
              type="number"
              id="quantityPurchased"
              value={quantityPurchased}
              onChange={(e) => setQuantityPurchased(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none"
              min={1}
              required
            />
          </div>
          <div>
            <label htmlFor="unitCost" className="block text-sm font-medium text-gray-400">
              Unit Cost (₹)
            </label>
            <input
              type="number"
              id="unitCost"
              value={unitCost}
              onChange={(e) => setUnitCost(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none"
              min={1}
              required
            />
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-yellow-500 text-white px-8 py-3 rounded-full font-semibold flex items-center justify-center shadow-lg shadow-red-600/20 mt-4"
          >
            <AlertTriangle className="mr-2 h-5 w-5" />
            <button type="submit">Purchase Aid</button>
          </motion.div>
        </form>
      </div>
    </div>
  );
};

export default BuyAid;