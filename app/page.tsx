export const dynamic = 'force-dynamic';

'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '../components/Header';
import AuthModal from '../components/AuthModal';
import Footer from '../components/Footer';
import Link from 'next/link';
import authService from '../components/authService';

export default function Home() {
  const searchParams = useSearchParams();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Check if user is authenticated
    if (authService.isAuthenticated()) {
      setUser(authService.getUser());
    }

    // Check if auth modal should be shown from URL params (only if not logged in)
    const authParam = searchParams.get('auth');
    if (authParam === 'login' && !authService.isAuthenticated()) {
      setShowAuthModal(true);
    }
  }, [searchParams]);

  const handleAuthSuccess = (user: any, accessToken: string, refreshToken: string) => {
    authService.setTokens(accessToken, refreshToken, user);
    setUser(user);
    setShowAuthModal(false);
    
    // Redirect to the intended page if specified
    const redirect = searchParams.get('redirect');
    if (redirect) {
      window.location.href = redirect;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Auth Modal - only show if client-side and not already authenticated */}
      {isClient && showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      )}
      
      {/* Hero Section */}
      <section 
        className="relative bg-cover bg-center h-[600px] flex items-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://readdy.ai/api/search-image?query=Modern%20professional%20workspace%20with%20diverse%20people%20collaborating%20in%20a%20bright%20office%20environment%2C%20laptops%20and%20documents%20on%20table%2C%20large%20windows%20with%20city%20view%2C%20contemporary%20interior%20design%2C%20business%20meeting%20atmosphere%2C%20natural%20lighting%2C%20professional%20attire%2C%20clean%20minimalist%20aesthetic&width=1200&height=600&seq=hero1&orientation=landscape')`
        }}
      >
        <div className="w-full px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-white max-w-2xl">
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                Find Your Dream Job with AI-Powered Resume Matching
              </h1>
              <p className="text-xl mb-8 opacity-90">
                Upload your resume, let our AI extract your skills, and get matched with perfect job opportunities. Connect with professionals and grow your career.
              </p>
              <div className="flex space-x-4">
                <Link href="/signup" className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 whitespace-nowrap cursor-pointer">
                  Get Started Free
                </Link>
                <Link href="/upload-resume" className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 whitespace-nowrap cursor-pointer">
                  Upload Resume
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Smart Career Matching Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-powered platform analyzes your resume, extracts skills, and matches you with the perfect job opportunities
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-xl bg-blue-50">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ri-file-text-line text-white text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">AI Resume Parsing</h3>
              <p className="text-gray-600 leading-relaxed">
                Upload your resume and our advanced AI automatically extracts your skills, experience, and qualifications for perfect job matching.
              </p>
            </div>

            <div className="text-center p-8 rounded-xl bg-green-50">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ri-search-line text-white text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Smart Job Matching</h3>
              <p className="text-gray-600 leading-relaxed">
                Get matched with job opportunities that perfectly align with your skills and career goals using intelligent algorithms.
              </p>
            </div>

            <div className="text-center p-8 rounded-xl bg-purple-50">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ri-team-line text-white text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Professional Network</h3>
              <p className="text-gray-600 leading-relaxed">
                Connect with industry professionals, share insights, and build meaningful relationships to advance your career.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How CareerMatch Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple steps to find your perfect career opportunity
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Upload Resume</h3>
              <p className="text-gray-600">
                Upload your resume and let our AI extract your skills and experience
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI Analysis</h3>
              <p className="text-gray-600">
                Our system analyzes your profile and matches it with job descriptions
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Get Matches</h3>
              <p className="text-gray-600">
                Receive personalized job recommendations based on your skills
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">4</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Apply & Connect</h3>
              <p className="text-gray-600">
                Apply to jobs and connect with professionals in your industry
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Find Your Dream Job?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of professionals who have found their perfect career match
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/signup" className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 whitespace-nowrap cursor-pointer">
              Start Your Journey
            </Link>
            <Link href="/upload-resume" className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 whitespace-nowrap cursor-pointer">
              Upload Resume Now
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
