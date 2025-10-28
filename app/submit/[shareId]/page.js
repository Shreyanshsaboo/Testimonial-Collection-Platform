'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Star, Loader2, CheckCircle, Upload } from 'lucide-react'
import { Button, Input, Label } from '@/components/ui'

export default function SubmitTestimonialPage({ params }) {
  const router = useRouter()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    position: '',
    testimonial: '',
  })

  useEffect(() => {
    fetchProject()
  }, [params.shareId])

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/submit/${params.shareId}`)
      const data = await response.json()
      
      if (data.success) {
        setProject(data.project)
      } else {
        setError('Project not found')
      }
    } catch (error) {
      console.error('Error fetching project:', error)
      setError('Failed to load form')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (rating === 0) {
      setError('Please select a rating')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const response = await fetch(`/api/submit/${params.shareId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          rating,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit testimonial')
      }

      setSubmitted(true)
    } catch (err) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
        <Loader2 className="animate-spin" size={40} />
      </div>
    )
  }

  if (error && !project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 dark:text-gray-300">{error}</p>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
            <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <CheckCircle size={40} className="text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Thank You!</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Your testimonial has been submitted successfully. 
              {project.formSettings?.requireApproval && 
                ' It will be reviewed and published soon.'}
            </p>
            {project.website && (
              <a
                href={project.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Back to {project.name} →
              </a>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Share Your Experience
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {project.name}
          </p>
          {project.description && (
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              {project.description}
            </p>
          )}
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <Label htmlFor="name">Your Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                maxLength={100}
              />
            </div>

            {/* Email */}
            {project.formSettings?.collectEmail && (
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  required
                />
              </div>
            )}

            {/* Company */}
            {project.formSettings?.collectCompany && (
              <div>
                <Label htmlFor="company">Company Name</Label>
                <Input
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Acme Inc."
                  maxLength={100}
                />
              </div>
            )}

            {/* Position */}
            {project.formSettings?.collectPosition && (
              <div>
                <Label htmlFor="position">Position/Title</Label>
                <Input
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  placeholder="CEO"
                  maxLength={100}
                />
              </div>
            )}

            {/* Rating */}
            <div>
              <Label>Your Rating *</Label>
              <div className="flex items-center gap-2 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      size={36}
                      className={`${
                        star <= (hoveredRating || rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  </button>
                ))}
                {rating > 0 && (
                  <span className="ml-2 text-gray-600 dark:text-gray-400">
                    {rating} star{rating !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>

            {/* Testimonial */}
            <div>
              <Label htmlFor="testimonial">Your Testimonial *</Label>
              <textarea
                id="testimonial"
                name="testimonial"
                value={formData.testimonial}
                onChange={handleChange}
                placeholder="Tell us about your experience..."
                rows={6}
                maxLength={1000}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.testimonial.length}/1000 characters
              </p>
            </div>

            {/* Photo Upload Placeholder */}
            {project.formSettings?.allowPhoto && (
              <div>
                <Label>Photo (Optional)</Label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 transition cursor-pointer">
                  <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Photo upload coming soon
                  </p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={submitting || rating === 0}
              className="w-full flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Submitting...
                </>
              ) : (
                'Submit Testimonial'
              )}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          Powered by Testimonial Platform
        </p>
      </div>
    </div>
  )
}
