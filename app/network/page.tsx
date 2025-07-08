'use client';

import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Link from 'next/link';

export default function Network() {
  const [activeTab, setActiveTab] = useState('people');
  const [searchTerm, setSearchTerm] = useState('');
  const [followingUsers, setFollowingUsers] = useState(new Set());
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [networkCount, setNetworkCount] = useState(156);

  // Load following users from localStorage on component mount
  useEffect(() => {
    const savedFollowing = localStorage.getItem('careermatch_following_users');
    if (savedFollowing) {
      try {
        const parsedFollowing = JSON.parse(savedFollowing);
        setFollowingUsers(new Set(parsedFollowing));
      } catch (error) {
        console.error('Error parsing saved following users:', error);
        setFollowingUsers(new Set());
      }
    }

    // Load network count
    const savedNetworkCount = localStorage.getItem('careermatch_network_count');
    if (savedNetworkCount) {
      setNetworkCount(parseInt(savedNetworkCount));
    }
  }, []);

  const handleFollow = (userId: number) => {
    setFollowingUsers(prev => {
      const newSet = new Set(prev);
      const wasFollowing = newSet.has(userId);
      const currentNetworkCount = parseInt(localStorage.getItem('careermatch_network_count') || '156');
      
      if (wasFollowing) {
        newSet.delete(userId);
        // Decrease network count when unfollowing
        localStorage.setItem('careermatch_network_count', (currentNetworkCount - 1).toString());
        setNotificationMessage('Connection removed from your network');
      } else {
        newSet.add(userId);
        // Increase network count when following
        localStorage.setItem('careermatch_network_count', (currentNetworkCount + 1).toString());
        setNotificationMessage('Connection added to your network!');
      }
      
      // Save following users to localStorage
      localStorage.setItem('careermatch_following_users', JSON.stringify(Array.from(newSet)));
      
      // Show notification
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      
      // Update dashboard network count display (not localStorage)
      window.dispatchEvent(new CustomEvent('updateNetworkDisplay', {
        detail: { count: wasFollowing ? currentNetworkCount - 1 : currentNetworkCount + 1 }
      }));
      
      return newSet;
    });
  };

  const people = [
    {
      id: 1,
      name: 'Sarah Johnson',
      title: 'Senior Product Manager at Google',
      location: 'Mountain View, CA',
      connections: 847,
      avatar: 'https://readdy.ai/api/search-image?query=professional%20woman%20headshot%2C%20business%20attire%2C%20confident%20smile%2C%20corporate%20background%2C%20high%20quality%20portrait%20photography&width=80&height=80&seq=p1&orientation=squarish',
      skills: ['Product Strategy', 'Analytics', 'Leadership'],
      mutualConnections: 12
    },
    {
      id: 2,
      name: 'Michael Chen',
      title: 'Full Stack Developer at Microsoft',
      location: 'Seattle, WA',
      connections: 623,
      avatar: 'https://readdy.ai/api/search-image?query=professional%20asian%20man%20headshot%2C%20software%20engineer%2C%20modern%20office%20background%2C%20professional%20photography&width=80&height=80&seq=p2&orientation=squarish',
      skills: ['React', 'Node.js', 'AWS'],
      mutualConnections: 8
    },
    {
      id: 3,
      name: 'Emma Rodriguez',
      title: 'UX Designer at Adobe',
      location: 'San Francisco, CA',
      connections: 1205,
      avatar: 'https://readdy.ai/api/search-image?query=professional%20latina%20woman%20headshot%2C%20creative%20designer%2C%20modern%20studio%20background%2C%20artistic%20professional%20photography&width=80&height=80&seq=p3&orientation=squarish',
      skills: ['UI/UX Design', 'Figma', 'User Research'],
      mutualConnections: 15
    },
    {
      id: 4,
      name: 'David Kim',
      title: 'Data Scientist at Netflix',
      location: 'Los Gatos, CA',
      connections: 934,
      avatar: 'https://readdy.ai/api/search-image?query=professional%20korean%20man%20headshot%2C%20data%20scientist%2C%20tech%20company%20background%2C%20confident%20professional%20photography&width=80&height=80&seq=p4&orientation=squarish',
      skills: ['Python', 'Machine Learning', 'SQL'],
      mutualConnections: 6
    },
    {
      id: 5,
      name: 'Lisa Thompson',
      title: 'Marketing Director at Spotify',
      location: 'New York, NY',
      connections: 756,
      avatar: 'https://readdy.ai/api/search-image?query=professional%20woman%20headshot%2C%20marketing%20executive%2C%20creative%20office%20background%2C%20confident%20business%20portrait&width=80&height=80&seq=p5&orientation=squarish',
      skills: ['Digital Marketing', 'Brand Strategy', 'Analytics'],
      mutualConnections: 9
    },
    {
      id: 6,
      name: 'Alex Rivera',
      title: 'DevOps Engineer at Amazon',
      location: 'Austin, TX',
      connections: 542,
      avatar: 'https://readdy.ai/api/search-image?query=professional%20hispanic%20man%20headshot%2C%20devops%20engineer%2C%20tech%20office%20background%2C%20modern%20professional%20photography&width=80&height=80&seq=p6&orientation=squarish',
      skills: ['Docker', 'Kubernetes', 'CI/CD'],
      mutualConnections: 4
    }
  ];

  const companies = [
    {
      id: 1,
      name: 'TechCorp',
      industry: 'Technology',
      employees: '10,000+',
      followers: 45000,
      logo: 'https://readdy.ai/api/search-image?query=modern%20tech%20company%20logo%20with%20blue%20and%20purple%20gradient%2C%20corporate%20branding%2C%20professional%20design&width=80&height=80&seq=c1&orientation=squarish',
      description: 'Leading technology company specializing in cloud solutions and AI'
    },
    {
      id: 2,
      name: 'StartupX',
      industry: 'E-commerce',
      employees: '500-1000',
      followers: 12000,
      logo: 'https://readdy.ai/api/search-image?query=startup%20company%20logo%20with%20orange%20and%20yellow%20colors%2C%20dynamic%20design%2C%20innovation%20focused%20branding&width=80&height=80&seq=c2&orientation=squarish',
      description: 'Fast-growing e-commerce platform revolutionizing online shopping'
    },
    {
      id: 3,
      name: 'DesignStudio',
      industry: 'Design',
      employees: '100-500',
      followers: 8500,
      logo: 'https://readdy.ai/api/search-image?query=creative%20design%20studio%20logo%20with%20pink%20and%20purple%20gradient%2C%20artistic%20branding%2C%20modern%20typography&width=80&height=80&seq=c3&orientation=squarish',
      description: 'Award-winning design agency creating exceptional user experiences'
    }
  ];

  const filteredPeople = people.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Notification */}
      {showNotification && (
        <div className="fixed top-20 right-6 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-300">
          <div className="flex items-center space-x-2">
            <i className="ri-check-line"></i>
            <span>{notificationMessage}</span>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Network</h1>
          <p className="text-xl text-gray-600 mb-2">Connect with professionals and companies in your industry</p>
          <p className="text-lg text-blue-600 font-medium">Total Connections: {networkCount}</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <div className="w-5 h-5 flex items-center justify-center">
                <i className="ri-search-line text-gray-400"></i>
              </div>
            </div>
            <input
              type="text"
              placeholder="Search people, companies, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('people')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 cursor-pointer ${
                activeTab === 'people'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              People ({filteredPeople.length})
            </button>
            <button
              onClick={() => setActiveTab('companies')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 cursor-pointer ${
                activeTab === 'companies'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Companies ({filteredCompanies.length})
            </button>
          </div>
        </div>

        {/* People Tab */}
        {activeTab === 'people' && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPeople.map((person) => (
              <div key={person.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
                <div className="text-center mb-4">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden">
                    <img
                      src={person.avatar}
                      alt={person.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{person.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{person.title}</p>
                  <div className="flex items-center justify-center text-gray-500 text-sm mb-3">
                    <div className="w-4 h-4 flex items-center justify-center mr-1">
                      <i className="ri-map-pin-line"></i>
                    </div>
                    <span>{person.location}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex flex-wrap gap-1 justify-center">
                    {person.skills.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-center text-sm text-gray-500 mb-4">
                  <p>{person.connections} connections</p>
                  {person.mutualConnections > 0 && (
                    <p>{person.mutualConnections} mutual connections</p>
                  )}
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleFollow(person.id)}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors duration-200 cursor-pointer whitespace-nowrap ${
                      followingUsers.has(person.id)
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {followingUsers.has(person.id) ? 'Following' : 'Follow'}
                  </button>
                  <Link
                    href="/jobs"
                    className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors duration-200 text-center cursor-pointer whitespace-nowrap"
                  >
                    Jobs
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Companies Tab */}
        {activeTab === 'companies' && (
          <div className="grid gap-6 md:grid-cols-2">
            {filteredCompanies.map((company) => (
              <div key={company.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={company.logo}
                      alt={`${company.name} logo`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{company.name}</h3>
                    <p className="text-gray-600 mb-2">{company.industry}</p>
                    <p className="text-gray-500 text-sm mb-3">{company.description}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-1">
                        <div className="w-4 h-4 flex items-center justify-center">
                          <i className="ri-team-line"></i>
                        </div>
                        <span>{company.employees} employees</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-4 h-4 flex items-center justify-center">
                          <i className="ri-user-follow-line"></i>
                        </div>
                        <span>{company.followers.toLocaleString()} followers</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleFollow(company.id)}
                        className={`px-4 py-2 font-medium rounded-lg transition-colors duration-200 cursor-pointer whitespace-nowrap text-sm ${
                          followingUsers.has(company.id)
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {followingUsers.has(company.id) ? 'Following' : 'Follow'}
                      </button>
                      <Link
                        href="/jobs"
                        className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer whitespace-nowrap text-sm"
                      >
                        View Jobs
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {((activeTab === 'people' && filteredPeople.length === 0) || 
          (activeTab === 'companies' && filteredCompanies.length === 0)) && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <i className="ri-search-line text-gray-400 text-2xl"></i>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-500">Try adjusting your search terms or browse all {activeTab}</p>
          </div>
        )}

        {/* Load More */}
        {((activeTab === 'people' && filteredPeople.length > 0) || 
          (activeTab === 'companies' && filteredCompanies.length > 0)) && (
          <div className="text-center mt-8">
            <button className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200 cursor-pointer whitespace-nowrap">
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}