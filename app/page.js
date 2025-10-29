'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Star, MessageSquare, CheckCircle, Users, ChevronLeft, ChevronRight, Zap, Code, Sparkles } from 'lucide-react'

// Sample testimonials for different formats
const testimonialFormats = [
  {
    id: 1,
    name: 'Classic Card',
    testimonials: [
      {
        name: "Sarah Johnson",
        time: "2 days ago",
        text: "Amazing product! Highly recommend to anyone looking for quality.",
        rating: 5,
        featured: false
      }
    ]
  },
  {
    id: 2,
    name: 'Featured Highlight',
    testimonials: [
      {
        name: "Michael Chen",
        time: "1 week ago",
        text: "Best decision we made for our business. The ROI has been incredible!",
        rating: 5,
        featured: true
      }
    ]
  },
  {
    id: 3,
    name: 'Minimal Style',
    testimonials: [
      {
        name: "Emily Rodriguez",
        time: "3 days ago",
        text: "The customization options are fantastic! Matches our brand perfectly.",
        rating: 5,
        featured: false
      }
    ]
  },
  {
    id: 4,
    name: 'Grid Layout',
    testimonials: [
      {
        name: "David Thompson",
        time: "5 days ago",
        text: "Great platform with excellent features.",
        rating: 4,
        featured: false
      },
      {
        name: "Lisa Martinez",
        time: "1 week ago",
        text: "Love how professional our testimonials look now!",
        rating: 5,
        featured: false
      }
    ]
  }
]

