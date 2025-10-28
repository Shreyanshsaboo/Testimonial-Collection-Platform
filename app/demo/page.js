'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Star, User, Building2, ChevronLeft, ChevronRight, Grid3x3, LayoutList } from 'lucide-react'
import { Button } from '@/components/ui'

// Sample testimonials data
const sampleTestimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    company: "TechCorp Inc.",
    position: "CEO",
    rating: 5,
    content: "This testimonial platform has revolutionized how we collect and display customer feedback. The widgets are beautiful and the dashboard is incredibly intuitive!",
    photo: null,
    featured: true
  },
  {
    id: 2,
    name: "Michael Chen",
    company: "StartupHub",
    position: "Marketing Director",
    rating: 5,
    content: "We've seen a 40% increase in conversion rates since adding testimonials to our landing page. The one-click sharing feature makes collection effortless.",
    photo: null,
    featured: true
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    company: "DesignStudio Pro",
    position: "Founder",
    rating: 5,
    content: "The customization options are fantastic! We were able to match our brand perfectly. Our clients love how easy it is to submit their reviews.",
    photo: null,
    featured: false
  },
  {
    id: 4,
    name: "David Thompson",
    company: "E-Commerce Plus",
    position: "Product Manager",
    rating: 4,
    content: "Great platform with excellent features. The approval workflow saves us time and the widgets load super fast on our website.",
    photo: null,
    featured: false
  },
  {
    id: 5,
    name: "Lisa Martinez",
    company: "Consulting Group",
    position: "Senior Consultant",
    rating: 5,
    content: "I love how professional our testimonials look now. The platform is user-friendly and our team adopted it immediately.",
    photo: null,
    featured: false
  },
  {
    id: 6,
    name: "James Wilson",
    company: "SaaS Solutions",
    position: "CTO",
    rating: 5,
    content: "As a technical person, I appreciate the clean API and simple embed code. Integration took less than 5 minutes!",
    photo: null,
    featured: false
  }
]

