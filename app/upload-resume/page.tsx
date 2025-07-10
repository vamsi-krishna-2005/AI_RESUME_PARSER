'use client';

import { useState, useRef, useEffect } from 'react';
import Header from '../../components/Header';
import { useRouter } from 'next/navigation';

interface Skill {
  name: string;
  confidence: number;
  category: string;
}

interface JobSuggestion {
  title: string;
  description: string;
}

interface ResumeAnalysis {
  skills: Skill[];
  experience: string;
  education: string;
  summary: string;
  suggestedJobs: JobSuggestion[];
}

export default function UploadResume() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileError, setFileError] = useState('');
  const [parsedText, setParsedText] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [jobSuggestions, setJobSuggestions] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Progress bar animation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isUploading) {
      setUploadProgress(0);
      let progress = 0;
      const target = Math.floor(Math.random() * 30) + 60; // 60-90%
      interval = setInterval(() => {
        progress += Math.floor(Math.random() * 5) + 1; // increment by 1-5%
        if (progress >= target) {
          clearInterval(interval);
        } else {
          setUploadProgress(progress);
        }
      }, 100);
    } else if (!isUploading && uploadProgress < 100 && selectedFile) {
      setUploadProgress(100);
    }
    return () => clearInterval(interval);
  }, [isUploading, selectedFile]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
      setFileName(e.dataTransfer.files[0].name);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
    }
  };

  const handleFile = async (file: File) => {
    setFileError('');
    
    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      setFileError('Please upload a PDF, DOC, DOCX, or TXT file.');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setFileError('File size must be less than 5MB.');
      return;
    }

    await handleFileUpload(file);
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setFileError('');
    try {
      const formData = new FormData();
      formData.append('resume', file);

      // Step 1: Parse the resume
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/parse/parse-resume`, {
        method: 'POST',
        body: formData,
      });

      let data;
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        // Not JSON, probably an HTML error page
        setFileError("Server error: received invalid response. Please try again later.");
        setIsUploading(false);
        return;
      }

      if (!res.ok) {
        setFileError(data.error || "An error occurred during analysis. Please try again.");
        setIsUploading(false);
        return;
      }

      console.log("Parse response:", data);

      setParsedText(data.text);
      setSkills(data.skills);
      setJobSuggestions([]); // clear for now

      // Step 2: Generate summary and job suggestions using Gemini
      const summaryRes = await fetch(`https://python-microservice-1htu.onrender.com/generate-summary`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    skills: data.skills,
    experience: data.experience,
    education: data.education,
  }),
});
const summaryData = await summaryRes.json();

      console.log("Summary response:", summaryData);

      const summary = summaryData.summary;
      const jobSuggestions = summaryData.jobSuggestions;

      // Step 3: Build the ResumeAnalysis object
      const realAnalysis: ResumeAnalysis = {
        skills: (data.skills || []).map((name: string) => ({
          name,
          confidence: 100,
          category: 'Programming',
        })),
        experience: data.experience || '',
        education: data.education || '',
        summary: summary || '',
        suggestedJobs: jobSuggestions || [],
      };

      console.log("realAnalysis:", realAnalysis);

      if (summaryData && summaryData.summary) {
        setAnalysis(realAnalysis);
        localStorage.setItem('resume_analysis', JSON.stringify(realAnalysis));
        localStorage.setItem('uploaded_resume', file.name);
      } else {
        setFileError("Failed to generate summary. Please try again.");
      }
    } catch (err: any) {
      // Try to extract the error message from the backend response
      if (err instanceof Response) {
        // If fetch threw due to non-2xx, parse the error JSON
        const errorData = await err.json();
        setFileError(errorData.error || "An error occurred during analysis. Please try again.");
      } else if (err?.message) {
        setFileError(err.message);
      } else {
        setFileError("An error occurred during analysis. Please try again.");
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleContinue = () => {
    router.push('/dashboard');
  };

  const handleUploadAnotherResume = () => {
    setAnalysis(null);
    setFileName('');
    setSkills([]);
    setJobSuggestions([]);
    setParsedText('');
    setFileError('');
    setSelectedFile(null);
    localStorage.removeItem('resume_analysis');
    localStorage.removeItem('uploaded_resume');
  };

  const handleDeleteResume = () => {
    setAnalysis(null);
    setFileName('');
    setSkills([]);
    setJobSuggestions([]);
    setParsedText('');
    setFileError('');
    setSelectedFile(null);
    setUploadProgress(0);
    localStorage.removeItem('resume_analysis');
    localStorage.removeItem('uploaded_resume');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Upload Your Resume</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Let our AI analyze your resume and extract your skills to provide personalized job recommendations
          </p>
        </div>

        {!analysis ? (
          /* Upload Section */
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="max-w-2xl mx-auto">
              {/* Upload Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors duration-200 ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {isUploading ? (
                  <div>
                    <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                      <i className="ri-upload-cloud-line text-blue-600 text-2xl"></i>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Uploading Resume...</h3>
                    <p className="text-gray-600 mb-4">Please wait while we analyze your resume</p>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-500">{uploadProgress}% complete</p>
                  </div>
                ) : (
                  <div>
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <i className="ri-file-text-line text-gray-400 text-2xl"></i>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {fileName ? 'Resume Selected' : 'Drag and drop your resume here'}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {fileName 
                        ? `Selected: ${fileName}` 
                        : 'or click to browse files'
                      }
                    </p>
                    {!fileName && (
                      <button
                        onClick={handleBrowseClick}
                        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                      >
                        Browse Files
                      </button>
                    )}
                    {fileName && !isUploading && !analysis && (
                      <div className="flex justify-center gap-4 mt-4">
                        <button
                          onClick={handleDeleteResume}
                          className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors duration-200"
                        >
                          Delete Resume
                        </button>
                      </div>
                    )}
                    {selectedFile && !isUploading && (
                      <button
                        onClick={() => handleFile(selectedFile)}
                        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 mt-4"
                      >
                        Analyze Resume
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileSelect}
                className="hidden"
              />

              {/* Error Message */}
              {fileError && (
                <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  {fileError}
                </div>
              )}

              {/* File Requirements */}
              <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">File Requirements</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-center space-x-2">
                    <i className="ri-check-line text-green-600"></i>
                    <span>Supported formats: PDF, DOC, DOCX, TXT</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <i className="ri-check-line text-green-600"></i>
                    <span>Maximum file size: 5MB</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <i className="ri-check-line text-green-600"></i>
                    <span>Clear, readable text for best results</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          /* Analysis Results */
          <div className="space-y-8">
            {/* Success Message */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <i className="ri-check-line text-green-600"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-green-900">Resume Analysis Complete!</h3>
                  <p className="text-green-700">We've successfully analyzed your resume and extracted your skills.</p>
                </div>
              </div>
            </div>

            {/* Skills Analysis */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Skills Analysis</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    style={{ textTransform: 'capitalize' }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Profile Summary */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Summary</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Experience</h3>
                  <p className="text-gray-700">{analysis.experience}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Education</h3>
                  <p className="text-gray-700">{analysis.education}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Summary</h3>
                  <p className="text-gray-700">{analysis.summary}</p>
                </div>
              </div>
            </div>

            {/* Suggested Jobs */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Suggested Job Roles</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {analysis.suggestedJobs.map((job, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors duration-200">
                    <h3 className="font-semibold text-gray-900">{job.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{job.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleUploadAnotherResume}
                className="px-8 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:border-gray-400 transition-colors duration-200"
              >
                Upload Different Resume
              </button>
              <button
                onClick={handleContinue}
                className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Continue to Dashboard
              </button>
              <button
                onClick={handleDeleteResume}
                className="px-8 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Delete Resume
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
