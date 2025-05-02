'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import dynamic from 'next/dynamic';
import Navbar from "@/components/navbar";
import { AlertTriangle, Heart, MessageCircle, Share2, Users, Flame, TrendingUp, ArrowRight, Info, Activity, Globe, Eye, ExternalLink, ChevronDown, Search, Bell, Menu, X } from "lucide-react";
import CrisisReportForm from "@/components/CrisisReportForm";
import axios from "axios";

const MotionDiv = dynamic(() => import('framer-motion').then(mod => mod.motion.div), { ssr: false });

export default function DisasterReliefCommunity() {
  const [activeTab, setActiveTab] = useState("urgent");
  const [impactValue, setImpactValue] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDisaster, setCurrentDisaster] = useState(null);
  const [selectedNgoId, setSelectedNgoId] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [donationAmount, setDonationAmount] = useState(100);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [animateCount, setAnimateCount] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isReportFormOpen, setIsReportFormOpen] = useState(false);
  const [disasters, setDisasters] = useState([]);
  const [donorId, setDonorId] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedUserRole = localStorage.getItem("userRole");
    if (storedUserId) {
      setDonorId(storedUserId);
      console.log("Fetched donorId from localStorage:", storedUserId);
    }
    if (storedUserRole) {
      setUserRole(storedUserRole);
    }
  }, []);

  // Fetch disasters from the API
  useEffect(() => {
    const fetchDisasters = async () => {
      try {
        const response = await axios.get("http://localhost:3002/api/allcrises");
        setDisasters(response.data);
        console.log("Fetched disasters:", response.data);
      } catch (error) {
        console.error("Error fetching disaster data", error);
        // Set some fallback data in case the API fails
        setDisasters([
          {
            id: "1",
            name: "Cyclone Mocha",
            place: "Bay of Bengal, India",
            description: "Category 5 cyclone causing widespread flooding and damage",
            situationRating: 9.2,
            timeline: "Ongoing",
            coverImage: "/api/placeholder/800/600",
            logo: "/api/placeholder/64/64",
            organization: "Disaster Relief India",
            raised: 250000,
            fundsRequired: 1000000,
            updates: [
              {
                time: "2 hours ago",
                text: "Emergency teams deployed to coastal regions, evacuation underway"
              }
            ]
          }
        ]);
      }
    };

    fetchDisasters();
  }, []);

  const handleDonate = async (ngoId, amount) => {
    try {
      const response = await axios.post("http://localhost:3002/api/send-funds", {
        donorId,
        ngoId,
        amount
      });
      console.log("Donation successful:", response.data);
    } catch (error) {
      console.error("Donation failed:", error);
    }
  };

  // Sort disasters by severity
  const sortedDisasters = [...disasters].sort((a, b) =>
    (b.situationRating || 0) - (a.situationRating || 0)
  );

  // Auto-increment impact counter
  useEffect(() => {
    const timer = setTimeout(() => {
      setImpactValue(prev => (prev < 100 ? prev + 1 : 0));
    }, 50);
    return () => clearTimeout(timer);
  }, [impactValue]);

  // Animate count effect
  useEffect(() => {
    setAnimateCount(true);
    const timer = setTimeout(() => {
      setAnimateCount(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleSend = () => {
    if (inputValue.trim()) {
      // Handle new post/comment
      setInputValue("");
    }
  };

  // Open modal with specific disaster data
  const openDisasterModal = (disaster) => {
    setCurrentDisaster(disaster);
    setSelectedNgoId(disaster.ngoId._id);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentDisaster(null);
  };

  const openReportForm = () => {
    setIsReportFormOpen(true);
  };

  const closeReportForm = () => {
    setIsReportFormOpen(false);
  };

  // Calculate donation progress percentage
  const getProgressPercentage = (raised, goal) => {
    if (!raised || !goal) return 0;
    return Math.min(100, Math.round((raised / goal) * 100));
  };

  // Get severity indicator color
  const getSeverityColor = (severity) => {
    if (!severity) return "text-gray-500";
    if (severity >= 9) return "text-red-500";
    if (severity >= 7) return "text-orange-500";
    return "text-yellow-500";
  };

  const getSeverityLabel = (severity) => {
    if (!severity) return "Unknown";
    if (severity >= 9) return "Critical";
    if (severity >= 7) return "Severe";
    if (severity >= 5) return "Moderate";
    return "Developing";
  };

  return (
    <>
      <div className="min-h-screen bg-black text-white">
        {/* Enhanced Navigation */}
        <div className="container mx-auto px-4 py-4 bg-black">
          <Navbar />
        </div>

        {/* Enhanced Hero section with dynamic impact visualization */}
        <div className="relative h-96 bg-black overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60"></div>
          <div className="absolute inset-0 backdrop-blur-sm">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-600/40 via-transparent to-transparent"></div>
          </div>

          {/* Animated emergency dots */}
          <div className="absolute inset-0 overflow-hidden">
            {Array(15).fill(0).map((_, i) => (
              <MotionDiv
                key={i}
                initial={{
                  x: typeof window !== 'undefined' ? Math.random() * window.innerWidth : 0,
                  y: typeof window !== 'undefined' ? Math.random() * window.innerHeight : 0,
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
                className="absolute w-2 h-2 rounded-full bg-yellow-500 animated-dot"
              />
            ))}
          </div>

          <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center relative z-10">
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-5xl md:text-6xl font-bold mb-4 text-white text-center"
            >
              Global Disaster <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-yellow-400">Response Network</span>
            </MotionDiv>

            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-center text-gray-300 max-w-2xl mb-8"
            >
              Connecting communities in crisis with immediate relief and resources
            </MotionDiv>

            {/* Live stats panel */}
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-black backdrop-blur-md p-4 rounded-xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 w-full max-w-3xl mb-8 border border-gray-800"
            >
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center">
                  <Activity className="text-yellow-500 h-5 w-5 mr-2" />
                  <p className="text-gray-400 text-sm">Active Crises</p>
                </div>
                <MotionDiv
                  key={animateCount}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="text-2xl font-bold text-white"
                >
                  {disasters.length}
                </MotionDiv>
              </div>

              <div className="h-12 w-px bg-gray-700 hidden md:block"></div>

              <div className="flex flex-col items-center text-center">
                <div className="flex items-center">
                  <Users className="text-orange-500 h-5 w-5 mr-2" />
                  <p className="text-gray-400 text-sm">People Affected</p>
                </div>
                <MotionDiv
                  key={animateCount}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="text-2xl font-bold text-white"
                >
                  5.4M+
                </MotionDiv>
              </div>

              <div className="h-12 w-px bg-gray-700 hidden md:block"></div>

              <div className="flex flex-col items-center text-center">
                <div className="flex items-center">
                  <Heart className="text-red-500 h-5 w-5 mr-2" />
                  <p className="text-gray-400 text-sm">Raised This Week</p>
                </div>
                <MotionDiv
                  key={animateCount}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="text-2xl font-bold text-white"
                >
                  $4.5M
                </MotionDiv>
              </div>
            </MotionDiv>

            <div className="flex flex-col md:flex-row gap-4">
           
                <MotionDiv
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-yellow-500 text-white px-8 py-3 rounded-full font-semibold flex items-center justify-center shadow-lg shadow-red-600/20"
                  onClick={openReportForm}
                >
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  Report Emergency
                </MotionDiv>
        
            
                
            
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="container mx-auto px-4 py-8">
          {/* Filter tabs */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-800">
              <button
                className={`px-6 py-3 font-medium text-lg whitespace-nowrap ${activeTab === 'urgent' ? 'text-yellow-400 border-b-2 border-yellow-500' : 'text-gray-400'}`}
                onClick={() => setActiveTab('urgent')}
              >
                <span className="flex items-center">
                  <Flame className="h-5 w-5 mr-2" />
                  Urgent Crises
                </span>
              </button>
              <button
                className={`px-6 py-3 font-medium text-lg whitespace-nowrap ${activeTab === 'recent' ? 'text-yellow-400 border-b-2 border-yellow-500' : 'text-gray-400'}`}
                onClick={() => setActiveTab('recent')}
              >
                <span className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Recent Updates
                </span>
              </button>
              <button
                className={`px-6 py-3 font-medium text-lg whitespace-nowrap ${activeTab === 'following' ? 'text-yellow-400 border-b-2 border-yellow-500' : 'text-gray-400'}`}
                onClick={() => setActiveTab('following')}
              >
                <span className="flex items-center">
                  <Eye className="h-5 w-5 mr-2" />
                  Following
                </span>
              </button>
            </div>

            <div className="hidden md:flex items-center">
              <span className="text-gray-400 mr-2">Sort by:</span>
              <select className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1 text-sm focus:outline-none focus:border-red-500">
                <option>Severity</option>
                <option>Recent</option>
                <option>Funding Needed</option>
              </select>
            </div>
          </div>

          {/* Enhanced Disaster cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedDisasters.map((disaster, index) => (
              <MotionDiv
                key={disaster.id ?? `disaster-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-black backdrop-blur-sm rounded-xl overflow-hidden shadow-xl border border-gray-700 hover:border-yellow-500/50 transition-all duration-300 cursor-pointer group"
                onClick={() => openDisasterModal(disaster)}
                onMouseEnter={() => setHoveredCard(disaster.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Severity indicator */}
                <div className="flex justify-between items-center px-4 py-2 bg-gray-900/80">
                  <div className="flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full mr-2 ${
                        disaster.situationRating >= 9
                          ? "bg-red-500 animate-pulse"
                          : disaster.situationRating >= 7
                          ? "bg-orange-500"
                          : "bg-yellow-500"
                      }`}
                    ></div>
                    <span
                      className={`text-sm font-medium ${getSeverityColor(
                        disaster.situationRating
                      )}`}
                    >
                      {getSeverityLabel(disaster.situationRating)} ({typeof disaster.situationRating === "number"
                        ? disaster.situationRating.toFixed(1)
                        : "N/A"})
                    </span>
                  </div>
                  <span className="text-sm text-gray-400">{disaster.timeline}</span>
                </div>

                {/* Cover image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={disaster.coverImage || "/api/placeholder/800/600"}
                    alt={disaster.title || "Disaster"}
                    fill
                    className="object-cover transform transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent h-24"></div>
                  <div className="absolute bottom-0 left-0 p-4">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 rounded-full overflow-hidden mr-2 bg-gray-700 border border-gray-600">
                        <Image
                          src={disaster.logo || "/api/placeholder/32/32"}
                          alt={disaster.organization || "Organization"}
                          width={32}
                          height={32}
                        />
                      </div>
                      <span className="text-sm font-medium">{disaster.ngoId?.name}</span>
                    </div>
                  </div>

                  {/* Quick action buttons on hover */}
                  <MotionDiv
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredCard === disaster.id ? 1 : 0 }}
                    className="absolute top-2 right-2 flex gap-2"
                  >
                    <button className="p-2 bg-gray-800/80 backdrop-blur-sm rounded-full hover:bg-red-500/80 transition-colors">
                      <Heart className="h-4 w-4" />
                    </button>
                    <button className="p-2 bg-gray-800/80 backdrop-blur-sm rounded-full hover:bg-blue-500/80 transition-colors">
                      <Share2 className="h-4 w-4" />
                    </button>
                  </MotionDiv>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-1 group-hover:text-yellow-400 transition-colors">
                    {disaster.name}
                  </h3>
                  <p className="text-sm text-gray-400 mb-3 flex items-center">
                    <Globe className="h-3 w-3 mr-1" />
                    {disaster.place}
                  </p>

                  <p className="text-sm text-gray-300 mb-4 line-clamp-3">
                    {disaster.description}
                  </p>

                  {/* Progress bar */}
                  <div className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>{disaster.ngoId?.totalDonationReceived ?? 0}Eth raised</span>
                      <span>{disaster.fundsRequired ?? 0}Eth  goal</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
                      <MotionDiv
                        initial={{ width: 0 }}
                        animate={{
                          width: `${getProgressPercentage(
                            disaster.raised ?? 0,
                            disaster.fundsRequired ?? 1
                          )}%`,
                        }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-full rounded-full relative"
                      >
                        <div className="absolute top-0 left-0 w-full h-full bg-white opacity-30 rounded-full animate-pulse"></div>
                      </MotionDiv>
                    </div>
                  </div>

                  {/* Latest update */}
                  {disaster.updates && disaster.updates[0] && (
                    <div className="bg-gray-700/30 backdrop-blur-sm rounded-lg p-3 mb-4 text-sm border border-gray-700 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent to-gray-900 opacity-20"></div>
                      <div className="relative z-10">
                        <p className="font-medium text-orange-300 mb-1">
                          Latest Update • {disaster.updates[0].time}
                        </p>
                        <p>{disaster.updates[0].text}</p>
                      </div>
                    </div>
                  )}
                </div>
              </MotionDiv>
            ))}
          </div>

          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg w-1/2">
                <h2 className="text-2xl font-semibold">{currentDisaster?.ngoId?.name}</h2>
                <p>{currentDisaster?.description}</p>
                <button
                  onClick={closeModal}
                  className="mt-4 p-2 bg-red-500 text-white rounded"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Donation Impact Section */}
        <div className="bg-black py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Your Donation's Impact</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-800/50 rounded-xl p-6 text-center">
                <div className="text-5xl font-bold text-orange-500 mb-2">25 Eth</div>
                <p className="text-lg mb-4">Provides emergency food for a family of four for one week</p>
                <MotionDiv
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg"
                >
                  Donate 25 Eth
                </MotionDiv>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-6 text-center transform scale-110 shadow-lg border border-red-500/30">
                <div className="text-5xl font-bold text-red-500 mb-2">100 Eth</div>
                <p className="text-lg mb-4">Supplies clean water, shelter kits, and medical aid for a displaced family</p>
                <MotionDiv
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
                >
                  Donate 100 Eth
                </MotionDiv>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-6 text-center">
                <div className="text-5xl font-bold text-blue-500 mb-2">500 Eth</div>
                <p className="text-lg mb-4">Funds rescue operations and critical infrastructure repairs</p>
                <MotionDiv
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                >
                  Donate 500 Eth
                </MotionDiv>
              </div>
            </div>
          </div>
        </div>

        {/* Global impact map - Simplified version */}
        <div className="bg-black py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Ongoing Relief Operations</h2>

            <div className="bg-black rounded-xl p-4 h-80 relative overflow-hidden border border-yellow-300">
              {/* World map placeholder - In a real implementation, this would be an interactive map */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src="/api/placeholder/1200/600"
                  alt="Global disaster map"
                  width={1200}
                  height={600}
                  className="object-cover opacity-60"
                />

                {/* Animated hotspots that would be positioned on the map */}
                <div className="absolute top-1/4 left-1/3">
                  <div className="w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
                  <div className="w-4 h-4 bg-red-500 rounded-full absolute top-0"></div>
                </div>

                <div className="absolute top-1/3 right-1/4">
                  <div className="w-4 h-4 bg-orange-500 rounded-full animate-ping"></div>
                  <div className="w-4 h-4 bg-orange-500 rounded-full absolute top-0"></div>
                </div>

                <div className="absolute bottom-1/4 right-1/3">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full animate-ping"></div>
                  <div className="w-4 h-4 bg-yellow-500 rounded-full absolute top-0"></div>
                </div>
              </div>

              <div className="absolute bottom-4 right-4 bg-black p-3 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <span className="text-sm">Critical Response (5)</span>
                </div>
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                  <span className="text-sm">Active Operations (12)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                  <span className="text-sm">Recovery Phase (8)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with quick action buttons */}
        <div className="bg-black border-t border-gray-800 py-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-between items-center">
              <div className="mb-4 md:mb-0">
                <h3 className="text-xl font-bold">Global Disaster Response Network</h3>
                <p className="text-gray-400">Making a difference through immediate action</p>
              </div>

              <div className="flex flex-wrap gap-4">
                <button className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg flex items-center">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Report Crisis
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  Join as NGO
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg flex items-center">
                  <Heart className="mr-2 h-4 w-4" />
                  Become Donor
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Disaster detail modal */}
        {isModalOpen && currentDisaster && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-80 flex items-center justify-center p-4">
            <MotionDiv
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-black rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Modal header with close button */}
              <div className="relative h-64">
                <Image
                  src={currentDisaster.coverImage || "/api/placeholder/800/600"}
                  alt={currentDisaster.title || "Disaster"}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>

                <button
                  className="absolute top-4 right-4 bg-black bg-opacity-50 rounded-full p-2"
                  onClick={closeModal}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                <div className="absolute bottom-4 left-4">
                  <div className="flex items-center mb-2">
                    <div className="w-12 h-12 rounded-xl overflow-hidden mr-3 bg-gray-700">
                      <Image
                        src={currentDisaster.logo || "/api/placeholder/48/48"}
                        alt={currentDisaster.organization || "Organization"}
                        width={48}
                        height={48}
                      />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{currentDisaster.name}</h3>
                      <p className="text-gray-300">
                        {currentDisaster?.ngoId?.name} • {currentDisaster?.ngoId?.district}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal content */}
              <div className="p-6">
                {/* Severity and timeline */}
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center">
                    <div
                      className={`w-4 h-4 rounded-full mr-2 ${
                        currentDisaster.situationRating >= 9
                          ? "bg-red-500 animate-pulse"
                          : currentDisaster.situationRating >= 7
                          ? "bg-orange-500"
                          : "bg-yellow-500"
                      }`}
                    ></div>
                    <span
                      className={`font-medium ${getSeverityColor(
                        currentDisaster.situationRating
                      )}`}
                    >
                      {getSeverityLabel(currentDisaster.situationRating)} Situation (
                      {currentDisaster.situationRating
                        ? currentDisaster.situationRating.toFixed(1)
                        : "N/A"}
                      /10)
                    </span>
                  </div>
                  <span className="text-gray-400">{currentDisaster.timeline}</span>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h4 className="text-xl font-semibold mb-2">Situation Overview</h4>
                  <p className="text-gray-300">{currentDisaster.description}</p>
                </div>

                {/* Impact statistics */}
                {currentDisaster.impactStats && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-400">People Affected</p>
                      <p className="text-2xl font-bold text-red-400">
                        {currentDisaster.impactStats.peopleAffected || "Unknown"}
                      </p>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-400">Area Affected</p>
                      <p className="text-2xl font-bold text-orange-400">
                        {currentDisaster.impactStats.areaAffected || "Unknown"}
                      </p>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-400">Critical Needs</p>
                      <div className="flex flex-wrap justify-center gap-2 mt-2">
                        {currentDisaster.impactStats.criticalNeeds?.map((need, i) => (
                          <span key={i} className="bg-gray-600 px-2 py-1 rounded text-sm">
                            {need}
                          </span>
                        )) || <span className="text-gray-400">Data unavailable</span>}
                      </div>
                    </div>
                  </div>
                )}

                {/* Progress bar */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold">Fundraising Progress</h4>
                    <span className="text-gray-400">
                      {getProgressPercentage(
                        currentDisaster.ngoId.totalDonationReceived || 0,
                        currentDisaster.fundsRequired || 1
                      )}
                      % of goal
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
                    <MotionDiv
                      className="bg-gradient-to-r from-red-600 to-orange-500 h-full rounded-full relative"
                      style={{
                        width: `${getProgressPercentage(
                          currentDisaster.ngoId.totalDonationReceived || 0,
                          currentDisaster.fundsRequired || 1
                        )}%`,
                      }}
                    >
                      <div className="absolute -right-2 -top-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-xs font-bold">
                        {getProgressPercentage(
                          currentDisaster.ngoId.totalDonationReceived || 0,
                          currentDisaster.fundsRequired || 1
                        )}
                        %
                      </div>
                    </MotionDiv>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{(currentDisaster.ngoId.totalDonationReceived || 0).toLocaleString()}Eth raised</span>
                    <span>
                      {(currentDisaster.fundsRequired || 0).toLocaleString()}Eth goal
                    </span>
                  </div>
                </div>

                {/* Latest updates */}
                {currentDisaster.updates && currentDisaster.updates.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-xl font-semibold mb-4">Latest Updates</h4>
                    <div className="space-y-4">
                      {currentDisaster.updates.map((update, i) => (
                        <div key={i} className="bg-gray-700/50 rounded-lg p-4">
                          <p className="text-sm text-orange-300 mb-1">{update.time}</p>
                          <p>{update.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Donation options */}
                <div className="mb-6">
                  <h4 className="text-xl font-semibold mb-4">Make a Donation</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    {[25, 50, 100].map((amount) => (
                      <MotionDiv
                        key={amount}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDonate(selectedNgoId, amount)}
                        className={`cursor-pointer ${
                          amount === 100 ? "bg-red-600 hover:bg-red-700" : "bg-gray-700 hover:bg-gray-600"
                        } rounded-lg p-3 text-center`}
                      >
                        <div className="text-lg font-bold">{amount}Eth</div>
                        <div className="text-sm text-gray-400">{amount === 100 ? "Popular" : "One-time"}</div>
                      </MotionDiv>
                    ))}

                    {/* Custom amount (could be made interactive later) */}
                    <MotionDiv
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gray-700 hover:bg-gray-600 rounded-lg p-3 text-center"
                    >
                      <div className="text-lg font-bold">Custom</div>
                      <div className="text-sm text-gray-400">Any amount</div>
                    </MotionDiv>
                  </div>

                  {/* Main donate and interaction buttons */}
                  <div className="flex gap-4 mb-4">
                    <MotionDiv
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleDonate(selectedNgoId, donationAmount)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-lg flex items-center justify-center cursor-pointer"
                    >
                      Donate {donationAmount}Eth
                    </MotionDiv>
                    <MotionDiv
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-gray-700 hover:bg-gray-600 py-3 px-4 rounded-lg flex items-center justify-center cursor-pointer"
                    >
                      <Heart className="h-5 w-5" />
                    </MotionDiv>
                    <MotionDiv
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-gray-700 hover:bg-gray-600 py-3 px-4 rounded-lg flex items-center justify-center cursor-pointer"
                    >
                      <Share2 className="h-5 w-5" />
                    </MotionDiv>
                  </div>

                  <div className="bg-gray-700/30 rounded-lg p-4 text-sm">
                    <p className="mb-2">Your donation is tax-deductible. You'll receive a receipt via email.</p>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Funds are transferred directly to verified organizations</span>
                    </div>
                  </div>
                </div>

                {/* Ways to help */}
                <div className="mb-6">
                  <h4 className="text-xl font-semibold mb-4">Other Ways to Help</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-gray-700 rounded-lg p-4 flex flex-col items-center text-center">
                      <Users className="h-8 w-8 text-blue-400 mb-2" />
                      <h5 className="font-medium mb-1">Volunteer</h5>
                      <p className="text-sm text-gray-300">Join the response team on the ground</p>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-4 flex flex-col items-center text-center">
                      <svg className="h-8 w-8 text-green-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <h5 className="font-medium mb-1">Spread Awareness</h5>
                      <p className="text-sm text-gray-300">Share this crisis with your network</p>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-4 flex flex-col items-center text-center">
                      <svg className="h-8 w-8 text-purple-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                      <h5 className="font-medium mb-1">Supply Donations</h5>
                      <p className="text-sm text-gray-300">Contribute needed items and supplies</p>
                    </div>
                  </div>
                </div>

                {/* Community discussion */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-xl font-semibold">Community Discussion</h4>
                    <span className="text-sm text-gray-400">{currentDisaster?.engagement?.donations} participants</span>
                  </div>

                  <div className="bg-gray-700/30 rounded-lg mb-4">
                    <div className="border-b border-gray-700 p-4">
                      <div className="flex items-start mb-2">
                        <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                          <Image
                            src="/api/placeholder/40/40"
                            alt="User avatar"
                            width={40}
                            height={40}
                          />
                        </div>
                        <div>
                          <div className="flex items-center">
                            <span className="font-medium mr-2">Rebecca Thompson</span>
                            <span className="text-xs text-gray-400">2 hours ago</span>
                          </div>
                          <p className="text-sm mt-1">I'm organizing a supply drive in Boston this weekend. Anyone in the area who wants to help, please message me!</p>
                        </div>
                      </div>

                      <div className="flex items-center mt-3 pl-12 text-sm">
                        <button className="flex items-center mr-4 text-gray-400 hover:text-white">
                          <Heart className="h-4 w-4 mr-1" />
                          <span>12</span>
                        </button>
                        <button className="flex items-center mr-4 text-gray-400 hover:text-white">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          <span>Reply</span>
                        </button>
                        <button className="flex items-center text-gray-400 hover:text-white">
                          <Share2 className="h-4 w-4 mr-1" />
                          <span>Share</span>
                        </button>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="flex items-start mb-2">
                        <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                          <Image
                            src="/api/placeholder/40/40"
                            alt="User avatar"
                            width={40}
                            height={40}
                          />
                        </div>
                        <div>
                          <div className="flex items-center">
                            <span className="font-medium mr-2">Michael Chen</span>
                            <span className="text-xs text-gray-400">5 hours ago</span>
                          </div>
                          <p className="text-sm mt-1">Just donated and shared with my network. The situation looks dire - is there any update on when relief supplies will reach the most remote areas?</p>
                        </div>
                      </div>

                      <div className="flex items-center mt-3 pl-12 text-sm">
                        <button className="flex items-center mr-4 text-gray-400 hover:text-white">
                          <Heart className="h-4 w-4 mr-1" />
                          <span>8</span>
                        </button>
                        <button className="flex items-center mr-4 text-gray-400 hover:text-white">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          <span>Reply</span>
                        </button>
                        <button className="flex items-center text-gray-400 hover:text-white">
                          <Share2 className="h-4 w-4 mr-1" />
                          <span>Share</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Comment input */}
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                      <Image
                        src="/api/placeholder/40/40"
                        alt="Your avatar"
                        width={40}
                        height={40}
                      />
                    </div>
                    <div className="flex-1 bg-gray-700 rounded-full p-2 flex items-center">
                      <input
                        type="text"
                        placeholder="Add a comment or ask a question..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="w-full bg-transparent text-white focus:outline-none px-3"
                      />
                      <button
                        onClick={handleSend}
                        className="ml-2 px-4 py-1 bg-red-600 hover:bg-red-700 text-white rounded-full"
                      >
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </MotionDiv>
          </div>
        )}

        {/* Fixed action bar for mobile */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-3">
          <div className="flex justify-between">
            <MotionDiv
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-red-600 text-white rounded-lg py-3 px-6 font-medium flex-grow mr-2"
            >
              Donate Now
            </MotionDiv>
            <MotionDiv
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gray-700 text-white rounded-lg py-3 px-4"
            >
              <Share2 className="h-5 w-5" />
            </MotionDiv>
          </div>
        </div>
      </div>

      {/* Conditionally render the CrisisReportForm */}
      {isReportFormOpen && <CrisisReportForm onClose={closeReportForm} />}
    </>
  );
}