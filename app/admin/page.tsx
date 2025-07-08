'use client';

import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useRouter } from 'next/navigation';
import authService from '../../components/authService';

export default function AdminPanel() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [userToSuspend, setUserToSuspend] = useState<any>(null);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [showJobModal, setShowJobModal] = useState(false);
  const [showRemoveJobModal, setShowRemoveJobModal] = useState(false);
  const [jobToRemove, setJobToRemove] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([
    { id: 1, title: 'Senior React Developer', company: 'TechCorp', postedBy: 'john@techcorp.com', amount: 99, date: '2024-01-15', status: 'active', description: 'We are looking for a Senior React Developer to join our dynamic team. You will be responsible for developing user interface components and implementing them following well-known React.js workflows.', requirements: 'React, JavaScript, TypeScript, Node.js', applicants: 24 },
    { id: 2, title: 'Full Stack Engineer', company: 'StartupXYZ', postedBy: 'hr@startupxyz.com', amount: 99, date: '2024-01-14', status: 'active', description: 'Join our innovative startup as a Full Stack Engineer. You will work on both front-end and back-end development using modern technologies.', requirements: 'JavaScript, Python, React, Django, PostgreSQL', applicants: 31 },
    { id: 3, title: 'Product Manager', company: 'InnovateLab', postedBy: 'jobs@innovatelab.com', amount: 99, date: '2024-01-13', status: 'active', description: 'We need an experienced Product Manager to lead our product development initiatives and drive innovation.', requirements: 'Product Management, Agile, Analytics, Leadership', applicants: 18 },
    { id: 4, title: 'UX Designer', company: 'DesignStudio', postedBy: 'hiring@designstudio.com', amount: 99, date: '2024-01-12', status: 'active', description: 'Creative UX Designer needed to create intuitive and engaging user experiences for our digital products.', requirements: 'UX/UI Design, Figma, Adobe XD, Prototyping', applicants: 12 }
  ]);
  const [user, setUser] = useState<any>(null);

  const mockData = {
    users: {
      total: 2847,
      active: 1923,
      newThisMonth: 234,
      registrationData: [
        { month: 'Jan', users: 120 },
        { month: 'Feb', users: 158 },
        { month: 'Mar', users: 192 },
        { month: 'Apr', users: 234 },
        { month: 'May', users: 276 },
        { month: 'Jun', users: 312 }
      ]
    },
    jobs: {
      total: 1456,
      active: 892,
      filled: 387,
      revenue: 144600,
      postingData: [
        { month: 'Jan', jobs: 45 },
        { month: 'Feb', jobs: 67 },
        { month: 'Mar', users: 89 },
        { month: 'Apr', jobs: 123 },
        { month: 'May', jobs: 145 },
        { month: 'Jun', jobs: 167 }
      ]
    },
    posts: {
      total: 5632,
      thisMonth: 489,
      engagement: 78.5
    },
    payments: {
      totalRevenue: 144600,
      thisMonth: 12800,
      transactions: 1456,
      distributionData: [
        { name: 'Job Postings', value: 85, color: '#3B82F6' },
        { name: 'Premium Features', value: 15, color: '#10B981' }
      ]
    }
  };

  const recentUsers: any[] = [
    { 
      id: 1, 
      name: 'John Smith', 
      email: 'john@example.com', 
      joinDate: '2024-01-15', 
      posts: 12, 
      jobsApplied: 8,
      status: 'active',
      skills: ['React', 'JavaScript', 'Node.js'],
      bio: 'Senior Frontend Developer with 5+ years of experience in building modern web applications.',
      linkedinUrl: 'https://linkedin.com/in/johnsmith',
      walletAddress: '0x1234...5678'
    },
    { 
      id: 2, 
      name: 'Sarah Johnson', 
      email: 'sarah@example.com', 
      joinDate: '2024-01-14', 
      posts: 8, 
      jobsApplied: 15,
      status: 'active',
      skills: ['Python', 'Django', 'PostgreSQL'],
      bio: 'Full-stack developer passionate about creating scalable backend solutions.',
      linkedinUrl: 'https://linkedin.com/in/sarahjohnson',
      walletAddress: '0xabcd...efgh'
    },
    { 
      id: 3, 
      name: 'Mike Davis', 
      email: 'mike@example.com', 
      joinDate: '2024-01-13', 
      posts: 23, 
      jobsApplied: 5,
      status: 'suspended',
      skills: ['Java', 'Spring Boot', 'AWS'],
      bio: 'Backend engineer with expertise in microservices architecture.',
      linkedinUrl: 'https://linkedin.com/in/mikedavis',
      walletAddress: '0x9876...5432'
    },
    { 
      id: 4, 
      name: 'Emily Brown', 
      email: 'emily@example.com', 
      joinDate: '2024-01-12', 
      posts: 15, 
      jobsApplied: 12,
      status: 'active',
      skills: ['UX/UI Design', 'Figma', 'Adobe XD'],
      bio: 'Creative UX designer focused on user-centered design principles.',
      linkedinUrl: 'https://linkedin.com/in/emilybrown',
      walletAddress: '0xfedc...ba98'
    },
    { 
      id: 5, 
      name: 'David Wilson', 
      email: 'david@example.com', 
      joinDate: '2024-01-11', 
      posts: 6, 
      jobsApplied: 9,
      status: 'active',
      skills: ['Product Management', 'Agile', 'Analytics'],
      bio: 'Product manager with a track record of launching successful digital products.',
      linkedinUrl: 'https://linkedin.com/in/davidwilson',
      walletAddress: '0x1357...2468'
    }
  ];

  const handleViewUser = (user: any) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleSuspendUser = (user: any) => {
    setUserToSuspend(user);
    setShowSuspendModal(true);
  };

  const handleViewJob = (job: any) => {
    setSelectedJob(job);
    setShowJobModal(true);
  };

  const handleRemoveJob = (job: any) => {
    setJobToRemove(job);
    setShowRemoveJobModal(true);
  };

  const confirmRemoveJob = () => {
    if (jobToRemove) {
      setJobs((prev: any[]) => prev.filter((n: any) => n.id !== jobToRemove.id));
      setShowRemoveJobModal(false);
      setJobToRemove(null);
      alert(`Job "${jobToRemove.title}" has been removed successfully.`);
    }
  };

  const confirmSuspend = () => {
    if (userToSuspend) {
      // Update user status in the array
      const updatedUsers = recentUsers.map((n: any) => 
        n.id === userToSuspend.id 
          ? { ...n, status: n.status === 'active' ? 'suspended' : 'active' }
          : n
      );
      setShowSuspendModal(false);
      setUserToSuspend(null);
      // Show success message
      alert(`User ${userToSuspend.name} has been ${userToSuspend.status === 'active' ? 'suspended' : 'reactivated'} successfully.`);
    }
  };

  useEffect(() => {
    const currentUser = authService.getUser();
    setUser(currentUser);
    if (!currentUser || currentUser.role !== 'admin') {
      router.replace('/');
    }
  }, [router]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full mx-4">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-admin-line text-red-600 text-2xl"></i>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Access</h1>
              <p className="text-gray-600">You are not authorized to view this page.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage users, jobs, and platform analytics</p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="ri-user-line text-blue-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{mockData.users.total.toLocaleString()}</p>
                <p className="text-sm text-green-600">+{mockData.users.newThisMonth} this month</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="ri-briefcase-line text-green-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{mockData.jobs.total.toLocaleString()}</p>
                <p className="text-sm text-blue-600">{mockData.jobs.active} active</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <i className="ri-article-line text-purple-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Posts</p>
                <p className="text-2xl font-bold text-gray-900">{mockData.posts.total.toLocaleString()}</p>
                <p className="text-sm text-purple-600">+{mockData.posts.thisMonth} this month</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <i className="ri-money-dollar-circle-line text-yellow-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${mockData.payments.totalRevenue.toLocaleString()}</p>
                <p className="text-sm text-green-600">+${mockData.payments.thisMonth.toLocaleString()} this month</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {['overview', 'users', 'jobs', 'payments'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap cursor-pointer transition-colors duration-200 ${
                    activeTab === tab
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="grid lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">User Registration Trend</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={mockData.users.registrationData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="users" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Distribution</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={mockData.payments.distributionData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={(entry) => `${entry.name}: ${entry.value}%`}
                        >
                          {mockData.payments.distributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                  <div className="flex space-x-4">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                      Export Users
                    </button>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search users..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <div className="absolute left-3 top-2.5 w-5 h-5 flex items-center justify-center">
                        <i className="ri-search-line text-gray-400"></i>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Email</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Join Date</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Posts</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Applications</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentUsers.map((user) => (
                        <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-medium">
                                  {user.name.split(' ').map((n: string) => n[0]).join('')}
                                </span>
                              </div>
                              <span className="ml-3 font-medium text-gray-900">{user.name}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-gray-600">{user.email}</td>
                          <td className="py-4 px-4 text-gray-600">{user.joinDate}</td>
                          <td className="py-4 px-4 text-gray-600">{user.posts}</td>
                          <td className="py-4 px-4 text-gray-600">{user.jobsApplied}</td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => handleViewUser(user)}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors cursor-pointer"
                              >
                                View
                              </button>
                              <button 
                                onClick={() => handleSuspendUser(user)}
                                className={`text-sm font-medium px-2 py-1 rounded transition-colors cursor-pointer ${
                                  user.status === 'active'
                                    ? 'text-red-600 hover:text-red-800 hover:bg-red-50'
                                    : 'text-green-600 hover:text-green-800 hover:bg-green-50'
                                }`}
                              >
                                {user.status === 'active' ? 'Suspend' : 'Reactivate'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'jobs' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Job Management</h3>
                  <div className="flex space-x-4">
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200">
                      Export Jobs
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Job Title</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Company</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Posted By</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Amount Paid</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jobs.map((job) => (
                        <tr key={job.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4 font-medium text-gray-900">{job.title}</td>
                          <td className="py-4 px-4 text-gray-600">{job.company}</td>
                          <td className="py-4 px-4 text-gray-600">{job.postedBy}</td>
                          <td className="py-4 px-4 text-green-600 font-medium">${job.amount}</td>
                          <td className="py-4 px-4 text-gray-600">{job.date}</td>
                          <td className="py-4 px-4">
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => handleViewJob(job)}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors cursor-pointer"
                              >
                                View
                              </button>
                              <button 
                                onClick={() => handleRemoveJob(job)}
                                className="text-red-600 hover:text-red-800 text-sm font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors cursor-pointer"
                              >
                                Remove
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'payments' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Payment Analytics</h3>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Total Revenue</h4>
                    <p className="text-3xl font-bold text-green-600">${mockData.payments.totalRevenue.toLocaleString()}</p>
                    <p className="text-sm text-green-700 mt-1">From {mockData.payments.transactions} transactions</p>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">This Month</h4>
                    <p className="text-3xl font-bold text-blue-600">${mockData.payments.thisMonth.toLocaleString()}</p>
                    <p className="text-sm text-blue-700 mt-1">23% increase from last month</p>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg">
                    <h4 className="font-medium text-purple-900 mb-2">Average per Job</h4>
                    <p className="text-3xl font-bold text-purple-600">$99</p>
                    <p className="text-sm text-purple-700 mt-1">Standard job posting fee</p>
                  </div>
                </div>

                <div className="bg-white border rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-4">Recent Transactions</h4>
                  <div className="space-y-4">
                    {jobs.map((job) => (
                      <div key={job.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{job.title}</p>
                          <p className="text-sm text-gray-600">{job.company} • {job.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-green-600">+${job.amount}</p>
                          <p className="text-xs text-gray-500">Job Posting Fee</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">User Details</h3>
              <button
                onClick={() => setShowUserModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl font-medium">
                    {selectedUser.name.split(' ').map((n: string) => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900">{selectedUser.name}</h4>
                  <p className="text-gray-600">{selectedUser.email}</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                    selectedUser.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedUser.status}
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold text-gray-900 mb-2">Account Information</h5>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Join Date:</span> {selectedUser.joinDate}</p>
                    <p><span className="font-medium">Posts Created:</span> {selectedUser.posts}</p>
                    <p><span className="font-medium">Job Applications:</span> {selectedUser.jobsApplied}</p>
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold text-gray-900 mb-2">Profile Links</h5>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">LinkedIn:</span>{' '} 
                      <a href={selectedUser.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                        View Profile
                      </a>
                    </p>
                    <p><span className="font-medium">Wallet:</span> {selectedUser.walletAddress}</p>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="font-semibold text-gray-900 mb-2">Bio</h5>
                <p className="text-gray-700 text-sm">{selectedUser.bio}</p>
              </div>

              <div>
                <h5 className="font-semibold text-gray-900 mb-2">Skills</h5>
                <div className="flex flex-wrap gap-2">
                  {selectedUser.skills.map((skill: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-8">
              <button
                onClick={() => setShowUserModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowUserModal(false);
                  handleSuspendUser(selectedUser);
                }}
                className={`px-4 py-2 font-medium rounded-lg cursor-pointer ${
                  selectedUser.status === 'active'
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {selectedUser.status === 'active' ? 'Suspend User' : 'Reactivate User'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Suspend Confirmation Modal */}
      {showSuspendModal && userToSuspend && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                userToSuspend.status === 'active' ? 'bg-red-100' : 'bg-green-100'
              }`}>
                <i className={`text-2xl ${
                  userToSuspend.status === 'active' ? 'ri-error-warning-line text-red-600' : 'ri-check-line text-green-600'
                }`}></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {userToSuspend.status === 'active' ? 'Suspend User' : 'Reactivate User'}
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to {userToSuspend.status === 'active' ? 'suspend' : 'reactivate'} <strong>{userToSuspend.name}</strong>?
                {userToSuspend.status === 'active' && (
                  <span className="block mt-2 text-sm">
                    This will prevent them from accessing their account and posting content.
                  </span>
                )}
              </p>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setShowSuspendModal(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmSuspend}
                className={`flex-1 px-4 py-2 font-medium rounded-lg cursor-pointer ${
                  userToSuspend.status === 'active'
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {userToSuspend.status === 'active' ? 'Suspend' : 'Reactivate'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Job Details Modal */}
      {showJobModal && selectedJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Job Details</h3>
              <button
                onClick={() => setShowJobModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                <h4 className="text-xl font-semibold text-gray-900 mb-2">{selectedJob.title}</h4>
                <p className="text-gray-700 font-medium mb-1">{selectedJob.company}</p>
                <p className="text-gray-600 text-sm">Posted by: {selectedJob.postedBy}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold text-gray-900 mb-3">Job Information</h5>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Posted Date:</span> {selectedJob.date}</p>
                    <p><span className="font-medium">Payment Amount:</span> <span className="text-green-600 font-semibold">${selectedJob.amount}</span></p>
                    <p><span className="font-medium">Status:</span> 
                      <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        {selectedJob.status}
                      </span>
                    </p>
                    <p><span className="font-medium">Applicants:</span> {selectedJob.applicants} candidates</p>
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold text-gray-900 mb-3">Analytics</h5>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600">Application Rate</span>
                        <span className="text-sm text-gray-900">85%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{width: '85%'}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600">Skill Match</span>
                        <span className="text-sm text-gray-900">92%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{width: '92%'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="font-semibold text-gray-900 mb-2">Job Description</h5>
                <p className="text-gray-700 text-sm leading-relaxed">{selectedJob.description}</p>
              </div>

              <div>
                <h5 className="font-semibold text-gray-900 mb-2">Required Skills & Qualifications</h5>
                <div className="flex flex-wrap gap-2">
                  {selectedJob.requirements.split(', ').map((requirement: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {requirement}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-semibold text-gray-900 mb-2">Recent Activity</h5>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• 5 new applications in the last 24 hours</p>
                  <p>• Job viewed 247 times this week</p>
                  <p>• Average candidate score: 78%</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-8">
              <button
                onClick={() => setShowJobModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowJobModal(false);
                  handleRemoveJob(selectedJob);
                }}
                className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 cursor-pointer"
              >
                Remove Job
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Job Confirmation Modal */}
      {showRemoveJobModal && jobToRemove && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-delete-bin-line text-red-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Remove Job Posting</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to remove <strong>"{jobToRemove.title}"</strong> from {jobToRemove.company}?
                <span className="block mt-2 text-sm">
                  This action cannot be undone and will notify all applicants.
                </span>
              </p>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setShowRemoveJobModal(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmRemoveJob}
                className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 cursor-pointer"
              >
                Remove Job
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
