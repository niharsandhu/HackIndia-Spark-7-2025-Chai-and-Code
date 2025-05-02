'use client';
import { useState, useEffect } from 'react';
import { MapPin, Users, Clock, Mail, Lock } from "lucide-react";
import Image from 'next/image';
const UserDashboard = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Dummy user data
    const dummyData = {
      _id: "6813ec32e901f45d89640b06",
      email: "niharsandhu25@gmail.com",
      noOfFamilyMembers: 2,
      familyLeaderName: "nihar",
      crisisName: "Odisha Cyclone",
      latitude: 30.722865596330152,
      longitude: 76.78999784044466,
      createdAt: "2025-05-01T21:48:34.685+00:00",
      updatedAt: "2025-05-01T21:48:34.748+00:00",
      qrCode: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIQAAACECAYAAABRRIOnAAAA…",
      aidReceived: {
        aidType: "Medical",
        quantity: 4,
        date: "2025-05-01"
      }
    };

    setUserData(dummyData);
  }, []);

  if (!userData) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-black backdrop-blur-sm rounded-xl overflow-hidden shadow-xl border border-gray-700 p-6">
          <h2 className="text-3xl font-bold mb-8 text-center">User Dashboard</h2>

          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <MapPin className="h-6 w-6 text-yellow-500" />
              <div>
                <h3 className="text-xl font-semibold">Location</h3>
                <p>Latitude: {userData.latitude}</p>
                <p>Longitude: {userData.longitude}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Users className="h-6 w-6 text-yellow-500" />
              <div>
                <h3 className="text-xl font-semibold">Family Information</h3>
                <p>Family Leader: {userData.familyLeaderName}</p>
                <p>Number of Family Members: {userData.noOfFamilyMembers}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Clock className="h-6 w-6 text-yellow-500" />
              <div>
                <h3 className="text-xl font-semibold">Crisis Information</h3>
                <p>Crisis Name: {userData.crisisName}</p>
                <p>Created At: {new Date(userData.createdAt).toLocaleString()}</p>
                <p>Updated At: {new Date(userData.updatedAt).toLocaleString()}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Mail className="h-6 w-6 text-yellow-500" />
              <div>
                <h3 className="text-xl font-semibold">Contact Information</h3>
                <p>Email: {userData.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div>
                <h3 className="text-xl font-semibold">QR Code</h3>
                <Image src="/qr.png" alt="QR Code" height={30} width={30} className="w-24 h-24"/>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div>
                <h3 className="text-xl font-semibold">Aid Received</h3>
                <p>Aid Type: {userData.aidReceived.aidType}</p>
                <p>Quantity: {userData.aidReceived.quantity}</p>
                <p>Date: {new Date(userData.aidReceived.date).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
