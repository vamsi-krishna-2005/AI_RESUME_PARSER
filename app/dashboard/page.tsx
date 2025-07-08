'use client';

import Header from '../../components/Header';
import { useState, useEffect } from 'react';
import User from '../../backend/models/User';
import { useRouter } from 'next/navigation';
import authService from '../../components/authService';

export default function Dashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [userName, setUserName] = useState('');
  const [networkCount, setNetworkCount] = useState(156); // Default value

  useEffect(() => {
    if (typeof window !== 'undefined' && !authService.isAuthenticated()) {
      router.replace('/?auth=login&redirect=/dashboard');
    }
  }, [router]);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setUserName(user.name || '');
    }

    // Load network count from localStorage
    const savedNetworkCount = localStorage.getItem('careermatch_network_count');
    if (savedNetworkCount) {
      setNetworkCount(parseInt(savedNetworkCount)-1);
    } else {
      // Initialize with default value if not set
      localStorage.setItem('careermatch_network_count', '156');
    }
  }, []);

  // Listen for changes to network count
  useEffect(() => {
    const handleStorageChange = () => {
      const savedNetworkCount = localStorage.getItem('careermatch_network_count');
      if (savedNetworkCount) {
        setNetworkCount(parseInt(savedNetworkCount)-1);
      }
    };

    const handleNetworkDisplayUpdate = (event: CustomEvent) => {
      setNetworkCount(event.detail.count-1);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('updateNetworkDisplay', handleNetworkDisplayUpdate as EventListener);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('updateNetworkDisplay', handleNetworkDisplayUpdate as EventListener);
    };
  }, []);

  const jobApplications = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      company: 'TechCorp Inc.',
      status: 'Interview Scheduled',
      appliedDate: '2024-01-15',
      matchScore: 95
    },
    {
      id: 2,
      title: 'Full Stack Engineer',
      company: 'StartupXYZ',
      status: 'Under Review',
      appliedDate: '2024-01-12',
      matchScore: 88
    },
    {
      id: 3,
      title: 'React Developer',
      company: 'Digital Solutions',
      status: 'Rejected',
      appliedDate: '2024-01-10',
      matchScore: 82
    }
  ];

  const recentViews = [
    {
      id: 1,
      title: 'Product Manager',
      company: 'Innovation Labs',
      viewedDate: '2024-01-16',
      matchScore: 78
    },
    {
      id: 2,
      title: 'UX Designer',
      company: 'Creative Studio',
      viewedDate: '2024-01-15',
      matchScore: 85
    }
  ];

  const skillsExtracted = [
    'React', 'JavaScript', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker', 'MongoDB', 'PostgreSQL', 'Git'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {userName}!</h1>
          <p className="text-gray-600">Here's what's happening with your job search</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="ri-file-text-line text-blue-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Applications</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="ri-eye-line text-green-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Profile Views</p>
                <p className="text-2xl font-bold text-gray-900">48</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <i className="ri-heart-line text-purple-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Saved Jobs</p>
                <p className="text-2xl font-bold text-gray-900">25</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <i className="ri-team-line text-orange-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Network</p>
                <p className="text-2xl font-bold text-gray-900">{networkCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap cursor-pointer ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('applications')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap cursor-pointer ${
                  activeTab === 'applications'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Applications
              </button>
              <button
                onClick={() => setActiveTab('skills')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap cursor-pointer ${
                  activeTab === 'skills'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Skills Profile
              </button>
              <button
                onClick={() => setActiveTab('activity')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap cursor-pointer ${
                  activeTab === 'activity'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Recent Activity
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Applications</h3>
                  <div className="space-y-4">
                    {jobApplications.slice(0, 3).map((job) => (
                      <div key={job.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">{job.title}</h4>
                          <p className="text-sm text-gray-600">{job.company}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                            job.status === 'Interview Scheduled' ? 'bg-green-100 text-green-800' :
                            job.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {job.status}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">{job.matchScore}% match</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended Jobs</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Senior React Developer</h4>
                          <p className="text-sm text-gray-600">Microsoft</p>
                          <p className="text-sm text-blue-600 mt-1">92% skill match</p>
                        </div>
                        <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 whitespace-nowrap cursor-pointer">
                          Apply
                        </button>
                      </div>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Frontend Engineer</h4>
                          <p className="text-sm text-gray-600">Google</p>
                          <p className="text-sm text-green-600 mt-1">89% skill match</p>
                        </div>
                        <button className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 whitespace-nowrap cursor-pointer">
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'applications' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">All Applications</h3>
                <div className="space-y-4">
                  {jobApplications.map((job) => (
                    <div key={job.id} className="p-6 bg-white border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">{job.title}</h4>
                          <p className="text-gray-600">{job.company}</p>
                          <p className="text-sm text-gray-500 mt-2">Applied on {job.appliedDate}</p>
                          <p className="text-sm text-blue-600 mt-1">Match Score: {job.matchScore}%</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                            job.status === 'Interview Scheduled' ? 'bg-green-100 text-green-800' :
                            job.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {job.status}
                          </span>
                          <div className="mt-2 space-x-2">
                            <button className="text-blue-600 hover:text-blue-800 text-sm cursor-pointer">
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'skills' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills Extracted from Resume</h3>
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {skillsExtracted.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Skill Enhancement Suggestions</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Consider adding Next.js to strengthen your React skills</li>
                    <li>• GraphQL knowledge would complement your API experience</li>
                    <li>• Kubernetes certification could boost your DevOps profile</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Job Views</h3>
                <div className="space-y-4">
                  {recentViews.map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{job.title}</h4>
                        <p className="text-sm text-gray-600">{job.company}</p>
                        <p className="text-xs text-gray-500 mt-1">Viewed on {job.viewedDate}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-blue-600">{job.matchScore}% match</p>
                        <button className="text-blue-600 hover:text-blue-800 text-sm mt-1 cursor-pointer">
                          View Again
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
