'use client';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Link from 'next/link';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6">About CareerMatch</h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            We're revolutionizing the way people find their dream careers and connect with opportunities that truly matter.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                At CareerMatch, we believe everyone deserves to find meaningful work that aligns with their skills, 
                passions, and career goals. Our AI-powered platform bridges the gap between talented professionals 
                and innovative companies.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                We're committed to creating a more efficient, transparent, and human-centered job market where 
                connections are meaningful and opportunities are accessible to all.
              </p>
            </div>
            <div className="relative">
              <div className="w-full h-96 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <i className="ri-target-line text-6xl text-blue-600 mb-4"></i>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Smart Matching</h3>
                  <p className="text-gray-600">AI-powered career alignment</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do at CareerMatch
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ri-lightbulb-line text-blue-600 text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Innovation</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                We continuously push the boundaries of technology to create better career matching experiences 
                and more meaningful professional connections.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ri-heart-line text-green-600 text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Human-Centered</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Technology serves people, not the other way around. We prioritize human needs, emotions, 
                and aspirations in everything we build.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ri-shield-check-line text-purple-600 text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Trust & Transparency</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                We believe in building trust through transparency, honest communication, and ethical 
                use of technology and data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="w-full h-96 bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <i className="ri-time-line text-6xl text-green-600 mb-4"></i>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Our Journey</h3>
                  <p className="text-gray-600">From idea to impact</p>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                CareerMatch was born from a simple observation: the traditional job search process was 
                broken. Too many talented people were struggling to find opportunities that matched their 
                skills, while companies were missing out on perfect candidates.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Our founders, experienced in both technology and recruitment, saw an opportunity to 
                leverage AI to create a more intelligent, efficient, and human-centered approach to 
                career matching.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Today, we're proud to have helped thousands of professionals find their dream careers 
                and companies discover exceptional talent.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The passionate individuals behind CareerMatch's mission to transform career matching
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">S</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Sarah Johnson</h3>
              <p className="text-blue-600 font-medium mb-4">CEO & Co-Founder</p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Former tech executive with 15+ years experience in product development and team leadership. 
                Passionate about using technology to solve real human problems.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">M</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Michael Chen</h3>
              <p className="text-blue-600 font-medium mb-4">CTO & Co-Founder</p>
              <p className="text-gray-600 text-sm leading-relaxed">
                AI/ML expert with deep experience in natural language processing and recommendation systems. 
                Previously led engineering teams at major tech companies.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">E</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Emily Rodriguez</h3>
              <p className="text-blue-600 font-medium mb-4">Head of Product</p>
              <p className="text-gray-600 text-sm leading-relaxed">
                UX/UI specialist with a background in human-centered design. Focused on creating 
                intuitive, accessible, and delightful user experiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Impact</h2>
            <p className="text-xl opacity-90">
              Numbers that tell our story of growth and success
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">10K+</div>
              <p className="opacity-90">Professionals Matched</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">500+</div>
              <p className="opacity-90">Partner Companies</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">95%</div>
              <p className="opacity-90">Satisfaction Rate</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">50+</div>
              <p className="opacity-90">Team Members</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Join Us in Transforming Careers
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Whether you're looking for your next opportunity or seeking exceptional talent, 
            we're here to help you succeed.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/signup" className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200">
              Get Started
            </Link>
            <Link href="/contact" className="px-8 py-4 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors duration-200">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
} 