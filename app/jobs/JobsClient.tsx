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
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchJobs() {
      setIsLoading(true);
      setError('');
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/jobs`);
        if (!res.ok) throw new Error('Failed to fetch jobs');
        const data = await res.json();
        setJobs(data);
      } catch (err) {
        setError('Could not fetch jobs from server. Showing sample jobs.');
        setJobs(defaultJobs);
      } finally {
        setIsLoading(false);
      }
    }
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job => {
    return (
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (Array.isArray(job.skills) && job.skills.some((skill: string) => skill.toLowerCase().includes(searchTerm.toLowerCase())))
    ) &&
    (locationFilter === '' || job.location?.toLowerCase().includes(locationFilter.toLowerCase())) &&
    (jobTypeFilter === '' || job.type === jobTypeFilter) &&
    (salaryFilter === '' || (job.salary && job.salary.includes(salaryFilter)));
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
        {error && (
          <div className="mb-4 text-red-500 text-center">{error}</div>
        )}
        {filteredJobs.length === 0 ? (
          <div className="text-center text-gray-500 py-12">No jobs found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredJobs.map((job) => (
              <div key={job._id || job.id} className="bg-white rounded-xl shadow-md p-6 flex flex-col">
                <div className="flex items-center mb-4">
                  {job.logo && (
                    <img src={job.logo} alt={job.company} className="w-12 h-12 rounded-full mr-4 object-cover" />
                  )}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                    <div className="text-gray-600 text-sm">{job.company}</div>
                  </div>
                </div>
                <div className="text-gray-700 mb-2">{job.location || 'Remote'}</div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {Array.isArray(job.skills)
                    ? job.skills.map((skill: string, idx: number) => (
                        <span key={idx} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                          {skill}
                        </span>
                      ))
                    : null}
                </div>
                <div className="text-gray-500 text-xs mb-2">{job.type} &bull; {job.salary}</div>
                <div className="flex-1 text-gray-600 text-sm mb-4 line-clamp-3">{job.description || job.posted}</div>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-xs text-gray-400">{job.posted || new Date(job.createdAt).toLocaleDateString()}</span>
                  <Link href={"/jobs/" + (job._id || job.id)} className="text-blue-600 hover:underline text-sm font-medium">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 