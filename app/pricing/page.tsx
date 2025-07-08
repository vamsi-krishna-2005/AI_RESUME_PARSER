'use client';

import { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Link from 'next/link';

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [userType, setUserType] = useState<'jobseeker' | 'employer'>('jobseeker');

  const jobSeekerPlans = [
    {
      name: 'Free',
      price: { monthly: 0, yearly: 0 },
      description: 'Perfect for getting started with your job search',
      features: [
        'Basic job matching',
        'Resume upload and parsing',
        'Limited job applications (5/month)',
        'Basic networking features',
        'Email job alerts',
        'Mobile app access'
      ],
      popular: false,
      cta: 'Get Started Free',
      href: '/signup'
    },
    {
      name: 'Professional',
      price: { monthly: 19, yearly: 190 },
      description: 'Advanced features for serious job seekers',
      features: [
        'Everything in Free',
        'Unlimited job applications',
        'Advanced AI matching',
        'Priority job recommendations',
        'Resume optimization tools',
        'Interview preparation resources',
        'Salary insights',
        'Direct messaging with recruiters',
        'Premium support'
      ],
      popular: true,
      cta: 'Start Professional Plan',
      href: '/signup'
    },
    {
      name: 'Executive',
      price: { monthly: 49, yearly: 490 },
      description: 'Premium features for senior professionals',
      features: [
        'Everything in Professional',
        'Executive job matching',
        'Personal career coach',
        'Custom resume templates',
        'LinkedIn profile optimization',
        'Salary negotiation guidance',
        'Industry insights reports',
        'Priority application status',
        'Dedicated account manager'
      ],
      popular: false,
      cta: 'Start Executive Plan',
      href: '/signup'
    }
  ];

  const employerPlans = [
    {
      name: 'Starter',
      price: { monthly: 99, yearly: 990 },
      description: 'Perfect for small businesses and startups',
      features: [
        'Post up to 5 jobs',
        'Basic candidate matching',
        'Resume database access',
        'Email notifications',
        'Basic analytics',
        'Standard support'
      ],
      popular: false,
      cta: 'Start Free Trial',
      href: '/signup'
    },
    {
      name: 'Professional',
      price: { monthly: 299, yearly: 2990 },
      description: 'Ideal for growing companies',
      features: [
        'Everything in Starter',
        'Post up to 25 jobs',
        'Advanced AI candidate matching',
        'Priority candidate access',
        'Advanced analytics dashboard',
        'Custom branding',
        'Interview scheduling tools',
        'Priority support',
        'API access'
      ],
      popular: true,
      cta: 'Start Free Trial',
      href: '/signup'
    },
    {
      name: 'Enterprise',
      price: { monthly: 999, yearly: 9990 },
      description: 'For large organizations and enterprises',
      features: [
        'Everything in Professional',
        'Unlimited job postings',
        'Custom AI training',
        'Advanced reporting',
        'White-label solutions',
        'Dedicated account manager',
        'Custom integrations',
        '24/7 priority support',
        'On-site training'
      ],
      popular: false,
      cta: 'Contact Sales',
      href: '/contact'
    }
  ];

  const currentPlans = userType === 'jobseeker' ? jobSeekerPlans : employerPlans;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6">Simple, Transparent Pricing</h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Choose the perfect plan for your career goals or hiring needs. Start free and upgrade when you're ready.
          </p>
        </div>
      </section>

      {/* User Type Toggle */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-center mb-8">
            <div className="bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setUserType('jobseeker')}
                className={`px-6 py-3 rounded-md font-medium transition-colors duration-200 ${
                  userType === 'jobseeker'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Job Seekers
              </button>
              <button
                onClick={() => setUserType('employer')}
                className={`px-6 py-3 rounded-md font-medium transition-colors duration-200 ${
                  userType === 'employer'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Employers
              </button>
            </div>
          </div>

          {/* Billing Toggle */}
          <div className="flex justify-center items-center space-x-4 mb-8">
            <span className={`text-sm ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors duration-200"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm ${billingCycle === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Yearly
              <span className="ml-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                Save 20%
              </span>
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {currentPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-xl shadow-sm p-8 ${
                  plan.popular ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">
                      ${billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly}
                    </span>
                    {plan.price.monthly > 0 && (
                      <span className="text-gray-500">
                        /{billingCycle === 'monthly' ? 'month' : 'year'}
                      </span>
                    )}
                  </div>

                  {plan.price.monthly === 0 ? (
                    <span className="text-green-600 font-medium">Free Forever</span>
                  ) : (
                    <div className="text-sm text-gray-500">
                      {billingCycle === 'yearly' && (
                        <span className="text-green-600 font-medium">Save ${(plan.price.monthly * 12) - plan.price.yearly}/year</span>
                      )}
                    </div>
                  )}
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-3">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <i className="ri-check-line text-green-600 text-sm"></i>
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={`block w-full text-center px-6 py-3 rounded-lg font-semibold transition-colors duration-200 ${
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about our pricing and plans
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Can I change my plan anytime?</h3>
              <p className="text-gray-600">
                Yes! You can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Is there a free trial?</h3>
              <p className="text-gray-600">
                Yes, all paid plans come with a 14-day free trial. No credit card required to start.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">What payment methods do you accept?</h3>
              <p className="text-gray-600">
                We accept all major credit cards, PayPal, and bank transfers for enterprise plans.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Can I cancel anytime?</h3>
              <p className="text-gray-600">
                Absolutely. You can cancel your subscription at any time with no cancellation fees.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Do you offer refunds?</h3>
              <p className="text-gray-600">
                We offer a 30-day money-back guarantee for all paid plans if you're not satisfied.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Is my data secure?</h3>
              <p className="text-gray-600">
                Yes, we use industry-standard encryption and security measures to protect your data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of professionals and companies who trust CareerMatch
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/signup" className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200">
              Start Free Trial
            </Link>
            <Link href="/contact" className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors duration-200">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
} 