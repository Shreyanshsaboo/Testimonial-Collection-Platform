'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { ArrowLeft, Loader2, Code, Copy, CheckCircle, ExternalLink, Star, User, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button, Card } from '@/components/ui'

export default function WidgetEmbedPage({ params }) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [project, setProject] = useState(null)
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    if (status === 'authenticated') {
      fetchProject()
      fetchTestimonials()
    }
  }, [status, params.id])

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${params.id}`)
      const data = await response.json()
      
      if (data.success) {
        setProject(data.project)
      }
    } catch (error) {
      console.error('Error fetching project:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTestimonials = async () => {
    try {
      const response = await fetch(`/api/projects/${params.id}/testimonials?status=approved`)
      const data = await response.json()
      
      if (data.success) {
        setTestimonials(data.testimonials)
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error)
    }
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.max(testimonials.length, 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.max(testimonials.length, 1)) % Math.max(testimonials.length, 1))
  }

  const embedCode = project ? `<!-- Testimonial Widget -->
<div id="testimonial-widget-${project._id}"></div>
<script>
  (function() {
    var script = document.createElement('script');
    script.src = '${typeof window !== 'undefined' ? window.location.origin : 'https://yoursite.com'}/widget.js';
    script.async = true;
    script.onload = function() {
      TestimonialWidget.init({
        projectId: '${project._id}',
        layout: '${project.widgetSettings?.layout || 'carousel'}',
        theme: {
          primaryColor: '${project.widgetSettings?.theme?.primaryColor || '#2563eb'}',
          backgroundColor: '${project.widgetSettings?.theme?.backgroundColor || '#ffffff'}',
          textColor: '${project.widgetSettings?.theme?.textColor || '#1f2937'}',
          fontFamily: '${project.widgetSettings?.theme?.fontFamily || 'Inter'}'
        },
        showRatings: ${project.widgetSettings?.showRatings ?? true},
        showPhotos: ${project.widgetSettings?.showPhotos ?? true},
        showCompany: ${project.widgetSettings?.showCompany ?? true},
        maxTestimonials: ${project.widgetSettings?.maxTestimonials || 10}
      });
    };
    document.head.appendChild(script);
  })();
