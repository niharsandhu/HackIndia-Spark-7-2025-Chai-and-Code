'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Html5QrcodeScanner } from 'html5-qrcode';

const DistributeAidWithQR = () => {
  const [quantityGiven, setQuantityGiven] = useState(1);
  const [aidReceiverId, setAidReceiverId] = useState('');
  const [loading, setLoading] = useState(false);

  // Static aidId for distribution
  const aidId = '68140a837ca93aeb725f6249';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      aidId,
      quantityGiven,
      qrCodeData: aidReceiverId
    };

    try {
      const response = await axios.post('http://localhost:3002/api/distribute', data);

      toast.success(response.data.message);
      setAidReceiverId('');
      setQuantityGiven(1);
    } catch (error) {
      console.error('Error during distribution:', error);
      toast.error(error.response?.data?.message || 'Failed to distribute aid');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const config = {
      fps: 10,
      qrbox: 250,
    };

    const html5QrCodeScanner = new Html5QrcodeScanner('qr-reader', config);

    html5QrCodeScanner.render(
      (qrCode) => {
        console.log('QR Code Scanned:', qrCode);
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
    <div className="max-w-lg mx-auto p-6 bg-gray-800 text-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-4">Distribute Aid via QR Code</h2>

      <div className="mb-4" id="qr-reader"></div>

      <form onSubmit={handleSubmit} className="space-y-4">
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
