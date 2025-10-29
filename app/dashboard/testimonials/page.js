'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { 
  ArrowLeft, Loader2, Star, CheckCircle, XCircle, 
  User, Filter, Search, Trash2, ExternalLink
} from 'lucide-react'

export default function AllTestimonialsPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [testimonials, setTestimonials] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selectedProject, setSelectedProject] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (status === 'authenticated') {
      fetchAllData()
    }
  }, [status])

  const fetchAllData = async () => {
    try {
      // Fetch all projects
      const projectsRes = await fetch('/api/projects')
      const projectsData = await projectsRes.json()
      
      if (projectsData.success) {
        setProjects(projectsData.projects)
        
        // Fetch testimonials for all projects
        const allTestimonials = []
        for (const project of projectsData.projects) {
          const testimonialsRes = await fetch(`/api/projects/${project._id}/testimonials?status=all`)
          const testimonialsData = await testimonialsRes.json()
          
          if (testimonialsData.success) {
            // Add project info to each testimonial
            const testimonialsWithProject = testimonialsData.testimonials.map(t => ({
              ...t,
              projectName: project.name,
              projectId: project._id
            }))
            allTestimonials.push(...testimonialsWithProject)
          }
        }
        
        // Sort by date (newest first)
        allTestimonials.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        setTestimonials(allTestimonials)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (testimonial, newStatus) => {
    try {
      const response = await fetch(`/api/projects/${testimonial.projectId}/testimonials`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testimonialId: testimonial._id, status: newStatus }),
      })

      if (response.ok) {
        // Update local state
        setTestimonials(testimonials.map(t => 
          t._id === testimonial._id ? { ...t, status: newStatus } : t
        ))
      }
    } catch (error) {
      console.error('Error updating testimonial:', error)
    }
  }

  const handleDelete = async (testimonial) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return

    try {
      const response = await fetch(
        `/api/projects/${testimonial.projectId}/testimonials?testimonialId=${testimonial._id}`,
        { method: 'DELETE' }
      )

      if (response.ok) {
        setTestimonials(testimonials.filter(t => t._id !== testimonial._id))
      }
    } catch (error) {
      console.error('Error deleting testimonial:', error)
    }
  }

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

  // Filter testimonials
  const filteredTestimonials = testimonials.filter(t => {
    const matchesStatus = filter === 'all' || t.status === filter
    const matchesProject = selectedProject === 'all' || t.projectId === selectedProject
    const matchesSearch = searchQuery === '' || 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.testimonial.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.company && t.company.toLowerCase().includes(searchQuery.toLowerCase()))
    
    return matchesStatus && matchesProject && matchesSearch
  })

  const stats = {
    total: testimonials.length,
    pending: testimonials.filter(t => t.status === 'pending').length,
    approved: testimonials.filter(t => t.status === 'approved').length,
    rejected: testimonials.filter(t => t.status === 'rejected').length,
  }

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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">All Testimonials</h1>
          <p className="text-slate-400 text-base">
            Manage testimonials from all your projects in one place
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 rounded-2xl p-5 shadow-2xl">
            <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Total</p>
            <p className="text-3xl font-black text-white tracking-tight">{stats.total}</p>
          </div>
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 rounded-2xl p-5 shadow-2xl">
            <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Pending</p>
            <p className="text-3xl font-black text-orange-400 tracking-tight">{stats.pending}</p>
          </div>
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 rounded-2xl p-5 shadow-2xl">
            <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Approved</p>
            <p className="text-3xl font-black text-green-400 tracking-tight">{stats.approved}</p>
          </div>
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 rounded-2xl p-5 shadow-2xl">
            <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Rejected</p>
            <p className="text-3xl font-black text-red-400 tracking-tight">{stats.rejected}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 rounded-2xl p-6 mb-6 shadow-2xl">
          {/* Search */}
          <div className="mb-5">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, testimonial, or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-white/30 focus:outline-none transition"
              />
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center gap-3 flex-wrap mb-5">
            <Filter size={20} className="text-slate-400" />
            <button
              onClick={() => setFilter('all')}
              className={`px-5 py-2.5 rounded-xl transition font-semibold ${
                filter === 'all' 
                  ? 'bg-white text-black shadow-lg' 
                  : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
              }`}
            >
              All ({stats.total})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-5 py-2.5 rounded-xl transition font-semibold ${
                filter === 'pending' 
                  ? 'bg-white text-black shadow-lg' 
                  : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
              }`}
            >
              Pending ({stats.pending})
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-5 py-2.5 rounded-xl transition font-semibold ${
                filter === 'approved' 
                  ? 'bg-white text-black shadow-lg' 
                  : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
              }`}
            >
              Approved ({stats.approved})
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`px-5 py-2.5 rounded-xl transition font-semibold ${
                filter === 'rejected' 
                  ? 'bg-white text-black shadow-lg' 
                  : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
              }`}
            >
              Rejected ({stats.rejected})
            </button>
          </div>

          {/* Project Filter */}
          <div className="flex items-center gap-3">
            <label className="text-slate-400 text-sm font-semibold">Filter by Project:</label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:border-white/30 focus:outline-none transition"
            >
              <option value="all">All Projects</option>
              {projects.map(project => (
                <option key={project._id} value={project._id}>{project.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Testimonials List */}
        <div className="space-y-5">
          {filteredTestimonials.length === 0 ? (
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 rounded-2xl p-16 text-center shadow-2xl">
              <Star size={64} className="mx-auto text-slate-600 mb-4" strokeWidth={1.5} />
              <p className="text-slate-400 text-lg">
                {searchQuery || filter !== 'all' || selectedProject !== 'all'
                  ? 'No testimonials match your filters'
                  : 'No testimonials yet. Share your project links to start collecting!'}
              </p>
            </div>
          ) : (
            filteredTestimonials.map((testimonial) => (
              <TestimonialCard
                key={testimonial._id}
                testimonial={testimonial}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function TestimonialCard({ testimonial, onStatusChange, onDelete }) {
  const statusColors = {
    pending: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    approved: 'bg-green-500/10 text-green-400 border-green-500/20',
    rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
  }

  return (
    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 rounded-2xl p-6 shadow-2xl hover:border-white/20 transition-all">
      <div className="flex justify-between items-start mb-5">
        <div className="flex items-center gap-3 flex-1">
          <div className="bg-gradient-to-br from-white to-slate-300 rounded-2xl p-3 shadow-lg">
            <User size={24} className="text-black" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-lg text-white">{testimonial.name}</h3>
              <span className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wide border ${statusColors[testimonial.status]}`}>
                {testimonial.status}
              </span>
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
            <Link 
              href={`/dashboard/projects/${testimonial.projectId}`}
              className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-white transition mt-1"
            >
              <ExternalLink size={12} />
              {testimonial.projectName}
            </Link>
          </div>
        </div>
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
              onClick={() => onStatusChange(testimonial, 'approved')}
              className="bg-white hover:bg-slate-100 text-black font-bold py-2.5 px-5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-white/10 hover:shadow-white/20 hover:scale-[1.02]"
            >
              <CheckCircle size={18} />
              Approve
            </button>
            <button
              onClick={() => onStatusChange(testimonial, 'rejected')}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-semibold py-2.5 px-5 rounded-xl flex items-center gap-2 transition-all"
            >
              <XCircle size={18} />
              Reject
            </button>
          </>
        )}
        {testimonial.status === 'rejected' && (
          <button
            onClick={() => onStatusChange(testimonial, 'approved')}
            className="bg-white hover:bg-slate-100 text-black font-bold py-2.5 px-5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-white/10 hover:shadow-white/20 hover:scale-[1.02]"
          >
            <CheckCircle size={18} />
            Approve
          </button>
        )}
        <button
          onClick={() => onDelete(testimonial)}
          className="bg-white/5 hover:bg-red-500/10 text-red-400 border border-white/10 hover:border-red-500/20 font-semibold py-2.5 px-5 rounded-xl flex items-center gap-2 transition-all ml-auto"
        >
          <Trash2 size={18} />
          Delete
        </button>
      </div>
    </div>
  )
}
