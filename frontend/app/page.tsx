"use client";
import dynamic from "next/dynamic";
import Navbar from "@/components/navbar";
import { motion } from "framer-motion";

// Dynamically import the portal effect component with no SSR
const EnhancedPortal = dynamic(() => import("@/components/enhanced-portal"), {
  ssr: true
});

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white overflow-hidden">
      {/* Full screen portal animation as background */}
      <div className="fixed inset-0 z-0">
        <EnhancedPortal />
      </div>

      {/* Content overlay */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-4">
          {/* Navbar */}
          <Navbar />

          {/* Hero Section */}
          <div className="flex flex-col items-center justify-center text-center h-screen -mt-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
                Where every
                <br />
                donation
                <br />
                tells its story
              </h1>
            </motion.div>

            <div className="flex gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold px-6 py-3 rounded-full hover:from-yellow-400 hover:to-yellow-500 transition"
              >
                Community
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/10 text-white px-6 py-3 rounded-full border border-yellow-500/30 hover:bg-white/20 transition"
              >
                Donate
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
