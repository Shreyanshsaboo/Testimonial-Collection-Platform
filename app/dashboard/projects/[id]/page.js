'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { 
  ArrowLeft, Loader2, Copy, ExternalLink, Star, 
  CheckCircle, XCircle, Trash2, Settings as SettingsIcon,
  Filter, User, Building2
} from 'lucide-react'
import { Button, Card } from '@/components/ui'

export default function ProjectDetailPage({ params }) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [project, setProject] = useState(null)
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [copied, setCopied] = useState(false)

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
    }
  }

  const fetchTestimonials = async () => {
    try {
      const response = await fetch(`/api/projects/${params.id}/testimonials?status=${filter}`)
      const data = await response.json()
      
      if (data.success) {
        setTestimonials(data.testimonials)
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyShareLink = () => {
    const link = `${window.location.origin}/submit/${project.shareId}`
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleStatusChange = async (testimonialId, newStatus) => {
    try {
      const response = await fetch(`/api/projects/${params.id}/testimonials`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testimonialId, status: newStatus }),
      })

      if (response.ok) {
        fetchTestimonials()
        fetchProject()
      }
    } catch (error) {
      console.error('Error updating testimonial:', error)
    }
  }

  const handleToggleFeatured = async (testimonialId, currentFeatured) => {
    try {
      const response = await fetch(`/api/projects/${params.id}/testimonials`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testimonialId, featured: !currentFeatured }),
      })

      if (response.ok) {
        fetchTestimonials()
      }
    } catch (error) {
      console.error('Error toggling featured:', error)
    }
  }

  const handleDelete = async (testimonialId) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return

    try {
      const response = await fetch(`/api/projects/${params.id}/testimonials?testimonialId=${testimonialId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchTestimonials()
        fetchProject()
      }
    } catch (error) {
      console.error('Error deleting testimonial:', error)
    }
  }

  useEffect(() => {
    if (status === 'authenticated' && !loading) {
      fetchTestimonials()
    }
  }, [filter])

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

  const filteredTestimonials = filter === 'all' 
    ? testimonials 
    : testimonials.filter(t => t.status === filter)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow">
        <div className="container mx-auto px-4 py-4">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition">
            <ArrowLeft size={20} />
            <span className="font-semibold">Back to Dashboard</span>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Project Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">{project.name}</h1>
              {project.description && (
                <p className="text-gray-600 dark:text-gray-300">{project.description}</p>
              )}
            </div>
            <Link href={`/dashboard/projects/${project._id}/settings`}>
              <Button variant="secondary" className="flex items-center gap-2">
                <SettingsIcon size={18} />
                Settings
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-3xl font-bold text-blue-600">{project.stats?.totalSubmissions || 0}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-3xl font-bold text-green-600">{project.stats?.approvedCount || 0}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Approved</p>
            </div>
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <p className="text-3xl font-bold text-orange-600">
                {(project.stats?.totalSubmissions || 0) - (project.stats?.approvedCount || 0) - (project.stats?.rejectedCount || 0)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
            </div>
          </div>

          {/* Share Link */}
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={copyShareLink}
              variant="primary"
              className="flex items-center gap-2"
            >
              <Copy size={18} />
              {copied ? 'Copied!' : 'Copy Share Link'}
            </Button>
            <a
              href={`/submit/${project.shareId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="secondary" className="flex items-center gap-2">
                <ExternalLink size={18} />
                View Form
              </Button>
            </a>
            <Link href={`/dashboard/projects/${project._id}/embed`}>
              <Button variant="secondary" className="flex items-center gap-2">
                <Copy size={18} />
                Get Embed Code
              </Button>
            </Link>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={20} className="text-gray-600 dark:text-gray-400" />
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              All ({testimonials.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'pending' 
                  ? 'bg-orange-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Pending ({testimonials.filter(t => t.status === 'pending').length})
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'approved' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Approved ({testimonials.filter(t => t.status === 'approved').length})
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'rejected' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Rejected ({testimonials.filter(t => t.status === 'rejected').length})
            </button>
          </div>
        </div>

        {/* Testimonials List */}
        <div className="space-y-4">
          {filteredTestimonials.length === 0 ? (
            <Card className="p-12 text-center">
              <Star size={64} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-300">
                {filter === 'all' 
                  ? 'No testimonials yet. Share your form link to start collecting!' 
                  : `No ${filter} testimonials.`}
              </p>
            </Card>
          ) : (
            filteredTestimonials.map((testimonial) => (
              <TestimonialCard
                key={testimonial._id}
                testimonial={testimonial}
                onStatusChange={handleStatusChange}
                onToggleFeatured={handleToggleFeatured}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function TestimonialCard({ testimonial, onStatusChange, onToggleFeatured, onDelete }) {
  const statusColors = {
    pending: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    approved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-full p-3">
            <User size={24} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">{testimonial.name}</h3>
              {testimonial.featured && (
                <span className="text-yellow-500">⭐</span>
              )}
            </div>
            {testimonial.email && (
              <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.email}</p>
            )}
            {(testimonial.company || testimonial.position) && (
              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                {testimonial.position && <span>{testimonial.position}</span>}
                {testimonial.position && testimonial.company && <span>at</span>}
                {testimonial.company && <span>{testimonial.company}</span>}
              </p>
            )}
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[testimonial.status]}`}>
          {testimonial.status}
        </span>
      </div>

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

      {/* Testimonial Text */}
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        "{testimonial.testimonial}"
      </p>

      {/* Timestamp */}
      <p className="text-xs text-gray-500 mb-4">
        Submitted on {new Date(testimonial.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </p>

      {/* Actions */}
      <div className="flex gap-2 flex-wrap">
        {testimonial.status === 'pending' && (
          <>
            <Button
              variant="primary"
              onClick={() => onStatusChange(testimonial._id, 'approved')}
              className="flex items-center gap-2"
            >
              <CheckCircle size={18} />
              Approve
            </Button>
            <Button
              variant="secondary"
              onClick={() => onStatusChange(testimonial._id, 'rejected')}
              className="flex items-center gap-2 text-red-600 hover:text-red-700"
            >
              <XCircle size={18} />
              Reject
            </Button>
          </>
        )}
        {testimonial.status === 'approved' && (
          <Button
            variant="secondary"
            onClick={() => onToggleFeatured(testimonial._id, testimonial.featured)}
            className="flex items-center gap-2"
          >
            {testimonial.featured ? '⭐ Unfeature' : '⭐ Feature'}
          </Button>
        )}
        {testimonial.status === 'rejected' && (
          <Button
            variant="primary"
            onClick={() => onStatusChange(testimonial._id, 'approved')}
            className="flex items-center gap-2"
          >
            <CheckCircle size={18} />
            Approve
          </Button>
        )}
        <Button
          variant="ghost"
          onClick={() => onDelete(testimonial._id)}
          className="flex items-center gap-2 text-red-600 hover:text-red-700 ml-auto"
        >
          <Trash2 size={18} />
          Delete
        </Button>
      </div>
    </Card>
  )
}
