"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { AlertTriangle, Heart, MessageCircle, Share2, Users, Flame, TrendingUp, ArrowRight, Info, Activity, Globe, Eye, ExternalLink, ChevronDown, Search, Bell, Menu, X } from "lucide-react";
import Navbar from "@/components/navbar";

export default function DisasterReliefCommunity() {
  const [activeTab, setActiveTab] = useState("urgent");
  const [impactValue, setImpactValue] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDisaster, setCurrentDisaster] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [donationAmount, setDonationAmount] = useState(100);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);    
  const [animateCount, setAnimateCount] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  // Sample data with severity levels
  const [disasters, setDisasters] = useState([
    {
      id: 1,
      title: "Southeast Asia Flooding Crisis",
      location: "Thailand, Cambodia, Vietnam",
      organization: "Global Flood Relief",
      logo: "/api/placeholder/40/40",
      coverImage: "/api/placeholder/800/400",
      description: "Devastating floods have displaced over 250,000 people across Southeast Asia. Critical needs include clean water, shelter, and medical supplies.",
      severity: 9.8, // On a scale of 1-10
      raised: 782500,
      goal: 2000000,
      timeline: "3 days left for critical phase",
      updates: [
        { time: "2 hours ago", text: "50 rescue teams deployed to Mekong Delta" },
        { time: "5 hours ago", text: "Emergency supplies airlifted to isolated communities" }
      ],
      impactStats: {
        peopleAffected: "250,000+",
        areaAffected: "6 provinces",
        criticalNeeds: ["Clean water", "Medicine", "Shelter"]
      },
      engagement: { donations: 4205, shares: 12350, volunteers: 389 }
    },
    {
      id: 2,
      title: "Western Wildfire Emergency",
      location: "California, Oregon",
      organization: "Wildfire Response Network",
      logo: "/api/placeholder/40/40",
      coverImage: "/api/placeholder/800/400",
      description: "Wildfires have burned over 1.2 million acres and destroyed hundreds of homes. Evacuation centers are at capacity and need supplies.",
      severity: 8.5,
      raised: 650000,
      goal: 1500000,
      timeline: "5 days left for evacuation support",
      updates: [
        { time: "6 hours ago", text: "New evacuation orders for Mendocino County" },
        { time: "1 day ago", text: "Containment at 15%, expected to grow with weather change" }
      ],
      impactStats: {
        peopleAffected: "120,000+",
        areaAffected: "1.2M acres",
        criticalNeeds: ["Temporary housing", "Respirators", "Animal rescue"]
      },
      engagement: { donations: 3150, shares: 8920, volunteers: 276 }
    },
    {
      id: 3,
      title: "Caribbean Hurricane Recovery",
      location: "Dominican Republic, Haiti",
      organization: "Island Disaster Services",
      logo: "/api/placeholder/40/40",
      coverImage: "/api/placeholder/800/400",
      description: "Hurricane Maria's aftermath has left coastal communities without power, water or communications. Infrastructure damage is extensive.",
      severity: 9.2,
      raised: 890000,
      goal: 3000000,
      timeline: "Critical need for next 7 days",
      updates: [
        { time: "3 hours ago", text: "First aid stations established in Port-au-Prince" },
        { time: "1 day ago", text: "Communications restored to northern coastal areas" }
      ],
      impactStats: {
        peopleAffected: "320,000+",
        areaAffected: "12 coastal towns",
        criticalNeeds: ["Power generators", "Medical supplies", "Food provisions"]
      },
      engagement: { donations: 5120, shares: 14200, volunteers: 412 }
    },
    {
      id: 4,
      title: "East Africa Drought Relief",
      location: "Somalia, Ethiopia, Kenya",
      organization: "African Relief Coalition",
      logo: "/api/placeholder/40/40",
      coverImage: "/api/placeholder/800/400",
      description: "Prolonged drought has created severe food insecurity affecting millions. Crops have failed for three consecutive seasons.",
      severity: 9.5,
      raised: 1250000,
      goal: 5000000,
      timeline: "Long-term crisis, immediate food needs",
      updates: [
        { time: "5 hours ago", text: "Food distribution begun in northern Ethiopia" },
        { time: "2 days ago", text: "Water purification systems deployed to 12 communities" }
      ],
      impactStats: {
        peopleAffected: "4.5 million",
        areaAffected: "3 countries",
        criticalNeeds: ["Food", "Water purification", "Agricultural support"]
      },
      engagement: { donations: 8700, shares: 19500, volunteers: 625 }
    },
    {
      id: 5,
      title: "Nepal Earthquake Response",
      location: "Kathmandu Valley, Nepal",
      organization: "Mountain Relief Initiative",
      logo: "/api/placeholder/40/40",
      coverImage: "/api/placeholder/800/400",
      description: "A 7.2 magnitude earthquake has caused widespread damage. Remote villages are cut off from aid and medical care.",
      severity: 9.7,
      raised: 980000,
      goal: 2500000,
      timeline: "48 hours critical for search and rescue",
      updates: [
        { time: "1 hour ago", text: "Search teams have reached Gorkha district" },
        { time: "8 hours ago", text: "Field hospital established in Kathmandu" }
      ],
      impactStats: {
        peopleAffected: "180,000+",
        areaAffected: "4 districts",
        criticalNeeds: ["Search & rescue", "Medical care", "Temporary shelter"]
      },
      engagement: { donations: 6230, shares: 15800, volunteers: 320 }
    }
  ]);

  // Sort disasters by severity
  const sortedDisasters = [...disasters].sort((a, b) => b.severity - a.severity);

  // Notifications
  const notifications = [
    { id: 1, title: "New flooding reported in southern Vietnam", time: "15 mins ago", isNew: true },
    { id: 2, title: "Your donation of $100 has been processed", time: "1 hour ago", isNew: true },
    { id: 3, title: "Emergency alert: Earthquake in Nepal", time: "3 hours ago", isNew: false },
    { id: 4, title: "New volunteer opportunity in California", time: "5 hours ago", isNew: false },
  ];

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

  const openDisasterModal = (disaster) => {
    setCurrentDisaster(disaster);
    setIsModalOpen(true);
  };

  // Calculate donation progress percentage
  const getProgressPercentage = (raised, goal) => {
    return Math.min(100, Math.round((raised / goal) * 100));
  };

  // Get severity indicator color
  const getSeverityColor = (severity) => {
    if (severity >= 9) return "text-red-500";
    if (severity >= 7) return "text-orange-500";
    return "text-yellow-500";
  };

  const getSeverityLabel = (severity) => {
    if (severity >= 9) return "Critical";
    if (severity >= 7) return "Severe";
    if (severity >= 5) return "Moderate";
    return "Developing";
  };

  const toggleNotifications = () => {
    setIsNotificationOpen(!isNotificationOpen);
    setIsSearchOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    setIsNotificationOpen(false);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Enhanced Navigation */}
      <div className="container mx-auto px-4 py-4 bg-black">
      <Navbar /></div>

      {/* Enhanced Hero section with dynamic impact visualization */}
      <div className="relative h-96 bg-black overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60"></div>
        <div className="absolute inset-0 backdrop-blur-sm">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-600/40 via-transparent to-transparent"></div>
        </div>

        {/* Animated emergency dots */}
        <div className="absolute inset-0 overflow-hidden">
          {Array(15).fill(0).map((_, i) => (
            <motion.div
              key={i} 
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
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

        <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-6xl font-bold mb-4 text-white text-center"
          >
            Global Disaster <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-yellow-400">Response Network</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-center text-gray-300 max-w-2xl mb-8"
          >
            Connecting communities in crisis with immediate relief and resources
          </motion.p>

          {/* Live stats panel */}
          <motion.div
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
              <motion.p
                key={animateCount}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="text-2xl font-bold text-white"
              >
                {disasters.length}
              </motion.p>
            </div>

            <div className="h-12 w-px bg-gray-700 hidden md:block"></div>

            <div className="flex flex-col items-center text-center">
              <div className="flex items-center">
                <Users className="text-orange-500 h-5 w-5 mr-2" />
                <p className="text-gray-400 text-sm">People Affected</p>
              </div>
              <motion.p
                key={animateCount}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="text-2xl font-bold text-white"
              >
                5.4M+
              </motion.p>
            </div>

            <div className="h-12 w-px bg-gray-700 hidden md:block"></div>

            <div className="flex flex-col items-center text-center">
              <div className="flex items-center">
                <Heart className="text-red-500 h-5 w-5 mr-2" />
                <p className="text-gray-400 text-sm">Raised This Week</p>
              </div>
              <motion.p
                key={animateCount}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="text-2xl font-bold text-white"
              >
                $4.5M
              </motion.p>
            </div>
          </motion.div>

          <div className="flex flex-col md:flex-row gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-yellow-500  text-white px-8 py-3 rounded-full font-semibold flex items-center justify-center shadow-lg shadow-red-600/20"
            >
              <AlertTriangle className="mr-2 h-5 w-5" />
              Report Emergency
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-black border border-gray-700 text-white px-8 py-3 rounded-full hover:bg-white/10 transition flex items-center justify-center"
            >
              <Users className="mr-2 h-5 w-5 text-yellow-400" />
              <span>Become a Volunteer</span>
            </motion.button>
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
          {sortedDisasters.map((disaster) => (
            <motion.div
              key={disaster.id}
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
                  <div className={`w-3 h-3 rounded-full mr-2 ${
                    disaster.severity >= 9 ? 'bg-red-500 animate-pulse' :
                    disaster.severity >= 7 ? 'bg-orange-500' : 'bg-yellow-500'
                  }`}></div>
                  <span className={`text-sm font-medium ${getSeverityColor(disaster.severity)}`}>
                    {getSeverityLabel(disaster.severity)} ({disaster.severity.toFixed(1)})
                  </span>
                </div>
                <span className="text-sm text-gray-400">{disaster.timeline}</span>
              </div>

              {/* Cover image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={disaster.coverImage}
                  alt={disaster.title}
                  fill
                  className="object-cover transform transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent h-24"></div>
                <div className="absolute bottom-0 left-0 p-4">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden mr-2 bg-gray-700 border border-gray-600">
                      <Image
                        src={disaster.logo}
                        alt={disaster.organization}
                        width={32}
                        height={32}
                      />
                    </div>
                    <span className="text-sm font-medium">{disaster.organization}</span>
                  </div>
                </div>

                {/* Quick action buttons on hover */}
                <motion.div
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
                </motion.div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-1 group-hover:text-yellow-400 transition-colors">{disaster.title}</h3>
                <p className="text-sm text-gray-400 mb-3 flex items-center">
                  <Globe className="h-3 w-3 mr-1" />
                  {disaster.location}
                </p>

                <p className="text-sm text-gray-300 mb-4 line-clamp-3">{disaster.description}</p>

                {/* Progress bar */}
                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>${(disaster.raised / 1000000).toFixed(1)}M raised</span>
                    <span>${(disaster.goal / 1000000).toFixed(1)}M goal</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${getProgressPercentage(disaster.raised, disaster.goal)}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-full rounded-full relative"
                    >
                      <div className="absolute top-0 left-0 w-full h-full bg-white opacity-30 rounded-full animate-pulse"></div>
                    </motion.div>
                  </div>
                </div>

                {/* Latest update */}
                {disaster.updates && disaster.updates[0] && (
                  <div className="bg-gray-700/30 backdrop-blur-sm rounded-lg p-3 mb-4 text-sm border border-gray-700 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent to-gray-900 opacity-20"></div>
                    <div className="relative z-10">
                      <p className="font-medium text-orange-300 mb-1">Latest Update • {disaster.updates[0].time}</p>
                      <p>{disaster.updates[0].text}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Donation Impact Section */}
      <div className="bg-black py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Your Donation's Impact</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800/50 rounded-xl p-6 text-center">
              <div className="text-5xl font-bold text-orange-500 mb-2">$25</div>
              <p className="text-lg mb-4">Provides emergency food for a family of four for one week</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg"
              >
                Donate $25
              </motion.button>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6 text-center transform scale-110 shadow-lg border border-red-500/30">
              <div className="text-5xl font-bold text-red-500 mb-2">$100</div>
              <p className="text-lg mb-4">Supplies clean water, shelter kits, and medical aid for a displaced family</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
              >
                Donate $100
              </motion.button>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6 text-center">
              <div className="text-5xl font-bold text-blue-500 mb-2">$500</div>
              <p className="text-lg mb-4">Funds rescue operations and critical infrastructure repairs</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
              >
                Donate $500
              </motion.button>
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
            <div className="absolute inset-0 flex items-center justify-center  ">
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
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Modal header with close button */}
            <div className="relative h-64">
              <Image
                src={currentDisaster.coverImage}
                alt={currentDisaster.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>

              <button
                className="absolute top-4 right-4 bg-black bg-opacity-50 rounded-full p-2"
                onClick={() => setIsModalOpen(false)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="absolute bottom-4 left-4">
                <div className="flex items-center mb-2">
                  <div className="w-12 h-12 rounded-xl overflow-hidden mr-3 bg-gray-700">
                    <Image
                      src={currentDisaster.logo}
                      alt={currentDisaster.organization}
                      width={48}
                      height={48}
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{currentDisaster.title}</h3>
                    <p className="text-gray-300">{currentDisaster.organization} • {currentDisaster.location}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal content */}
            <div className="p-6">
              {/* Severity and timeline */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full mr-2 ${currentDisaster.severity >= 9 ? 'bg-red-500 animate-pulse' : currentDisaster.severity >= 7 ? 'bg-orange-500' : 'bg-yellow-500'}`}></div>
                  <span className={`font-medium ${getSeverityColor(currentDisaster.severity)}`}>
                    {getSeverityLabel(currentDisaster.severity)} Situation ({currentDisaster.severity.toFixed(1)}/10)
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-black rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-400">People Affected</p>
                  <p className="text-2xl font-bold text-red-400">{currentDisaster.impactStats.peopleAffected}</p>
                </div>
                <div className="bg-black rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-400">Area Affected</p>
                  <p className="text-2xl font-bold text-orange-400">{currentDisaster.impactStats.areaAffected}</p>
                </div>
                <div className="bg-black rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-400">Critical Needs</p>
                  <div className="flex justify-center space-x-2 mt-2">
                    {currentDisaster.impactStats.criticalNeeds.map((need, i) => (
                      <span key={i} className="bg-gray-600 px-2 py-1 rounded text-sm">{need}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">Fundraising Progress</h4>
                  <span className="text-gray-400">{getProgressPercentage(currentDisaster.raised, currentDisaster.goal)}% of goal</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
                  <div
                    className="bg-gradient-to-r from-red-600 to-orange-500 h-4 rounded-full relative"
                    style={{ width: `${getProgressPercentage(currentDisaster.raised, currentDisaster.goal)}%` }}
                  >
                    <div className="absolute -right-2 -top-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-xs font-bold">
                      {getProgressPercentage(currentDisaster.raised, currentDisaster.goal)}%
                    </div>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span>${currentDisaster.raised.toLocaleString()} raised</span>
                  <span>${currentDisaster.goal.toLocaleString()} goal</span>
                </div>
              </div>

              {/* Latest updates */}
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

              {/* Donation options */}
              <div className="mb-6">
                <h4 className="text-xl font-semibold mb-4">Make a Donation</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gray-700 hover:bg-gray-600 rounded-lg p-3 text-center"
                  >
                    <div className="text-lg font-bold">$25</div>
                    <div className="text-sm text-gray-400">One-time</div>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gray-700 hover:bg-gray-600 rounded-lg p-3 text-center"
                  >
                    <div className="text-lg font-bold">$50</div>
                    <div className="text-sm text-gray-400">One-time</div>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-red-600 hover:bg-red-700 rounded-lg p-3 text-center"
                  >
                    <div className="text-lg font-bold">$100</div>
                    <div className="text-sm">Popular</div>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gray-700 hover:bg-gray-600 rounded-lg p-3 text-center"
                  >
                    <div className="text-lg font-bold">Custom</div>
                    <div className="text-sm text-gray-400">Any amount</div>
                  </motion.button>
                </div>

                <div className="flex gap-4 mb-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-lg flex items-center justify-center"
                  >
                    Donate Now
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-gray-700 hover:bg-gray-600 py-3 px-4 rounded-lg flex items-center justify-center"
                  >
                    <Heart className="h-5 w-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-gray-700 hover:bg-gray-600 py-3 px-4 rounded-lg flex items-center justify-center"
                  >
                    <Share2 className="h-5 w-5" />
                  </motion.button>
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
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
                  <span className="text-sm text-gray-400">{currentDisaster.engagement.donations} participants</span>
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
          </motion.div>
        </div>
      )}

      {/* Fixed action bar for mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-3">
        <div className="flex justify-between">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-red-600 text-white rounded-lg py-3 px-6 font-medium flex-grow mr-2"
          >
            Donate Now
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gray-700 text-white rounded-lg py-3 px-4"
          >
            <Share2 className="h-5 w-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
