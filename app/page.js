import Link from 'next/link'
import { ArrowRight, Star, Layout, Share2, Settings } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Testimonial Collection Platform
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Collect, manage, and showcase testimonials with ease. 
            Build trust with auto-generated widgets that seamlessly integrate with your website.
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              href="/auth/signup" 
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2 text-lg"
            >
              Get Started Free <ArrowRight size={24} />
            </Link>
            <Link 
              href="/demo" 
              className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition text-lg"
            >
              View Demo
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto mb-16">
          <FeatureCard 
            icon={<Share2 size={40} />}
            title="One-Click Forms"
            description="Share a simple link to collect testimonials with text, ratings, and media uploads"
          />
          <FeatureCard 
            icon={<Layout size={40} />}
            title="Beautiful Widgets"
            description="Auto-generate carousel, grid, or card layouts that match your brand"
          />
          <FeatureCard 
            icon={<Settings size={40} />}
            title="Easy Management"
            description="Approve, edit, and organize testimonials from your dashboard"
          />
          <FeatureCard 
            icon={<Star size={40} />}
            title="Simple Integration"
            description="Copy-paste a single script to embed testimonials anywhere on your site"
          />
        </div>

        {/* How It Works */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="space-y-8">
            <Step 
              number="1"
              title="Create Your Project"
              description="Sign up and create a new project. Customize your testimonial collection form with your branding."
            />
            <Step 
              number="2"
              title="Share Your Form Link"
              description="Get a unique shareable link. Send it to your customers via email, social media, or embed it on your site."
            />
            <Step 
              number="3"
              title="Manage Testimonials"
              description="Review, approve, edit, and organize incoming testimonials from your centralized dashboard."
            />
            <Step 
              number="4"
              title="Embed on Your Website"
              description="Generate beautiful widgets and copy-paste the embed code anywhere on your website."
            />
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">Ready to Build Trust?</h2>
          <p className="text-xl mb-8 opacity-90">
            Start collecting testimonials in minutes. No credit card required.
          </p>
          <Link 
            href="/auth/signup"
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition inline-flex items-center gap-2 text-lg"
          >
            Start Free Trial <ArrowRight size={24} />
          </Link>
        </div>
      </div>
    </main>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition">
      <div className="text-blue-600 dark:text-blue-400 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  )
}

function Step({ number, title, description }) {
  return (
    <div className="flex gap-6 items-start">
      <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
        {number}
      </div>
      <div>
        <h3 className="text-2xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 text-lg">{description}</p>
      </div>
    </div>
  )
}