export default function Home() {
  const [currentFormat, setCurrentFormat] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  const nextFormat = () => {
    setCurrentFormat((prev) => (prev + 1) % testimonialFormats.length)
  }

  const prevFormat = () => {
    setCurrentFormat((prev) => (prev - 1 + testimonialFormats.length) % testimonialFormats.length)
  }

  // Handle touch events for swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50
    
    if (isLeftSwipe) {
      nextFormat()
    }
    if (isRightSwipe) {
      prevFormat()
    }
    
    setTouchStart(0)
    setTouchEnd(0)
  }

  const currentTestimonials = testimonialFormats[currentFormat]
  return (
    <main className="min-h-screen bg-black dark:bg-black">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6 flex justify-between items-center border-b border-gray-800 dark:border-gray-800">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-lg font-medium text-white dark:text-white hover:text-gray-300 dark:hover:text-gray-300 transition">
            Overview
          </Link>
          <Link href="/dashboard" className="text-lg font-medium text-white dark:text-white hover:text-gray-300 dark:hover:text-gray-300 transition">
            Dashboard
          </Link>
        </div>
        
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Link href="/" className="text-xl font-semibold text-white dark:text-white hover:text-gray-300 transition">
            Testimonial Manager
          </Link>
        </div>

        <div className="flex items-center gap-6">
          <Link 
            href="/auth/signin" 
            className="text-lg font-medium text-white dark:text-white hover:text-gray-300 dark:hover:text-gray-300 transition"
          >
            Sign in
          </Link>
          <Link 
            href="/auth/signup" 
            className="bg-white dark:bg-white text-black dark:text-black px-6 py-2.5 rounded-full font-medium hover:bg-gray-200 transition-all shadow-lg"
          >
            Sign up
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-20 relative">
        {/* Hero Section */}
        <div className="text-center mb-16 max-w-5xl mx-auto relative z-10">
          <h1 className="text-6xl md:text-7xl font-normal mb-6 text-white dark:text-white leading-tight tracking-tight">
            Real recommendations<br />
            <span className="font-normal text-gray-400 dark:text-gray-400">by real people</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            Collect testimonials, showcase them beautifully—all in one place.<br />
            One simple, streamlined view of your credibility.
          </p>
          
          <div className="flex flex-col items-center gap-4 mb-6">
            <div className="flex items-center gap-4">
              <input 
                type="email" 
                placeholder="Enter email"
                className="px-6 py-3 rounded-full border-2 border-gray-700 dark:border-gray-700 bg-black dark:bg-black text-white dark:text-white placeholder:text-gray-500 focus:outline-none focus:border-white dark:focus:border-white transition w-64"
              />
              <Link 
                href="/auth/signup" 
                className="bg-white dark:bg-white text-black dark:text-black px-8 py-3 rounded-full font-medium hover:bg-gray-200 transition-all shadow-lg"
              >
                Get Started
              </Link>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-400">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-gray-700 dark:bg-gray-700 border-2 border-black dark:border-black"></div>
                <div className="w-8 h-8 rounded-full bg-gray-600 dark:bg-gray-600 border-2 border-black dark:border-black"></div>
                <div className="w-8 h-8 rounded-full bg-gray-500 dark:bg-gray-500 border-2 border-black dark:border-black"></div>
                <div className="w-8 h-8 rounded-full bg-white dark:bg-white border-2 border-black dark:border-black flex items-center justify-center text-black dark:text-black text-xs font-semibold">
                  +5
                </div>
              </div>
              <span>Join hundreds of businesses already using Testimonial.</span>
            </div>
          </div>
        </div>

        {/* Scattered testimonial images - positioned outside text area */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Top left - Star card */}
          <div className="absolute left-8 top-20 w-36 h-36 bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl transform -rotate-6 border border-gray-700 backdrop-blur-sm">
            <div className="w-full h-full flex items-center justify-center">
              <Star className="w-12 h-12 text-yellow-400" fill="currentColor" strokeWidth={0} />
            </div>
          </div>
          
          {/* Top center-left - Text card */}
          <div className="absolute left-32 top-12 w-32 h-32 bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl transform rotate-3 border border-gray-700 p-4 backdrop-blur-sm">
            <div className="w-full h-full flex flex-col items-center justify-center">
              <p className="text-sm font-medium text-white text-center leading-tight">"Best tool!"</p>
              <div className="flex gap-0.5 mt-2">
                <div className="w-1 h-1 rounded-full bg-gray-500"></div>
                <div className="w-1 h-1 rounded-full bg-gray-500"></div>
                <div className="w-1 h-1 rounded-full bg-gray-500"></div>
              </div>
            </div>
          </div>

          {/* Top center-right - Message icon */}
          <div className="absolute right-32 top-16 w-32 h-32 bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl transform -rotate-3 border border-gray-700 backdrop-blur-sm">
            <div className="w-full h-full flex items-center justify-center">
              <MessageSquare className="w-10 h-10 text-blue-400" strokeWidth={1.5} />
            </div>
          </div>

          {/* Top right - 5 stars */}
          <div className="absolute right-8 top-12 w-40 h-40 bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl transform rotate-6 border border-gray-700 backdrop-blur-sm">
            <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-4">
              <div className="flex gap-1">
                <Star className="w-6 h-6 text-yellow-400" fill="currentColor" strokeWidth={0} />
                <Star className="w-6 h-6 text-yellow-400" fill="currentColor" strokeWidth={0} />
                <Star className="w-6 h-6 text-yellow-400" fill="currentColor" strokeWidth={0} />
                <Star className="w-6 h-6 text-yellow-400" fill="currentColor" strokeWidth={0} />
                <Star className="w-6 h-6 text-yellow-400" fill="currentColor" strokeWidth={0} />
              </div>
              <p className="text-xs text-gray-400">5.0 rating</p>
            </div>
          </div>

          {/* Left middle - "Amazing!" */}
          <div className="absolute left-16 top-96 w-36 h-32 bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl transform rotate-2 border border-gray-700 p-4 backdrop-blur-sm">
            <div className="w-full h-full flex flex-col items-center justify-center">
              <p className="text-base font-semibold text-white mb-2">"Amazing!"</p>
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                <span className="text-xs text-white">JD</span>
              </div>
            </div>
          </div>

          {/* Right middle - Users icon */}
          <div className="absolute right-20 top-80 w-44 h-36 bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl transform -rotate-6 border border-gray-700 backdrop-blur-sm">
            <div className="w-full h-full flex items-center justify-center">
              <Users className="w-12 h-12 text-purple-400" strokeWidth={1.5} />
            </div>
          </div>

          {/* Bottom left - "Love it!" */}
          <div className="absolute left-24 bottom-96 w-32 h-32 bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl transform -rotate-3 border border-gray-700 p-4 backdrop-blur-sm">
            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
              <CheckCircle className="w-8 h-8 text-green-400" strokeWidth={2} />
              <p className="text-sm font-medium text-white text-center">"Love it!"</p>
            </div>
          </div>

          {/* Bottom right - "Highly recommend" */}
          <div className="absolute right-32 bottom-96 w-40 h-32 bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl transform rotate-3 border border-gray-700 p-4 backdrop-blur-sm">
            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
              </div>
              <p className="text-sm font-medium text-white text-center leading-tight">"Highly recommend"</p>
            </div>
          </div>
        </div>

        {/* Main Visual */}
        <div className="max-w-7xl mx-auto mb-32 relative z-10">
          {/* Format Indicator */}
          <div className="text-center mb-6">
            <p className="text-sm text-gray-400 dark:text-gray-400 mb-2">
              Swipe to see different formats
            </p>
            <div className="flex justify-center gap-2">
              {testimonialFormats.map((format, index) => (
                <button
                  key={format.id}
                  onClick={() => setCurrentFormat(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentFormat 
                      ? 'w-8 bg-white' 
                      : 'w-2 bg-gray-700'
                  }`}
                  aria-label={`View ${format.name}`}
                />
              ))}
            </div>
          </div>

          {/* Container with phone and features */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Phone mockup section */}
            <div className="relative order-2 lg:order-1">
              {/* Decorative floating elements - repositioned for side layout */}
              <div className="absolute -left-8 top-20 w-32 h-32 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl transform -rotate-6 border border-gray-700 hidden xl:flex items-center justify-center animate-float">
                <Star className="w-10 h-10 text-yellow-400" fill="currentColor" strokeWidth={0} />
              </div>
              
              <div className="absolute -left-4 bottom-32 w-28 h-28 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl transform -rotate-12 border border-gray-700 hidden xl:flex items-center justify-center animate-float-delayed">
                <CheckCircle className="w-8 h-8 text-green-400" strokeWidth={2} />
              </div>

              {/* Main phone mockup */}
              <div 
                className="relative mx-auto" 
                style={{ maxWidth: '340px' }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {/* Navigation Arrows */}
                <button
                  onClick={prevFormat}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 bg-gray-800 hover:bg-gray-700 p-3 rounded-full shadow-lg transition z-20 hidden md:block"
                  aria-label="Previous format"
                >
                  <ChevronLeft size={24} className="text-white" />
                </button>
                <button
                  onClick={nextFormat}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 bg-gray-800 hover:bg-gray-700 p-3 rounded-full shadow-lg transition z-20 hidden md:block"
                  aria-label="Next format"
                >
                  <ChevronRight size={24} className="text-white" />
                </button>

                <div className="bg-white dark:bg-black rounded-[3.5rem] shadow-2xl border-[12px] border-gray-900 dark:border-gray-200 overflow-hidden relative">
              {/* Phone notch */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10">
                <div className="w-36 h-7 bg-gray-900 dark:bg-gray-200 rounded-b-3xl flex items-center justify-center">
                  <div className="w-12 h-3 bg-gray-800 dark:bg-gray-300 rounded-full"></div>
                </div>
              </div>
              
              {/* Phone content */}
              <div className="bg-black dark:bg-white p-8 pt-12 h-[680px] overflow-hidden">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-white dark:text-black mb-3">Your Testimonials</h3>
                  <p className="text-base text-gray-400 dark:text-gray-600">
                    {currentTestimonials.name}
                  </p>
                </div>
                
                <div className="space-y-5">
                  {/* Dynamic Testimonial Rendering Based on Format */}
                  {currentFormat === 0 && (
                    <>
                      {/* Classic Card */}
                      <div className="bg-gray-900 dark:bg-gray-50 rounded-2xl p-5 border border-gray-800 dark:border-gray-200 shadow-lg">
                        <div className="flex gap-1.5 mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 text-white dark:text-black" fill="currentColor" strokeWidth={0} />
                          ))}
                        </div>
                        <p className="text-sm text-white dark:text-black leading-relaxed">
                          "{currentTestimonials.testimonials[0].text}"
                        </p>
                        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-800 dark:border-gray-200">
                          <div className="w-8 h-8 rounded-full bg-gray-700 dark:bg-gray-300"></div>
                          <div>
                            <p className="text-xs font-semibold text-white dark:text-black">
                              {currentTestimonials.testimonials[0].name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-600">
                              {currentTestimonials.testimonials[0].time}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-900 dark:bg-gray-50 rounded-2xl p-5 border border-gray-800 dark:border-gray-200 shadow-lg opacity-60">
                        <div className="flex gap-1.5 mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 text-white dark:text-black" fill="currentColor" strokeWidth={0} />
                          ))}
                        </div>
                        <p className="text-sm text-white dark:text-black leading-relaxed">Outstanding support team...</p>
                      </div>
                    </>
                  )}

                  {currentFormat === 1 && (
                    <>
                      {/* Featured Highlight */}
                      <div className="bg-white dark:bg-black rounded-2xl p-5 border-2 border-white dark:border-black shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gray-100 dark:bg-gray-900 rounded-full -mr-12 -mt-12 opacity-50"></div>
                        <div className="relative z-10">
                          <div className="flex items-center gap-2 mb-3">
                            <CheckCircle className="w-5 h-5 text-black dark:text-white" strokeWidth={2.5} />
                            <span className="text-xs font-bold text-black dark:text-white uppercase tracking-wider">Featured</span>
                          </div>
                          <p className="text-sm text-black dark:text-white leading-relaxed font-medium mb-4">
                            "{currentTestimonials.testimonials[0].text}"
                          </p>
                          <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                            <div className="w-8 h-8 rounded-full bg-black dark:bg-white"></div>
                            <div>
                              <p className="text-xs font-semibold text-black dark:text-white">
                                {currentTestimonials.testimonials[0].name}
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                {currentTestimonials.testimonials[0].time}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-900 dark:bg-gray-50 rounded-2xl p-5 border border-gray-800 dark:border-gray-200 shadow-lg opacity-40">
                        <div className="flex gap-1.5 mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 text-white dark:text-black" fill="currentColor" strokeWidth={0} />
                          ))}
                        </div>
                        <p className="text-sm text-white dark:text-black leading-relaxed">More testimonials...</p>
                      </div>
                    </>
                  )}

                  {currentFormat === 2 && (
                    <>
                      {/* Minimal Style */}
                      <div className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-50 dark:to-white rounded-2xl p-6 border border-gray-700 dark:border-gray-300 shadow-lg">
                        <p className="text-base text-white dark:text-black leading-relaxed mb-4 italic">
                          "{currentTestimonials.testimonials[0].text}"
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500"></div>
                            <div>
                              <p className="text-sm font-semibold text-white dark:text-black">
                                {currentTestimonials.testimonials[0].name}
                              </p>
                              <p className="text-xs text-gray-400 dark:text-gray-600">
                                {currentTestimonials.testimonials[0].time}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" strokeWidth={0} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-50 dark:to-white rounded-2xl p-6 border border-gray-700 dark:border-gray-300 shadow-lg opacity-50">
                        <p className="text-base text-white dark:text-black leading-relaxed italic">Simple and elegant...</p>
                      </div>
                    </>
                  )}

                  {currentFormat === 3 && (
                    <>
                      {/* Grid Layout */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-900 dark:bg-gray-50 rounded-xl p-4 border border-gray-800 dark:border-gray-200 shadow-lg">
                          <div className="flex gap-0.5 mb-2">
                            {[...Array(4)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 text-white dark:text-black" fill="currentColor" strokeWidth={0} />
                            ))}
                          </div>
                          <p className="text-xs text-white dark:text-black leading-relaxed mb-3">
                            "{currentTestimonials.testimonials[0].text}"
                          </p>
                          <p className="text-xs font-semibold text-white dark:text-black">
                            {currentTestimonials.testimonials[0].name}
                          </p>
                        </div>
                        <div className="bg-gray-900 dark:bg-gray-50 rounded-xl p-4 border border-gray-800 dark:border-gray-200 shadow-lg">
                          <div className="flex gap-0.5 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 text-white dark:text-black" fill="currentColor" strokeWidth={0} />
                            ))}
                          </div>
                          <p className="text-xs text-white dark:text-black leading-relaxed mb-3">
                            "{currentTestimonials.testimonials[1].text}"
                          </p>
                          <p className="text-xs font-semibold text-white dark:text-black">
                            {currentTestimonials.testimonials[1].name}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 opacity-40">
                        <div className="bg-gray-900 dark:bg-gray-50 rounded-xl p-4 border border-gray-800 dark:border-gray-200 shadow-lg">
                          <div className="flex gap-0.5 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 text-white dark:text-black" fill="currentColor" strokeWidth={0} />
                            ))}
                          </div>
                          <p className="text-xs text-white dark:text-black leading-relaxed">More reviews...</p>
                        </div>
                        <div className="bg-gray-900 dark:bg-gray-50 rounded-xl p-4 border border-gray-800 dark:border-gray-200 shadow-lg">
                          <div className="flex gap-0.5 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 text-white dark:text-black" fill="currentColor" strokeWidth={0} />
                            ))}
                          </div>
                          <p className="text-xs text-white dark:text-black leading-relaxed">And more...</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Phone home indicator */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1.5 bg-gray-900 dark:bg-gray-200 rounded-full"></div>
                </div>
              </div>
            </div>

          {/* Features section beside phone */}
          <div className="space-y-8 order-1 lg:order-2">
            <div className="text-center lg:text-left mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Everything You Need</h2>
              <p className="text-gray-400">Powerful features for collecting and showcasing testimonials</p>
            </div>
            
            <div className="space-y-6">
              <FeatureCard 
                icon={<MessageSquare size={28} />}
                title="Easy Collection"
                description="Share a simple link to collect testimonials from your customers"
              />
              <FeatureCard 
                icon={<Star size={28} />}
                title="Beautiful Display"
                description="Showcase testimonials with customizable widgets that match your brand"
              />
              <FeatureCard 
                icon={<Users size={28} />}
                title="Simple Management"
                description="Approve, organize, and feature testimonials from one dashboard"
              />
              <FeatureCard 
                icon={<Zap size={28} />}
                title="Instant Approval"
                description="Review and approve testimonials in seconds with one-click actions"
              />
              <FeatureCard 
                icon={<Code size={28} />}
                title="Easy Integration"
                description="Copy and paste a single line of code to embed testimonials anywhere"
              />
              <FeatureCard 
                icon={<Sparkles size={28} />}
                title="No Coding Required"
                description="Set up and manage everything without any technical knowledge"
              />
            </div>
          </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gray-900 dark:bg-gray-900 rounded-3xl p-16 text-center max-w-4xl mx-auto border-2 border-gray-800 dark:border-gray-800 shadow-xl mb-32">
          <h2 className="text-4xl md:text-5xl font-normal mb-6 text-white dark:text-white">
            Start Building Trust Today
          </h2>
          <p className="text-xl mb-10 text-gray-300 dark:text-gray-300 max-w-2xl mx-auto font-light">
            Join hundreds of businesses collecting testimonials effortlessly.<br />
            <span className="font-medium text-white dark:text-white">No credit card required.</span>
          </p>
          <Link 
            href="/auth/signup"
            className="bg-white dark:bg-white text-black dark:text-black px-10 py-4 rounded-full font-medium hover:bg-gray-200 transition-all inline-flex items-center gap-2 text-lg shadow-lg"
          >
            Get Started Free <ArrowRight size={20} />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t-2 border-gray-800 dark:border-gray-800 mt-32 bg-black dark:bg-black">
        <div className="container mx-auto px-6 py-12 flex justify-between items-center">
          <p className="text-sm text-gray-400 dark:text-gray-400">
            © 2025 Testimonial Platform
          </p>
          <div className="flex gap-8">
            <Link href="/dashboard" className="text-sm text-gray-400 dark:text-gray-400 hover:text-white dark:hover:text-white transition">
              Dashboard
            </Link>
            <Link href="/auth/signin" className="text-sm text-gray-400 dark:text-gray-400 hover:text-white dark:hover:text-white transition">
              Sign in
            </Link>
          </div>
        </div>
      </footer>
    </main>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="flex gap-4 items-start text-left">
      <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-gray-800 border border-gray-700 text-white">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-1 text-white">{title}</h3>
        <p className="text-gray-400 leading-relaxed text-sm">{description}</p>
      </div>
    </div>
  )
}
