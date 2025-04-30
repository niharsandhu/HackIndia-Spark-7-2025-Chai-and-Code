"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useWeb3 } from '../contexts/Web3Context';

export default function Navbar() {
  const { isConnected, account, connectWallet, disconnectWallet, isLoading } = useWeb3();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // Function to format address
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Navigation items
  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'NGOs', href: '/ngos' },
    { name: 'Donate', href: '/donate' },
    { name: 'Aid Tracker', href: '/aid-tracker' },
    { name: 'About', href: '/about' },
  ];

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                DonateChain
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    pathname === item.href
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <button
              type="button"
              onClick={isConnected ? disconnectWallet : connectWallet}
              disabled={isLoading}
              className={`${
                isConnected
                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              } px-4 py-2 rounded-md text-sm font-medium transition-colors`}
            >
              {isLoading ? (
                'Loading...'
              ) : isConnected ? (
                <span className="flex items-center">
                  <span className="h-2 w-2 bg-green-400 rounded-full mr-2"></span>
                  {formatAddress(account)}
                </span>
              ) : (
                'Connect Wallet'
              )}
            </button>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed */}
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Icon when menu is open */}
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state. */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`${
                pathname === item.href
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200">
          <div className="mt-3 px-2 space-y-1">
            <button
              onClick={isConnected ? disconnectWallet : connectWallet}
              disabled={isLoading}
              className={`${
                isConnected
                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              } block w-full text-left px-3 py-2 rounded-md text-base font-medium`}
            >
              {isLoading ? (
                'Loading...'
              ) : isConnected ? (
                <span className="flex items-center">
                  <span className="h-2 w-2 bg-green-400 rounded-full mr-2"></span>
                  {formatAddress(account)}
                </span>
              ) : (
                'Connect Wallet'
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}