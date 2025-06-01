"use client";

import { useState } from 'react';
import { useAuth } from './AuthProvider';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const NavBar = () => {
  const { user, logOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const toggleDropdown = () => setDropdownOpen(prev => !prev);
  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev);

  const handleLogout = async () => {
    try {
      await logOut();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="bg-black border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-white"></span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center">
            {user ? (
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-md px-3 py-2"
                >
                  <span>{user.email}</span>
                  <svg
                    className={`h-5 w-5 transform transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-xl shadow-lg py-2 border border-gray-800/50 animate-fadeIn">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-200"
                    >
                      Profile
                    </Link>
                    {user.email?.endsWith('@admin.com') && (
                      <Link
                        href="/admin"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-200"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-200"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link
                  href="/login"
                  className="text-gray-300 hover:text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-gray-800/50"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-teal-600 text-white hover:bg-teal-700 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-md p-2"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={mobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-gray-900 border-t border-gray-800/50 animate-slideDown">
            <div className="px-4 pt-2 pb-4 space-y-2">
              {user ? (
                <>
                  <div className="text-gray-300 text-sm font-medium px-4 py-2">{user.email}</div>
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-all duration-200"
                    onClick={toggleMobileMenu}
                  >
                    Profile
                  </Link>
                  {user.email?.endsWith('@admin.com') && (
                    <Link
                      href="/admin"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-all duration-200"
                      onClick={toggleMobileMenu}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      toggleMobileMenu();
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-all duration-200"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-all duration-200"
                    onClick={toggleMobileMenu}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="block px-4 py-2 text-sm bg-teal-600 text-white hover:bg-teal-700 rounded-lg transition-all duration-200"
                    onClick={toggleMobileMenu}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Inline styles for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </nav>
  );
};

export default NavBar;