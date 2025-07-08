'use client';

import Header from '../../components/Header';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import authService from '../../components/authService';
import axios from 'axios';
import { BrowserProvider, parseEther } from 'ethers';

export default function PostJob() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [walletBalance, setWalletBalance] = useState(250);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [jobData, setJobData] = useState({
    title: '',
    company: '',
    location: '',
    type: '',
    salary: '',
    description: '',
    requirements: ''
  });

  const jobPostingCost = 99;

  const adminAddress = '0x7E6A095CaE95aE0110c667AEE1F9aC269C81D724'; // Updated admin wallet

  useEffect(() => {
    if (typeof window !== 'undefined' && !authService.isAuthenticated()) {
      router.replace('/?auth=login&redirect=/post-job');
    }
  }, [router]);

  const handleInputChange = (field: string, value: string) => {
    setJobData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Inline sendPlatformFee utility (ethers v5 style)
  async function sendPlatformFee(adminAddress: string, amountEth = '0.001') {
    if (typeof window === 'undefined' || !window.ethereum || !window.ethereum.isMetaMask) {
      alert('MetaMask not detected');
      return null;
    }
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    try {
      const tx = await signer.sendTransaction({
        to: adminAddress,
        value: parseEther(amountEth),
      });
      await tx.wait();
      return { txnHash: tx.hash, sender: address };
    } catch (err) {
      console.error('Payment failed', err);
      return null;
    }
  }

  const handleSubmit = async () => {
    // 1. Send platform fee and get txnHash
    const payment = await sendPlatformFee(adminAddress, '0.001');
    if (!payment) {
      alert('Transaction failed. Please try again.');
      return;
    }
    const { txnHash, sender } = payment;

    // 2. Use sender as userId for now
    const userId = sender;

    // 3. Log the payment
    await axios.post('http://localhost:5000/api/log-payment/log-payment', {
      userId,
      txnHash,
    });

    // 4. Create the job post
    const token = authService.getAccessToken();
    const response = await axios.post('http://localhost:5000/api/jobs', {
      ...jobData,
      txnHash,
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const createdJob = {
      ...response.data,
      skills: response.data.skills || [], // fallback to empty array
    };
    const jobs = JSON.parse(localStorage.getItem('careermatch_jobs') || '[]');
    jobs.unshift(createdJob);
    localStorage.setItem('careermatch_jobs', JSON.stringify(jobs));

    // Redirect to jobs page
    router.push('/jobs');
  };

  const handlePayment = (method: string) => {
    if (method === 'wallet') {
      if (walletBalance >= jobPostingCost) {
        setWalletBalance(prev => prev - jobPostingCost);
        setShowPaymentModal(false);
        handleSubmit();
      } else {
        alert('Insufficient wallet balance. Please add funds or use another payment method.');
      }
    } else {
      // Simulate external payment
      setShowPaymentModal(false);
      alert('Redirecting to payment gateway...');
    }
  };

  const steps = [
    { id: 1, name: 'Job Details', icon: 'ri-file-text-line' },
    { id: 2, name: 'Requirements', icon: 'ri-list-check' },
    { id: 3, name: 'Payment', icon: 'ri-wallet-line' }
  ];

  async function connectWallet() {
    if (typeof window !== 'undefined' && window.ethereum && window.ethereum.isMetaMask) {
      const provider = new BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []); // Prompts MetaMask connect
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      // Save userAddress in state if needed
      return userAddress;
    } else {
      alert('MetaMask not detected');
      return null;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Post a Job Opening
          </h1>
          <p className="text-xl text-gray-600">
            Find the perfect candidates with AI-powered skill matching
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep >= step.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  <i className={`${step.icon} text-sm`}></i>
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {step.name}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 ml-4 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Job Details</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    value={jobData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g. Senior Frontend Developer"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      value={jobData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      placeholder="Your company name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={jobData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="e.g. San Francisco, CA or Remote"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Employment Type
                    </label>
                    <select
                      value={jobData.type}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8"
                    >
                      <option value="">Select type</option>
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="contract">Contract</option>
                      <option value="internship">Internship</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Salary Range
                    </label>
                    <input
                      type="text"
                      value={jobData.salary}
                      onChange={(e) => handleInputChange('salary', e.target.value)}
                      placeholder="e.g. $80k - $120k"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Description *
                  </label>
                  <textarea
                    value={jobData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe the role, responsibilities, and what makes this position exciting..."
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setCurrentStep(2)}
                    disabled={!jobData.title || !jobData.company || !jobData.description}
                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    Next: Requirements
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Job Requirements</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Requirements *
                  </label>
                  <textarea
                    value={jobData.requirements}
                    onChange={(e) => handleInputChange('requirements', e.target.value)}
                    placeholder="List the key requirements, skills, and qualifications needed for this position..."
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-200"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setCurrentStep(3)}
                    disabled={!jobData.requirements}
                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    Next: Payment
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment</h2>
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Posting Summary</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Job Title:</span>
                      <span className="font-medium">{jobData.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Company:</span>
                      <span className="font-medium">{jobData.company}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Location:</span>
                      <span className="font-medium">{jobData.location || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Type:</span>
                      <span className="font-medium">{jobData.type || 'Not specified'}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">Pricing</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Job posting fee:</span>
                      <span>${jobPostingCost}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>AI matching:</span>
                      <span>Free</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-semibold">
                      <span>Total:</span>
                      <span>${jobPostingCost}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-200"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-all duration-200"
                  >
                    Proceed to Payment
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Choose Payment Method</h3>
            <div className="space-y-4">
              <button
                onClick={() => handlePayment('wallet')}
                className="w-full p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Wallet Balance</div>
                    <div className="text-sm text-gray-600">${walletBalance} available</div>
                  </div>
                  <i className="ri-wallet-line text-xl text-green-600"></i>
                </div>
              </button>
              <button
                onClick={() => handlePayment('card')}
                className="w-full p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Credit/Debit Card</div>
                    <div className="text-sm text-gray-600">Secure payment</div>
                  </div>
                  <i className="ri-bank-card-line text-xl text-blue-600"></i>
                </div>
              </button>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="w-full p-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

