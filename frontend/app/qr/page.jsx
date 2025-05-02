'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const FetchQRCode = () => {
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchQRCode = async () => {
      setLoading(true);
      const userId = localStorage.getItem('userId');

      if (!userId) {
        toast.error('User not found. Please log in.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3002/api/aidqr/${userId}`);
        if (response.data.qrCode) {
          setQrCode(response.data.qrCode);
        } else {
          toast.error('QR code not found for this user.');
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch QR code');
      } finally {
        setLoading(false);
      }
    };

    fetchQRCode();
  }, []);

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-800 text-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-4">Your Aid Receiver QR Code</h2>

      {loading ? (
        <div className="text-center">Loading QR Code...</div>
      ) : qrCode ? (
        <div className="flex justify-center">
          <img src={qrCode} alt="Aid Receiver QR Code" className="w-48 h-48" />
        </div>
      ) : (
        <div className="text-center">No QR Code found.</div>
      )}
    </div>
  );
};

export default FetchQRCode;
