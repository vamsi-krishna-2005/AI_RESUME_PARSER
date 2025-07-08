'use client';

import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import authService from '../../components/authService';
import { useRouter } from 'next/navigation';

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
  postedBy: string;
  createdAt: string;
  applications: number;
  status: 'active' | 'paused' | 'closed';
}

interface Application {
  _id: string;
  jobId: string;
  jobTitle: string;
  applicant: {
    _id: string;
    name: string;
    email: string;
    skills: string[];
  };
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired';
  appliedAt: string;
  matchScore: number;
}

export default function EmployerDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    pendingApplications: 0,
    hiredCandidates: 0
  });

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        // Check if user is authenticated
        if (!authService.isAuthenticated()) {
          router.push('/');
          return;
        }

        // Load jobs from localStorage
        const savedJobs = localStorage.getItem('careermatch_jobs');
        if (savedJobs) {
          const allJobs = JSON.parse(savedJobs);
          const userJobs = allJobs.filter((job: Job) => 
            job.postedBy === authService.getUser().email || 
            job.postedBy === authService.getUser()._id
          );
          setJobs(userJobs);
          
          // Calculate stats
          setStats({
            totalJobs: userJobs.length,
            activeJobs: userJobs.filter((job: Job) => job.status === 'active').length,
            totalApplications: userJobs.reduce((sum: number, job: Job) => sum + (job.applications || 0), 0),
            pendingApplications: 0, // Will be calculated from applications
            hiredCandidates: 0 // Will be calculated from applications
          });
        }

        // Load applications from localStorage
        const savedApplications = localStorage.getItem('careermatch_applications');
        if (savedApplications) {
          const allApplications = JSON.parse(savedApplications);
          const userApplications = allApplications.filter((app: Application) => 
            jobs.some(job => job._id === app.jobId)
          );
          setApplications(userApplications);
          
          // Update stats
          setStats(prev => ({
            ...prev,
            pendingApplications: userApplications.filter((app: Application) => app.status === 'pending').length,
            hiredCandidates: userApplications.filter((app: Application) => app.status === 'hired').length
          }));
        }

      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, [router]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getApplicationStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'shortlisted': return 'bg-purple-100 text-purple-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'hired': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading dashboard...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Employer Dashboard</h1>
          <p className="text-gray-600">Manage your job postings and candidate applications</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalJobs}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <i className="ri-briefcase-line text-blue-600 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeJobs}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <i className="ri-check-line text-green-600 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalApplications}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <i className="ri-file-list-line text-purple-600 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingApplications}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <i className="ri-time-line text-yellow-600 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Hired</p>
                <p className="text-2xl font-bold text-gray-900">{stats.hiredCandidates}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <i className="ri-user-star-line text-green-600 text-xl"></i>
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
                onClick={() => setActiveTab('jobs')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap cursor-pointer ${
                  activeTab === 'jobs'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Job Postings ({jobs.length})
              </button>
              <button
                onClick={() => setActiveTab('applications')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap cursor-pointer ${
                  activeTab === 'applications'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Applications ({applications.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Job Postings</h3>
                  {jobs.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <i className="ri-briefcase-line text-gray-400 text-2xl"></i>
                      </div>
                      <h4 className="text-lg font-medium text-gray-900 mb-2">No jobs posted yet</h4>
                      <p className="text-gray-500 mb-4">Start by creating your first job posting</p>
                      <button
                        onClick={() => router.push('/post-job')}
                        className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                      >
                        Post a Job
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {jobs.slice(0, 3).map((job) => (
                        <div key={job._id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold text-gray-900">{job.title}</h4>
                              <p className="text-sm text-gray-600">{job.location} • {job.type}</p>
                            </div>
                            <div className="flex items-center space-x-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                                {job.status}
                              </span>
                              <span className="text-sm text-gray-500">{job.applications || 0} applications</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Applications</h3>
                  {applications.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <i className="ri-file-list-line text-gray-400 text-2xl"></i>
                      </div>
                      <p className="text-gray-500">No applications received yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {applications.slice(0, 3).map((application) => (
                        <div key={application._id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold text-gray-900">{application.applicant.name}</h4>
                              <p className="text-sm text-gray-600">{application.jobTitle}</p>
                            </div>
                            <div className="flex items-center space-x-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getApplicationStatusColor(application.status)}`}>
                                {application.status}
                              </span>
                              <span className="text-sm text-gray-500">{application.matchScore}% match</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'jobs' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Job Postings</h3>
                  <button
                    onClick={() => router.push('/post-job')}
                    className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Post New Job
                  </button>
                </div>

                {jobs.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <i className="ri-briefcase-line text-gray-400 text-2xl"></i>
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No jobs posted yet</h4>
                    <p className="text-gray-500 mb-4">Create your first job posting to start receiving applications</p>
                    <button
                      onClick={() => router.push('/post-job')}
                      className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      Post Your First Job
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {jobs.map((job) => (
                      <div key={job._id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4 mb-2">
                              <h4 className="text-lg font-semibold text-gray-900">{job.title}</h4>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                                {job.status}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-2">{job.company} • {job.location} • {job.type}</p>
                            <p className="text-gray-600 mb-4">{job.salary}</p>
                            <p className="text-gray-700 text-sm line-clamp-2">{job.description}</p>
                          </div>
                          <div className="flex items-center space-x-4 ml-6">
                            <div className="text-center">
                              <p className="text-2xl font-bold text-gray-900">{job.applications || 0}</p>
                              <p className="text-xs text-gray-500">Applications</p>
                            </div>
                            <div className="flex flex-col space-y-2">
                              <button className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200">
                                Edit
                              </button>
                              <button className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200">
                                View Apps
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <p className="text-sm text-gray-500">Posted on {formatDate(job.createdAt)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'applications' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Candidate Applications</h3>
                
                {applications.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <i className="ri-file-list-line text-gray-400 text-2xl"></i>
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h4>
                    <p className="text-gray-500">Applications will appear here once candidates apply to your jobs</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applications.map((application) => (
                      <div key={application._id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4 mb-2">
                              <h4 className="text-lg font-semibold text-gray-900">{application.applicant.name}</h4>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getApplicationStatusColor(application.status)}`}>
                                {application.status}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-2">{application.jobTitle}</p>
                            <p className="text-gray-600 mb-3">{application.applicant.email}</p>
                            <div className="flex flex-wrap gap-2">
                              {application.applicant.skills?.slice(0, 5).map((skill, index) => (
                                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 ml-6">
                            <div className="text-center">
                              <p className="text-2xl font-bold text-gray-900">{application.matchScore}%</p>
                              <p className="text-xs text-gray-500">Match Score</p>
                            </div>
                            <div className="flex flex-col space-y-2">
                              <button className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200">
                                View Profile
                              </button>
                              <button className="px-4 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200">
                                Shortlist
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <p className="text-sm text-gray-500">Applied on {formatDate(application.appliedAt)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 