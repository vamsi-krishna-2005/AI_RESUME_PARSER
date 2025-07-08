'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AuthModal from './AuthModal';
import authService from './authService';

export default function Footer() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Check authentication only on client side
    if (authService.isAuthenticated()) {
      setUser(authService.getUser());
    }
  }, []);

  const handleAuthSuccess = (user: any, accessToken: string, refreshToken: string) => {
    authService.setTokens(accessToken, refreshToken, user);
    setUser(user);
    setShowAuthModal(false);
    // Reload the page to update the user state
    window.location.reload();
  };

  const handleProtectedLink = (href: string, e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      setShowAuthModal(true);
    }
  };

  // Don't render auth modal until client-side
  if (!isClient) {
    return (
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: "Pacifico, serif" }}>
                CareerMatch
              </h3>
              <p className="text-gray-400">
                AI-powered career matching platform connecting talent with opportunities.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Job Seekers</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/jobs" className="hover:text-white cursor-pointer">Browse Jobs</Link></li>
                <li><Link href="/upload-resume" className="hover:text-white cursor-pointer">Upload Resume</Link></li>
                <li>
                  <Link 
                    href="/dashboard" 
                    className="hover:text-white cursor-pointer"
                  >
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Employers</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link 
                    href="/post-job" 
                    className="hover:text-white cursor-pointer"
                  >
                    Post Jobs
                  </Link>
                </li>
                <li><Link href="/pricing" className="hover:text-white cursor-pointer">Pricing</Link></li>
                <li>
                  <Link 
                    href="/employer-dashboard" 
                    className="hover:text-white cursor-pointer"
                  >
                    Employer Dashboard
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white cursor-pointer">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-white cursor-pointer">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-white cursor-pointer">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CareerMatch. All rights reserved.</p>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <>
      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: "Pacifico, serif" }}>
                CareerMatch
              </h3>
              <p className="text-gray-400">
                AI-powered career matching platform connecting talent with opportunities.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Job Seekers</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/jobs" className="hover:text-white cursor-pointer">Browse Jobs</Link></li>
                <li><Link href="/upload-resume" className="hover:text-white cursor-pointer">Upload Resume</Link></li>
                <li>
                  <Link 
                    href="/dashboard" 
                    className="hover:text-white cursor-pointer"
                    onClick={(e) => handleProtectedLink('/dashboard', e)}
                  >
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Employers</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link 
                    href="/post-job" 
                    className="hover:text-white cursor-pointer"
                    onClick={(e) => handleProtectedLink('/post-job', e)}
                  >
                    Post Jobs
                  </Link>
                </li>
                <li><Link href="/pricing" className="hover:text-white cursor-pointer">Pricing</Link></li>
                <li>
                  <Link 
                    href="/employer-dashboard" 
                    className="hover:text-white cursor-pointer"
                    onClick={(e) => handleProtectedLink('/employer-dashboard', e)}
                  >
                    Employer Dashboard
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white cursor-pointer">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-white cursor-pointer">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-white cursor-pointer">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CareerMatch. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
} 