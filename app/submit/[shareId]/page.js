'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Star, Loader2, CheckCircle, Upload, Sparkles } from 'lucide-react'

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
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <Loader2 className="animate-spin text-white" size={40} />
      </div>
    )
  }

  if (error && !project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4">
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 rounded-2xl p-8 text-center max-w-md shadow-2xl">
          <h1 className="text-3xl font-black text-red-400 mb-4">Error</h1>
          <p className="text-slate-300">{error}</p>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4">
        <div className="max-w-md w-full">
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 rounded-2xl shadow-2xl p-8 text-center">
            <div className="bg-green-500/10 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center border border-green-500/20">
              <CheckCircle size={40} className="text-green-400" />
            </div>
            <h1 className="text-3xl font-black text-white mb-4 tracking-tight">Thank You!</h1>
            <p className="text-slate-300 mb-6 leading-relaxed">
              Your testimonial has been submitted successfully. 
              {project.formSettings?.requireApproval && 
                ' It will be reviewed and published soon.'}
            </p>
            {project.website && (
              <a
                href={project.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-all"
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
    <div className="min-h-screen bg-[#0a0a0a] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-black mb-3 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight">
            Share Your Experience
          </h1>
          <p className="text-2xl text-white font-bold mb-2">
            {project.name}
          </p>
          {project.description && (
            <p className="text-slate-400 text-base leading-relaxed">
              {project.description}
            </p>
          )}
        </div>

        {/* Form */}
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 rounded-2xl shadow-2xl p-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-white mb-2">
                Your Name *
              </label>
              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                maxLength={100}
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-white/30 focus:outline-none transition font-medium"
              />
            </div>

            {/* Email */}
            {project.formSettings?.collectEmail && (
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-white mb-2">
                  Email Address *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  required
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-white/30 focus:outline-none transition font-medium"
                />
              </div>
            )}

            {/* Company */}
            {project.formSettings?.collectCompany && (
              <div>
                <label htmlFor="company" className="block text-sm font-bold text-white mb-2">
                  Company Name
                </label>
                <input
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Acme Inc."
                  maxLength={100}
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-white/30 focus:outline-none transition font-medium"
                />
              </div>
            )}

            {/* Position */}
            {project.formSettings?.collectPosition && (
              <div>
                <label htmlFor="position" className="block text-sm font-bold text-white mb-2">
                  Position/Title
                </label>
                <input
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  placeholder="CEO"
                  maxLength={100}
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-white/30 focus:outline-none transition font-medium"
                />
              </div>
            )}

            {/* Rating */}
            <div>
              <label className="block text-sm font-bold text-white mb-3">
                Your Rating *
              </label>
              <div className="flex items-center gap-3 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-all hover:scale-110 focus:outline-none"
                  >
                    <Star
                      size={40}
                      className={`${
                        star <= (hoveredRating || rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-white/20'
                      } transition-colors`}
                    />
                  </button>
                ))}
                {rating > 0 && (
                  <span className="ml-2 text-slate-400 font-semibold">
                    {rating} star{rating !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>

            {/* Testimonial */}
            <div>
              <label htmlFor="testimonial" className="block text-sm font-bold text-white mb-2">
                Your Testimonial *
              </label>
              <textarea
                id="testimonial"
                name="testimonial"
                value={formData.testimonial}
                onChange={handleChange}
                placeholder="Tell us about your experience..."
                rows={6}
                maxLength={1000}
                required
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-white/30 focus:outline-none transition resize-none font-medium leading-relaxed"
              />
              <p className="text-sm text-slate-500 mt-2 font-semibold">
                {formData.testimonial.length}/1000 characters
              </p>
            </div>

            {/* Photo Upload Placeholder */}
            {project.formSettings?.allowPhoto && (
              <div>
                <label className="block text-sm font-bold text-white mb-2">
                  Photo (Optional)
                </label>
                <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-white/20 transition cursor-pointer bg-black/20">
                  <Upload size={32} className="mx-auto text-slate-400 mb-2" />
                  <p className="text-sm text-slate-400 font-semibold">
                    Photo upload coming soon
                  </p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting || rating === 0}
              className="w-full px-6 py-4 bg-white text-black font-black text-lg rounded-xl hover:bg-slate-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-white/20"
            >
              {submitting ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Submitting...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Submit Testimonial
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-slate-500 mt-8 font-semibold">
          Powered by Testimonial Platform
        </p>
      </div>
    </div>
  )
}
