'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthModal from './AuthModal';
import authService from './authService';

export default function Header() {
  const router = useRouter();
  const [authOpen, setAuthOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if user is authenticated
        if (authService.isAuthenticated()) {
          setUser(authService.getUser());
        }
      } catch (error) {
        console.error('Auth validation error:', error);
        authService.clearAuth();
        setUser(null);
      } finally {
        setIsValidating(false);
      }
    };

    initializeAuth();

    const handleClickOutside = (event: any) => {
      if (showProfileMenu && !event.target.closest('.profile-menu-container')) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfileMenu]);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    setUser(null);
    setShowProfileMenu(false);
    router.push('/');
  };

  const handleAuthSuccess = (user: any, accessToken: string, refreshToken: string) => {
    authService.setTokens(accessToken, refreshToken, user);
    setUser(user);
    setAuthOpen(false);
  };

  // Don't render until auth validation is complete
  if (isValidating) {
    return (
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="w-full px-6 h-16 flex items-center justify-center">
          <div className="text-gray-500">Loading...</div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50 transition-all duration-300">
      <div className="w-full px-6 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors duration-200" style={{ fontFamily: "Pacifico, serif" }}>
            CareerMatch
          </Link>
          {user && user.role !== 'admin' && (
            <nav className="hidden md:flex space-x-6">
              <Link href="/dashboard" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 group">
                <div className="w-5 h-5 flex items-center justify-center">
                  <i className="ri-dashboard-line group-hover:scale-110 transition-transform duration-200"></i>
                </div>
                <span>Dashboard</span>
              </Link>
              <Link href="/jobs" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 group">
                <div className="w-5 h-5 flex items-center justify-center">
                  <i className="ri-briefcase-line group-hover:scale-110 transition-transform duration-200"></i>
                </div>
                <span>Jobs</span>
              </Link>
              <Link href="/network" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 group">
                <div className="w-5 h-5 flex items-center justify-center">
                  <i className="ri-team-line group-hover:scale-110 transition-transform duration-200"></i>
                </div>
                <span>Network</span>
              </Link>
              <Link href="/posts" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 group">
                <div className="w-5 h-5 flex items-center justify-center">
                  <i className="ri-article-line group-hover:scale-110 transition-transform duration-200"></i>
                </div>
                <span>Posts</span>
              </Link>
            </nav>
          )}
          {user && user.role === 'admin' && (
            <nav className="hidden md:flex space-x-6">
              <Link href="/admin" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 group">
                <div className="w-5 h-5 flex items-center justify-center">
                  <i className="ri-admin-line group-hover:scale-110 transition-transform duration-200"></i>
                </div>
                <span>Admin Panel</span>
              </Link>
            </nav>
          )}
        </div>
        <div className="flex items-center space-x-4">
          {!user ? (
            <>
              <button 
                onClick={() => setAuthOpen(true)}
                className="px-4 py-2 text-blue-600 font-medium hover:bg-blue-50 rounded-lg whitespace-nowrap cursor-pointer transition-all duration-200 hover:scale-105"
              >
                Sign In
              </button>
              <Link href="/signup" className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 whitespace-nowrap cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-md">
                Join Now
              </Link>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <Link href="/post-job" className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 whitespace-nowrap cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-md">
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-add-line"></i>
                </div>
                <span>Post Job</span>
              </Link>
              <button className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 cursor-pointer group">
                <div className="w-6 h-6 flex items-center justify-center">
                  <i className="ri-notification-line group-hover:scale-110 transition-transform duration-200"></i>
                </div>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
              </button>
              <button className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 cursor-pointer group">
                <div className="w-6 h-6 flex items-center justify-center">
                  <i className="ri-message-line group-hover:scale-110 transition-transform duration-200"></i>
                </div>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></span>
              </button>
              <div className="relative profile-menu-container">
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-all duration-200 group"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <i className="ri-user-line text-white text-sm"></i>
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">View Profile</p>
                  </div>
                  <i className={`ri-arrow-down-s-line text-gray-600 transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`}></i>
                </button>
                {showProfileMenu && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-lg border py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                          <i className="ri-user-line text-white"></i>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">Software Engineer</p>
                        </div>
                      </div>
                    </div>
                    <div className="py-2">
                      {user.role === 'admin' ? (
                        <Link href="/admin" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors duration-150 group">
                          <div className="w-5 h-5 flex items-center justify-center mr-3">
                            <i className="ri-admin-line group-hover:scale-110 transition-transform duration-150"></i>
                          </div>
                          Admin Panel
                        </Link>
                      ) : (
                        <>
                          <Link href="/profile" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors duration-150 group">
                            <div className="w-5 h-5 flex items-center justify-center mr-3">
                              <i className="ri-user-line group-hover:scale-110 transition-transform duration-150"></i>
                            </div>
                            View Profile
                          </Link>
                          <Link href="/wallet" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors duration-150 group">
                            <div className="w-5 h-5 flex items-center justify-center mr-3">
                              <i className="ri-wallet-line group-hover:scale-110 transition-transform duration-150"></i>
                            </div>
                            Wallet & Payments
                          </Link>
                          <Link href="/settings" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors duration-150 group">
                            <div className="w-5 h-5 flex items-center justify-center mr-3">
                              <i className="ri-settings-line group-hover:scale-110 transition-transform duration-150"></i>
                            </div>
                            Settings
                          </Link>
                        </>
                      )}
                    </div>
                    <div className="border-t pt-2">
                      <button 
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 cursor-pointer transition-colors duration-150 group"
                      >
                        <div className="w-5 h-5 flex items-center justify-center mr-3">
                          <i className="ri-logout-box-line group-hover:scale-110 transition-transform duration-150"></i>
                        </div>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </header>
  );
}
