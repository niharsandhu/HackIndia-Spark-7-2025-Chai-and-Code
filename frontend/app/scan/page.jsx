'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { AlertTriangle } from "lucide-react";

const DistributeAidWithQR = () => {
  const [aidType, setAidType] = useState('');
  const [quantityGiven, setQuantityGiven] = useState(1);
  const [aidReceiverId, setAidReceiverId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = { aidType, quantityGiven, qrCodeData: aidReceiverId };

    try {
      const response = await axios.post('http://localhost:3002/api/distribute', data);
      toast.success(response.data.message);
      setAidReceiverId('');
      setQuantityGiven(1);
      setAidType('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to distribute aid');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const config = {
      fps: 10, // Frames per second to scan
      qrbox: 250, // QR box size
    };

    const html5QrCodeScanner = new Html5QrcodeScanner(
      'qr-reader',
      config
    );

    html5QrCodeScanner.render(
      (qrCode) => {
        setAidReceiverId(qrCode);
      },
      (errorMessage) => {
        console.error('QR Code Scanning Error:', errorMessage);
      }
    );

    return () => {
      html5QrCodeScanner.clear();
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-black backdrop-blur-sm rounded-xl overflow-hidden shadow-xl border border-gray-700 p-6">
          <h2 className="text-3xl font-bold mb-8 text-center">Distribute Aid via QR Code</h2>

          {/* QR Code Scanner */}
          <div className="mb-6" id="qr-reader"></div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Aid Receiver ID is auto-filled from QR scan */}
            <div>
              <label className="block text-sm font-medium mb-1">Aid Receiver ID</label>
              <input
                type="text"
                value={aidReceiverId}
                onChange={(e) => setAidReceiverId(e.target.value)}
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none"
                placeholder="Aid Receiver ID will be auto-filled from QR"
                required
                disabled
              />
            </div>

            {/* Aid Type selection */}
            <div>
              <label className="block text-sm font-medium mb-1">Aid Type</label>
              <select
                value={aidType}
                onChange={(e) => setAidType(e.target.value)}
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none"
                required
              >
                <option value="" disabled>Select Aid Type</option>
                <option value="Medicines">Medicines</option>
                <option value="Food">Food</option>
                <option value="Clothes">Clothes</option>
                <option value="Daily Essentials">Daily Essentials</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Quantity Given</label>
              <input
                type="number"
                value={quantityGiven}
                onChange={(e) => setQuantityGiven(e.target.value)}
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none"
                min={1}
                required
              />
            </div>

            <button
              type="submit"
              className={`w-full bg-gradient-to-r from-yellow-500 text-white px-8 py-3 rounded-full font-semibold flex items-center justify-center shadow-lg shadow-red-600/20 mt-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              <AlertTriangle className="mr-2 h-5 w-5" />
              {loading ? 'Distributing...' : 'Distribute Aid'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DistributeAidWithQR;