</script>` : ''

  const copyCode = () => {
    navigator.clipboard.writeText(embedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" size={40} />
      </div>
    )
  }

  if (!session) {
    router.push('/auth/signin')
    return null
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Project not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow">
        <div className="container mx-auto px-4 py-4">
          <Link 
            href={`/dashboard/projects/${params.id}`} 
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition"
          >
            <ArrowLeft size={20} />
            <span className="font-semibold">Back to Project</span>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Widget Embed Code</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Copy and paste this code into your website to display testimonials
          </p>
        </div>

        {/* Installation Steps */}
        <Card className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Installation Guide</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-1">Copy the embed code below</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Click the "Copy Code" button to copy the entire widget script
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-1">Paste into your HTML</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Add the code where you want the testimonials to appear on your website
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-1">Customize your widget</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Go to <Link href={`/dashboard/projects/${params.id}/settings`} className="text-blue-600 hover:underline">widget settings</Link> to change colors, layout, and display options
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Embed Code */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Embed Code</h2>
            <Button
              onClick={copyCode}
              variant={copied ? 'primary' : 'secondary'}
              className="flex items-center gap-2"
            >
              {copied ? (
                <>
                  <CheckCircle size={18} />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={18} />
                  Copy Code
                </>
              )}
            </Button>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 overflow-x-auto">
            <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap break-all">
              {embedCode}
            </pre>
          </div>

          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-900 dark:text-blue-200">
              <strong>Note:</strong> The widget will automatically load approved testimonials from your project. 
              Make sure you have at least one approved testimonial before embedding the widget.
            </p>
          </div>
        </Card>

        {/* Widget Preview */}
        <Card className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Preview Widget</h2>
            <Link href={`/dashboard/projects/${params.id}/settings?tab=widget`}>
              <Button variant="secondary" className="flex items-center gap-2">
                <Code size={18} />
                Customize
              </Button>
            </Link>
          </div>
          
          {testimonials.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <Star size={64} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                No approved testimonials yet
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Approve some testimonials to see the widget preview
              </p>
            </div>
          ) : (
            <>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Live preview of how your widget will appear on your website
              </p>
              
              <div 
                className="rounded-lg p-8 mb-4"
                style={{ 
                  backgroundColor: project.widgetSettings?.theme?.backgroundColor || '#ffffff',
                  color: project.widgetSettings?.theme?.textColor || '#1f2937'
                }}
              >
                {/* Carousel Layout */}
                {project.widgetSettings?.layout === 'carousel' && (
                  <div className="relative">
                    <div className="min-h-[300px] flex items-center">
                      <WidgetTestimonialCard 
                        testimonial={testimonials[currentSlide]} 
                        settings={project.widgetSettings}
                      />
                    </div>
                    {testimonials.length > 1 && (
                      <>
                        <button
                          onClick={prevSlide}
                          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white dark:bg-gray-700 p-3 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                          style={{ color: project.widgetSettings?.theme?.textColor || '#1f2937' }}
                        >
                          <ChevronLeft size={24} />
                        </button>
                        <button
                          onClick={nextSlide}
                          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white dark:bg-gray-700 p-3 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                          style={{ color: project.widgetSettings?.theme?.textColor || '#1f2937' }}
                        >
                          <ChevronRight size={24} />
                        </button>
                        <div className="flex justify-center gap-2 mt-6">
                          {testimonials.slice(0, project.widgetSettings?.maxTestimonials || 10).map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentSlide(index)}
                              className={`h-2 rounded-full transition-all`}
                              style={{
                                width: index === currentSlide ? '32px' : '8px',
                                backgroundColor: index === currentSlide 
                                  ? project.widgetSettings?.theme?.primaryColor || '#2563eb'
                                  : '#cbd5e1'
                              }}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Grid Layout */}
                {project.widgetSettings?.layout === 'grid' && (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.slice(0, project.widgetSettings?.maxTestimonials || 10).map((testimonial) => (
                      <WidgetTestimonialCard 
                        key={testimonial._id}
                        testimonial={testimonial} 
                        settings={project.widgetSettings}
                        compact
                      />
                    ))}
                  </div>
                )}

                {/* Card Layout */}
                {project.widgetSettings?.layout === 'cards' && (
                  <div className="grid md:grid-cols-2 gap-6">
                    {testimonials.slice(0, project.widgetSettings?.maxTestimonials || 10).map((testimonial) => (
                      <WidgetTestimonialCard 
                        key={testimonial._id}
                        testimonial={testimonial} 
                        settings={project.widgetSettings}
                      />
                    ))}
                  </div>
                )}

                {/* List Layout */}
                {project.widgetSettings?.layout === 'list' && (
                  <div className="space-y-4">
                    {testimonials.slice(0, project.widgetSettings?.maxTestimonials || 10).map((testimonial) => (
                      <WidgetTestimonialListItem 
                        key={testimonial._id}
                        testimonial={testimonial} 
                        settings={project.widgetSettings}
                      />
                    ))}
                  </div>
                )}
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Showing {Math.min(testimonials.length, project.widgetSettings?.maxTestimonials || 10)} of {testimonials.length} approved testimonials
              </p>
            </>
          )}
        </Card>

        {/* Widget Settings Summary */}
        <Card className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">Current Widget Settings</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Layout</p>
              <p className="font-semibold capitalize">{project.widgetSettings?.layout || 'carousel'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Max Testimonials</p>
              <p className="font-semibold">{project.widgetSettings?.maxTestimonials || 10}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Show Ratings</p>
              <p className="font-semibold">{project.widgetSettings?.showRatings ? 'Yes' : 'No'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Show Company</p>
              <p className="font-semibold">{project.widgetSettings?.showCompany ? 'Yes' : 'No'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Primary Color</p>
              <div className="flex items-center gap-2">
                <div 
                  className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600"
                  style={{ backgroundColor: project.widgetSettings?.theme?.primaryColor || '#2563eb' }}
                />
                <p className="font-semibold">{project.widgetSettings?.theme?.primaryColor || '#2563eb'}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Font Family</p>
              <p className="font-semibold">{project.widgetSettings?.theme?.fontFamily || 'Inter'}</p>
            </div>
          </div>
        </Card>

        {/* Platform Support */}
        <Card className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">Platform Support</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            This widget works on all major platforms:
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="font-semibold mb-2">WordPress</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Add to any page using the HTML block or custom HTML widget
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="font-semibold mb-2">Shopify</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Insert in theme customizer or product page template
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="font-semibold mb-2">Custom HTML</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Works with any website that accepts custom HTML/JavaScript
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

// Widget Testimonial Card Component
function WidgetTestimonialCard({ testimonial, settings, compact = false }) {
  return (
    <div 
      className="rounded-lg p-6 shadow-md"
      style={{ 
        backgroundColor: '#ffffff',
        fontFamily: settings?.theme?.fontFamily || 'Inter'
      }}
    >
      {/* Rating */}
      {settings?.showRatings && (
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={18}
              style={{
                fill: i < testimonial.rating ? '#fbbf24' : 'transparent',
                color: i < testimonial.rating ? '#fbbf24' : '#d1d5db'
              }}
            />
          ))}
        </div>
      )}

      {/* Content */}
      <p 
        className={`mb-4 ${compact ? 'text-sm line-clamp-4' : 'text-base'}`}
        style={{ color: settings?.theme?.textColor || '#1f2937' }}
      >
        "{testimonial.testimonial}"
      </p>

      {/* Author Info */}
      <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: '#e5e7eb' }}>
        <div 
          className="rounded-full p-3"
          style={{ 
            background: `linear-gradient(to bottom right, ${settings?.theme?.primaryColor || '#2563eb'}, #9333ea)`
          }}
        >
          <User size={20} className="text-white" />
        </div>
        <div>
          <p className="font-semibold" style={{ color: settings?.theme?.textColor || '#1f2937' }}>
            {testimonial.name}
          </p>
          {settings?.showCompany && (testimonial.position || testimonial.company) && (
            <p className="text-sm" style={{ color: '#6b7280' }}>
              {testimonial.position && <span>{testimonial.position}</span>}
              {testimonial.position && testimonial.company && <span> at </span>}
              {testimonial.company && <span>{testimonial.company}</span>}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

// Widget Testimonial List Item Component
function WidgetTestimonialListItem({ testimonial, settings }) {
  return (
    <div 
      className="rounded-lg p-6 shadow-sm flex items-start gap-4"
      style={{ 
        backgroundColor: '#ffffff',
        fontFamily: settings?.theme?.fontFamily || 'Inter'
      }}
    >
      <div 
        className="rounded-full p-3 flex-shrink-0"
        style={{ 
          background: `linear-gradient(to bottom right, ${settings?.theme?.primaryColor || '#2563eb'}, #9333ea)`
        }}
      >
        <User size={24} className="text-white" />
      </div>
      <div className="flex-1">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="font-semibold" style={{ color: settings?.theme?.textColor || '#1f2937' }}>
              {testimonial.name}
            </p>
            {settings?.showCompany && (testimonial.position || testimonial.company) && (
              <p className="text-sm" style={{ color: '#6b7280' }}>
                {testimonial.position && <span>{testimonial.position}</span>}
                {testimonial.position && testimonial.company && <span> at </span>}
                {testimonial.company && <span>{testimonial.company}</span>}
              </p>
            )}
          </div>
          {settings?.showRatings && (
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  style={{
                    fill: i < testimonial.rating ? '#fbbf24' : 'transparent',
                    color: i < testimonial.rating ? '#fbbf24' : '#d1d5db'
                  }}
                />
              ))}
            </div>
          )}
        </div>
        <p className="text-sm" style={{ color: settings?.theme?.textColor || '#1f2937' }}>
          "{testimonial.testimonial}"
        </p>
      </div>
    </div>
  )
}
