'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const BuyAid = () => {
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
    } catch (err) {
      toast.error(err.response?.data?.message || 'Purchase failed');
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-800 text-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-4">Purchase Aid</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Aid Type</label>
          <input
            type="text"
            value={aidType}
            onChange={(e) => setAidType(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none"
            placeholder="e.g., Medicine, Food, Tents"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Quantity</label>
          <input
            type="number"
            value={quantityPurchased}
            onChange={(e) => setQuantityPurchased(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none"
            min={1}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Unit Cost (₹)</label>
          <input
            type="number"
            value={unitCost}
            onChange={(e) => setUnitCost(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none"
            min={1}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          Purchase Aid
        </button>
      </form>
    </div>
  );
};

export default BuyAid;
