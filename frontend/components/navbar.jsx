import Link from 'next/link';
import { CuboidIcon as Cube } from "lucide-react";
import { useState, useEffect } from 'react';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  
  // In a real app, you would check auth status from a context or API
  useEffect(() => {
    // This is a placeholder for actual authentication check
    // You would replace this with your actual auth logic
    const checkAuthStatus = () => {
      // Example: check local storage or auth context
      const auth = localStorage.getItem('auth');
      if (auth) {
        const parsedAuth = JSON.parse(auth);
        setIsLoggedIn(parsedAuth.isLoggedIn);
        setUserRole(parsedAuth.role);
      }
    };
    
    checkAuthStatus();
  }, []);
  
  const isNGO = userRole === 'ngo';
  const isDonor = userRole === 'donor';

  return (
    <nav className="flex items-center justify-between bg-black/30 backdrop-blur-sm rounded-full px-6 py-3 border border-white/10">
      <div className="flex items-center gap-2">
        <Cube className="h-6 w-6 text-yellow-500" />
        <span className="text-xl font-semibold">RelifChain</span>
      </div>
      
      <div className="hidden md:flex items-center gap-8">
        <Link href="/community" className="text-gray-300 hover:text-white transition">
          Community
        </Link>
        
        {isLoggedIn && isNGO && (
          <Link href="/scan" className="text-gray-300 hover:text-white transition">
            Scan
          </Link>
        )}
        
        {isLoggedIn && isDonor && (
          <Link href="/userdashboard" className="text-gray-300 hover:text-white transition">
            Dashboard
          </Link>
        )}
      </div>
      
      {!isLoggedIn ? (
        <button className="bg-black/50 text-white px-4 py-2 rounded-full border border-white/10 hover:bg-black/70 transition">
          <Link  href="/login" >Login</Link>
        </button>
      ) : (
        <button className="bg-black/50 text-white px-4 py-2 rounded-full border border-white/10 hover:bg-black/70 transition">
          <Link  href="/" >Logout</Link>
        </button>
      )}
    </nav>
  );
};

export default Navbar;