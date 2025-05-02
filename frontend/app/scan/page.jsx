'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Html5QrcodeScanner } from 'html5-qrcode';

const DistributeAidWithQR = () => {
  const [aidType, setAidType] = useState('');
  const [quantityGiven, setQuantityGiven] = useState(1);
  const [aidReceiverId, setAidReceiverId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = { aidType, quantityGiven, qrCodeData: aidReceiverId };

    // Debugging: Log the data being sent to the server
    console.log('Submitting data:', data);

    try {
      const response = await axios.post('http://localhost:3002/api/distribute', data);
      
      // Debugging: Log the server response
      console.log('Server Response:', response);

      toast.success(response.data.message);
      setAidReceiverId('');
      setQuantityGiven(1);
      setAidType('');
    } catch (error) {
      // Debugging: Log the error if the request fails
      console.error('Error during distribution:', error);

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
        // Debugging: Log the scanned QR code
        console.log('QR Code Scanned:', qrCode);
        setAidReceiverId(qrCode);
      },
      (errorMessage) => {
        // Debugging: Log any errors during QR code scanning
        console.error('QR Code Scanning Error:', errorMessage);
      }
    );

    return () => {
      html5QrCodeScanner.clear();
    };
  }, []);

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-800 text-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-4">Distribute Aid via QR Code</h2>

      {/* QR Code Scanner */}
      <div className="mb-4" id="qr-reader"></div>

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
        <select
  value={aidType}
  onChange={(e) => setAidType(e.target.value)}
  className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none"
  required
>
  <option value="">Select Aid Type</option>
  <option value="Medicines">Medicines</option>
  <option value="Food">Food</option>
  <option value="Clothes">Clothes</option>
  <option value="Daily Essentials">Daily Essentials</option>
</select>

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
          className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? 'Distributing...' : 'Distribute Aid'}
        </button>
      </form>
    </div>
  );
};

export default DistributeAidWithQR;
