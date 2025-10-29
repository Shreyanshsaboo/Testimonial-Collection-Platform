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
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <Loader2 className="animate-spin text-white" size={40} />
      </div>
    )
  }

  if (!session) {
    router.push('/auth/signin')
    return null
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <p className="text-white">Project not found</p>
      </div>
    )
  }

  const filteredTestimonials = filter === 'all' 
    ? testimonials 
    : testimonials.filter(t => t.status === filter)

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Navigation */}
      <nav className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border-b border-white/5">
        <div className="container mx-auto px-6 py-5">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-white hover:text-slate-300 transition font-semibold">
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-10">
        {/* Project Header */}
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 rounded-2xl p-6 mb-6 shadow-2xl">
          <div className="flex justify-between items-start mb-5">
            <div>
              <h1 className="text-4xl font-black text-white mb-2 tracking-tight">{project.name}</h1>
              {project.description && (
                <p className="text-slate-400">{project.description}</p>
              )}
            </div>
            <Link href={`/dashboard/projects/${project._id}/settings`}>
              <button className="bg-white/5 hover:bg-white/10 text-white font-semibold py-2.5 px-5 rounded-xl transition-all border border-white/10 hover:border-white/20 flex items-center gap-2">
                <SettingsIcon size={18} />
                Settings
              </button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-5 bg-black/40 rounded-xl border border-white/5">
              <p className="text-3xl font-black text-white">{project.stats?.totalSubmissions || 0}</p>
              <p className="text-xs text-slate-500 mt-2 uppercase font-semibold tracking-wider">Total</p>
            </div>
            <div className="text-center p-5 bg-black/40 rounded-xl border border-white/5">
              <p className="text-3xl font-black text-white">{project.stats?.approvedCount || 0}</p>
              <p className="text-xs text-slate-500 mt-2 uppercase font-semibold tracking-wider">Approved</p>
            </div>
            <div className="text-center p-5 bg-black/40 rounded-xl border border-white/5">
              <p className="text-3xl font-black text-white">
                {(project.stats?.totalSubmissions || 0) - (project.stats?.approvedCount || 0) - (project.stats?.rejectedCount || 0)}
              </p>
              <p className="text-xs text-slate-500 mt-2 uppercase font-semibold tracking-wider">Pending</p>
            </div>
          </div>

          {/* Share Link */}
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={copyShareLink}
              className="bg-white hover:bg-slate-100 text-black font-bold py-2.5 px-5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-white/10 hover:shadow-white/20 hover:scale-[1.02]"
            >
              <Copy size={18} />
              {copied ? 'Copied!' : 'Copy Share Link'}
            </button>
            <a
              href={`/submit/${project.shareId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/5 hover:bg-white/10 text-white font-semibold py-2.5 px-5 rounded-xl transition-all border border-white/10 hover:border-white/20 flex items-center gap-2"
            >
              <ExternalLink size={18} />
              View Form
            </a>
            <Link href={`/dashboard/projects/${project._id}/embed`} className="bg-white/5 hover:bg-white/10 text-white font-semibold py-2.5 px-5 rounded-xl transition-all border border-white/10 hover:border-white/20 flex items-center gap-2">
              <Copy size={18} />
              Get Embed Code
            </Link>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 rounded-2xl p-5 mb-6 shadow-2xl">
          <div className="flex items-center gap-3 flex-wrap">
            <Filter size={20} className="text-slate-400" />
            <button
              onClick={() => setFilter('all')}
              className={`px-5 py-2.5 rounded-xl transition font-semibold ${
                filter === 'all' 
                  ? 'bg-white text-black shadow-lg' 
                  : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
              }`}
            >
              All ({testimonials.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-5 py-2.5 rounded-xl transition font-semibold ${
                filter === 'pending' 
                  ? 'bg-white text-black shadow-lg' 
                  : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
              }`}
            >
              Pending ({testimonials.filter(t => t.status === 'pending').length})
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-5 py-2.5 rounded-xl transition font-semibold ${
                filter === 'approved' 
                  ? 'bg-white text-black shadow-lg' 
                  : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
              }`}
            >
              Approved ({testimonials.filter(t => t.status === 'approved').length})
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`px-5 py-2.5 rounded-xl transition font-semibold ${
                filter === 'rejected' 
                  ? 'bg-white text-black shadow-lg' 
                  : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
              }`}
            >
              Rejected ({testimonials.filter(t => t.status === 'rejected').length})
            </button>
          </div>
        </div>

        {/* Testimonials List */}
        <div className="space-y-5">
          {filteredTestimonials.length === 0 ? (
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 rounded-2xl p-16 text-center shadow-2xl">
              <Star size={64} className="mx-auto text-slate-600 mb-4" strokeWidth={1.5} />
              <p className="text-slate-400 text-lg">
                {filter === 'all' 
                  ? 'No testimonials yet. Share your form link to start collecting!' 
                  : `No ${filter} testimonials.`}
              </p>
            </div>
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
    pending: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    approved: 'bg-green-500/10 text-green-400 border-green-500/20',
    rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
  }

  return (
    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 rounded-2xl p-6 shadow-2xl hover:border-white/20 transition-all">
      <div className="flex justify-between items-start mb-5">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-white to-slate-300 rounded-2xl p-3 shadow-lg">
            <User size={24} className="text-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg text-white">{testimonial.name}</h3>
              {testimonial.featured && (
                <span className="text-yellow-400 text-xl">⭐</span>
              )}
            </div>
            {testimonial.email && (
              <p className="text-sm text-slate-400">{testimonial.email}</p>
            )}
            {(testimonial.company || testimonial.position) && (
              <p className="text-sm text-slate-400 flex items-center gap-1">
                {testimonial.position && <span>{testimonial.position}</span>}
                {testimonial.position && testimonial.company && <span>at</span>}
                {testimonial.company && <span>{testimonial.company}</span>}
              </p>
            )}
          </div>
        </div>
        <span className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wide border ${statusColors[testimonial.status]}`}>
          {testimonial.status}
        </span>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={18}
            className={i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-600'}
          />
        ))}
      </div>

      {/* Testimonial Text */}
      <p className="text-slate-300 mb-5 leading-relaxed">
        "{testimonial.testimonial}"
      </p>

      {/* Timestamp */}
      <p className="text-xs text-slate-500 mb-5">
        Submitted on {new Date(testimonial.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </p>

      {/* Actions */}
      <div className="flex gap-3 flex-wrap">
        {testimonial.status === 'pending' && (
          <>
            <button
              onClick={() => onStatusChange(testimonial._id, 'approved')}
              className="bg-white hover:bg-slate-100 text-black font-bold py-2.5 px-5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-white/10 hover:shadow-white/20 hover:scale-[1.02]"
            >
              <CheckCircle size={18} />
              Approve
            </button>
            <button
              onClick={() => onStatusChange(testimonial._id, 'rejected')}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-semibold py-2.5 px-5 rounded-xl flex items-center gap-2 transition-all"
            >
              <XCircle size={18} />
              Reject
            </button>
          </>
        )}
        {testimonial.status === 'approved' && (
          <button
            onClick={() => onToggleFeatured(testimonial._id, testimonial.featured)}
            className="bg-white/5 hover:bg-white/10 text-white font-semibold py-2.5 px-5 rounded-xl transition-all border border-white/10 hover:border-white/20 flex items-center gap-2"
          >
            {testimonial.featured ? '⭐ Unfeature' : '⭐ Feature'}
          </button>
        )}
        {testimonial.status === 'rejected' && (
          <button
            onClick={() => onStatusChange(testimonial._id, 'approved')}
            className="bg-white hover:bg-slate-100 text-black font-bold py-2.5 px-5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-white/10 hover:shadow-white/20 hover:scale-[1.02]"
          >
            <CheckCircle size={18} />
            Approve
          </button>
        )}
        <button
          onClick={() => onDelete(testimonial._id)}
          className="bg-white/5 hover:bg-red-500/10 text-red-400 border border-white/10 hover:border-red-500/20 font-semibold py-2.5 px-5 rounded-xl flex items-center gap-2 transition-all ml-auto"
        >
          <Trash2 size={18} />
          Delete
        </button>
      </div>
    </div>
  )
}
