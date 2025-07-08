'use client';

import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';

// Default jobs data
const defaultJobs = [
  {
    id: 1,
    title: 'Senior Frontend Developer',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$120k - $160k',
    skills: ['React', 'TypeScript', 'Next.js'],
    posted: '2 days ago',
    applicants: 23,
    logo: 'https://readdy.ai/api/search-image?query=modern%20tech%20company%20logo%20with%20blue%20and%20purple%20gradient%2C%20minimalist%20design%2C%20corporate%20branding&width=64&height=64&seq=tc1&orientation=squarish'
  },
  {
    id: 2,
    title: 'Product Manager',
    company: 'StartupX',
    location: 'Remote',
    type: 'Full-time',
    salary: '$100k - $140k',
    skills: ['Product Strategy', 'Analytics', 'Agile'],
    posted: '1 day ago',
    applicants: 45,
    logo: 'https://readdy.ai/api/search-image?query=startup%20company%20logo%20with%20orange%20and%20yellow%20colors%2C%20dynamic%20design%2C%20innovation%20focused%20branding&width=64&height=64&seq=sx1&orientation=squarish'
  },
  {
    id: 3,
    title: 'Data Scientist',
    company: 'DataFlow Inc',
    location: 'New York, NY',
    type: 'Full-time',
    salary: '$130k - $170k',
    skills: ['Python', 'Machine Learning', 'SQL'],
    posted: '3 days ago',
    applicants: 67,
    logo: 'https://readdy.ai/api/search-image?query=data%20analytics%20company%20logo%20with%20green%20and%20blue%20colors%2C%20professional%20tech%20branding%2C%20clean%20design&width=64&height=64&seq=df1&orientation=squarish'
  },
  {
    id: 4,
    title: 'UX Designer',
    company: 'DesignStudio',
    location: 'Los Angeles, CA',
    type: 'Contract',
    salary: '$80k - $110k',
    skills: ['Figma', 'User Research', 'Prototyping'],
    posted: '5 days ago',
    applicants: 34,
    logo: 'https://readdy.ai/api/search-image?query=creative%20design%20studio%20logo%20with%20pink%20and%20purple%20gradient%2C%20artistic%20branding%2C%20modern%20typography&width=64&height=64&seq=ds1&orientation=squarish'
  },
  {
    id: 5,
    title: 'Backend Engineer',
    company: 'CloudTech',
    location: 'Seattle, WA',
    type: 'Full-time',
    salary: '$110k - $150k',
    skills: ['Node.js', 'AWS', 'MongoDB'],
    posted: '1 week ago',
    applicants: 56,
    logo: 'https://readdy.ai/api/search-image?query=cloud%20technology%20company%20logo%20with%20blue%20and%20white%20colors%2C%20tech%20focused%20branding%2C%20professional%20design&width=64&height=64&seq=ct1&orientation=squarish'
  },
  {
    id: 6,
    title: 'Marketing Manager',
    company: 'GrowthLab',
    location: 'Austin, TX',
    type: 'Full-time',
    salary: '$90k - $120k',
    skills: ['Digital Marketing', 'SEO', 'Analytics'],
    posted: '4 days ago',
    applicants: 28,
    logo: 'https://readdy.ai/api/search-image?query=marketing%20agency%20logo%20with%20bright%20colors%2C%20dynamic%20design%2C%20growth%20focused%20branding&width=64&height=64&seq=gl1&orientation=squarish'
  }
];

export default function JobsClient() {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('');
  const [salaryFilter, setSalaryFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [jobs, setJobs] = useState(defaultJobs);
  const [isLoading, setIsLoading] = useState(true);

  // Load jobs from localStorage on component mount
  useEffect(() => {
    const savedJobs = localStorage.getItem('careermatch_jobs');
    if (savedJobs) {
      try {
        const parsedJobs = JSON.parse(savedJobs);
        setJobs(parsedJobs);
      } catch (error) {
        console.error('Error parsing saved jobs:', error);
        setJobs(defaultJobs);
      }
    } else {
      // Initialize localStorage with default jobs
      localStorage.setItem('careermatch_jobs', JSON.stringify(defaultJobs));
    }
    setIsLoading(false);
  }, []);

  // Save jobs to localStorage whenever jobs state changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('careermatch_jobs', JSON.stringify(jobs));
    }
  }, [jobs, isLoading]);

  // Check for newly posted job from URL params
  useEffect(() => {
    const newJobData = searchParams.get('newJob');
    if (newJobData && !isLoading) {
      try {
        const newJob = JSON.parse(decodeURIComponent(newJobData));
        // Check if job already exists to avoid duplicates
        const jobExists = jobs.some(job => job.id === newJob.id);
        if (!jobExists) {
          // Add the new job at the beginning of the list
          setJobs(prevJobs => [newJob, ...prevJobs]);
        }
        // Clear the URL param after adding the job
        const url = new URL(window.location.href);
        url.searchParams.delete('newJob');
        window.history.replaceState({}, '', url);
      } catch (error) {
        console.error('Error parsing new job data:', error);
      }
    }
  }, [searchParams, jobs, isLoading]);

  const filteredJobs = jobs.filter(job => {
    return (
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    ) &&
    (locationFilter === '' || job.location.toLowerCase().includes(locationFilter.toLowerCase())) &&
    (jobTypeFilter === '' || job.type === jobTypeFilter) &&
    (salaryFilter === '' || job.salary.includes(salaryFilter));
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading jobs...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Your Dream Job</h1>
          <p className="text-xl text-gray-600">Discover opportunities that match your skills and passion</p>
        </div>
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <i className="ri-search-line text-gray-400"></i>
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="Search jobs, companies, or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>
            {/* ... rest of the UI ... */}
          </div>
        </div>
        {/* ... rest of the jobs UI ... */}
      </div>
    </div>
  );
} 