export default function DemoPage() {
  const [layout, setLayout] = useState('carousel')
  const [currentSlide, setCurrentSlide] = useState(0)

  const featuredTestimonials = sampleTestimonials.filter(t => t.featured)
  const testimonials = layout === 'featured' ? featuredTestimonials : sampleTestimonials

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition">
            <ArrowLeft size={20} />
            <span className="font-semibold">Back to Home</span>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        {/* Demo Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Interactive Demo
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Experience how testimonials look on your website. Try different layouts and see the magic!
          </p>
        </div>

        {/* Layout Selector */}
        <div className="max-w-5xl mx-auto mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Grid3x3 size={20} />
              Choose Widget Layout
            </h3>
            <div className="flex flex-wrap gap-3">
              <Button
                variant={layout === 'carousel' ? 'primary' : 'secondary'}
                onClick={() => {
                  setLayout('carousel')
                  setCurrentSlide(0)
                }}
                className="flex items-center gap-2"
              >
                Carousel
              </Button>
              <Button
                variant={layout === 'grid' ? 'primary' : 'secondary'}
                onClick={() => setLayout('grid')}
                className="flex items-center gap-2"
              >
                Grid View
              </Button>
              <Button
                variant={layout === 'cards' ? 'primary' : 'secondary'}
                onClick={() => setLayout('cards')}
                className="flex items-center gap-2"
              >
                Card Layout
              </Button>
              <Button
                variant={layout === 'list' ? 'primary' : 'secondary'}
                onClick={() => setLayout('list')}
                className="flex items-center gap-2"
              >
                <LayoutList size={18} />
                List View
              </Button>
              <Button
                variant={layout === 'featured' ? 'primary' : 'secondary'}
                onClick={() => setLayout('featured')}
                className="flex items-center gap-2"
              >
                ⭐ Featured Only
              </Button>
            </div>
          </div>
        </div>

        {/* Widget Preview */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Live Widget Preview</h2>
            
            {/* Carousel Layout */}
            {layout === 'carousel' && (
              <div className="relative">
                <div className="overflow-hidden rounded-lg">
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 p-8 min-h-[300px] flex items-center">
                    <TestimonialCard testimonial={testimonials[currentSlide]} featured />
                  </div>
                </div>
                <button
                  onClick={prevSlide}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white dark:bg-gray-700 p-3 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white dark:bg-gray-700 p-3 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                  aria-label="Next testimonial"
                >
                  <ChevronRight size={24} />
                </button>
                <div className="flex justify-center gap-2 mt-6">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`h-2 rounded-full transition-all ${
                        index === currentSlide 
                          ? 'w-8 bg-blue-600' 
                          : 'w-2 bg-gray-300 dark:bg-gray-600'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Grid Layout */}
            {layout === 'grid' && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.map((testimonial) => (
                  <TestimonialCard key={testimonial.id} testimonial={testimonial} compact />
                ))}
              </div>
            )}

            {/* Cards Layout */}
            {layout === 'cards' && (
              <div className="grid md:grid-cols-2 gap-6">
                {testimonials.map((testimonial) => (
                  <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                ))}
              </div>
            )}

            {/* List Layout */}
            {layout === 'list' && (
              <div className="space-y-4">
                {testimonials.map((testimonial) => (
                  <TestimonialListItem key={testimonial.id} testimonial={testimonial} />
                ))}
              </div>
            )}

            {/* Featured Layout */}
            {layout === 'featured' && (
              <div className="space-y-8">
                {featuredTestimonials.map((testimonial) => (
                  <TestimonialCard key={testimonial.id} testimonial={testimonial} featured />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Features Showcase */}
        <div className="max-w-5xl mx-auto mt-16">
          <h2 className="text-3xl font-bold text-center mb-10">What You Get</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <DemoFeature
              title="Easy Collection"
              description="Share a simple link to collect testimonials. No complicated forms or signups required for your customers."
              icon="📝"
            />
            <DemoFeature
              title="Beautiful Display"
              description="Multiple widget layouts that look professional and match your brand. Fully responsive and fast-loading."
              icon="✨"
            />
            <DemoFeature
              title="Full Control"
              description="Approve, edit, or reject testimonials. Feature your best reviews and manage everything from one dashboard."
              icon="🎯"
            />
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-4xl mx-auto mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
            <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 opacity-90">
              Create your free account and start collecting testimonials in minutes.
            </p>
            <Link href="/auth/signup">
              <Button variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4">
                Start Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// Testimonial Card Component
function TestimonialCard({ testimonial, compact = false, featured = false }) {
  return (
    <div className={`bg-white dark:bg-gray-700 rounded-lg p-6 shadow-md hover:shadow-lg transition ${
      featured ? 'border-2 border-blue-500' : ''
    }`}>
      {/* Rating */}
      <div className="flex items-center gap-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={18}
            className={i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
          />
        ))}
      </div>

      {/* Content */}
      <p className={`text-gray-700 dark:text-gray-300 mb-4 ${compact ? 'text-sm line-clamp-4' : 'text-base'}`}>
        "{testimonial.content}"
      </p>

      {/* Author Info */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-600">
        <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-full p-3">
          <User size={20} className="text-white" />
        </div>
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
            {testimonial.position} at {testimonial.company}
          </p>
        </div>
      </div>
    </div>
  )
}

// Testimonial List Item Component
function TestimonialListItem({ testimonial }) {
  return (
    <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition flex items-start gap-4">
      <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-full p-3 flex-shrink-0">
        <User size={24} className="text-white" />
      </div>
      <div className="flex-1">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {testimonial.position} at {testimonial.company}
            </p>
          </div>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
              />
            ))}
          </div>
        </div>
        <p className="text-gray-700 dark:text-gray-300 text-sm">
          "{testimonial.content}"
        </p>
      </div>
    </div>
  )
}

// Demo Feature Component
function DemoFeature({ title, description, icon }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md text-center">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  )
}
