// components/Navbar.js

import Link from 'next/link';
import { CuboidIcon as Cube } from "lucide-react" 

const Navbar = () => {
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
        <Link href="#" className="text-gray-300 hover:text-white transition">
          NGO
        </Link>
        <Link href="#" className="text-gray-300 hover:text-white transition">
          Fund raiser
        </Link>
        <Link href="#" className="text-gray-300 hover:text-white transition">
          Join NGO
        </Link>
        <Link href="#" className="text-gray-300 hover:text-white transition">
          About us
        </Link>
      </div>

      <button className="bg-black/50 text-white px-4 py-2 rounded-full border border-white/10 hover:bg-black/70 transition">
        Login
      </button>
    </nav>
  );
};

export default Navbar;
