'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, FolderOpen, Star, CheckCircle, Clock, LogOut, Loader2, ExternalLink, Settings, Trash2, Copy } from 'lucide-react'
import { Button } from '@/components/ui'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [projects, setProjects] = useState([])
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTestimonials: 0,
    approved: 0,
    pending: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
    if (status === 'authenticated') {
      fetchProjects()
    }
  }, [status, router])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      const data = await response.json()
      
      if (data.success) {
        setProjects(data.projects)
        
        // Calculate stats
        const totalProjects = data.projects.length
        const totalTestimonials = data.projects.reduce((sum, p) => sum + (p.stats?.totalSubmissions || 0), 0)
        const approved = data.projects.reduce((sum, p) => sum + (p.stats?.approvedCount || 0), 0)
        const pending = totalTestimonials - approved - data.projects.reduce((sum, p) => sum + (p.stats?.rejectedCount || 0), 0)
        
        setStats({
          totalProjects,
          totalTestimonials,
          approved,
          pending,
        })
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyShareLink = (shareId) => {
    const link = `${window.location.origin}/submit/${shareId}`
    navigator.clipboard.writeText(link)
    alert('Share link copied to clipboard!')
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" size={40} />
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Testimonial Platform
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {session.user.email}
            </span>
            <Button 
              variant="ghost"
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center gap-2"
            >
              <LogOut size={18} />
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Welcome back, {session.user.name}!
            </p>
          </div>
          <Link href="/dashboard/projects/new">
            <Button className="flex items-center gap-2">
              <Plus size={20} />
              New Project
            </Button>
          </Link>
        </div>
        
        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Projects" 
            value={stats.totalProjects} 
            icon={<FolderOpen size={24} />}
            color="blue"
          />
          <StatCard 
            title="Total Testimonials" 
            value={stats.totalTestimonials} 
            icon={<Star size={24} />}
            color="yellow"
          />
          <StatCard 
            title="Approved" 
            value={stats.approved} 
            icon={<CheckCircle size={24} />}
            color="green"
          />
          <StatCard 
            title="Pending" 
            value={stats.pending} 
            icon={<Clock size={24} />}
            color="orange"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/dashboard/projects/new">
              <ActionCard 
                title="Create New Project"
                description="Start collecting testimonials"
              />
            </Link>
            <ActionCard 
              title="View All Projects"
              description="Manage your existing projects"
              onClick={() => document.getElementById('projects-section')?.scrollIntoView({ behavior: 'smooth' })}
            />
            <Link href="/demo">
              <ActionCard 
                title="View Demo"
                description="See testimonial widgets in action"
              />
            </Link>
          </div>
        </div>

        {/* Projects List */}
        <div id="projects-section" className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Your Projects</h2>
          
          {projects.length === 0 ? (
            <div className="text-center py-12">
              <FolderOpen size={64} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                No projects yet. Create your first project to get started!
              </p>
              <Link href="/dashboard/projects/new">
                <Button className="flex items-center gap-2 mx-auto">
                  <Plus size={20} />
                  Create Your First Project
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard 
                  key={project._id} 
                  project={project} 
                  onCopyLink={copyShareLink}
                  onRefresh={fetchProjects}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Project Card Component
function ProjectCard({ project, onCopyLink, onRefresh }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return
    }

    setDeleting(true)
    try {
      const response = await fetch(`/api/projects/${project._id}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        onRefresh()
      } else {
        alert('Failed to delete project')
      }
    } catch (error) {
      console.error('Error deleting project:', error)
      alert('Failed to delete project')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 hover:shadow-lg transition group">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          {project.name}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/dashboard/projects/${project._id}`)}
            className="text-blue-600 hover:text-blue-700 transition"
            title="View Project"
          >
            <Settings size={20} />
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-red-600 hover:text-red-700 transition disabled:opacity-50"
            title="Delete Project"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      {project.description && (
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
          {project.description}
        </p>
      )}

      <div className="grid grid-cols-3 gap-4 mb-4 py-4 border-y border-gray-200 dark:border-gray-600">
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">{project.stats?.totalSubmissions || 0}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Total</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">{project.stats?.approvedCount || 0}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Approved</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-orange-600">
            {(project.stats?.totalSubmissions || 0) - (project.stats?.approvedCount || 0) - (project.stats?.rejectedCount || 0)}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Pending</p>
        </div>
      </div>

      <div className="space-y-2">
        <Button
          variant="primary"
          className="w-full flex items-center justify-center gap-2"
          onClick={() => router.push(`/dashboard/projects/${project._id}`)}
        >
          <Settings size={18} />
          Manage
        </Button>
        <Button
          variant="secondary"
          className="w-full flex items-center justify-center gap-2"
          onClick={() => onCopyLink(project.shareId)}
        >
          <Copy size={18} />
          Copy Share Link
        </Button>
        <div className="grid grid-cols-2 gap-2">
          <a
            href={`/submit/${project.shareId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Button
              variant="ghost"
              className="w-full flex items-center justify-center gap-2"
            >
              <ExternalLink size={18} />
              View Form
            </Button>
          </a>
          <Link href={`/dashboard/projects/${project._id}/embed`}>
            <Button
              variant="ghost"
              className="w-full flex items-center justify-center gap-2"
            >
              <Copy size={18} />
              Embed
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon, color }) {
  const colors = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400',
    yellow: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400',
    green: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400',
    orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400',
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colors[color]}`}>
          {icon}
        </div>
      </div>
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
        {title}
      </h3>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  )
}

function ActionCard({ title, description, onClick }) {
  return (
    <div
      onClick={onClick}
      className="block p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition cursor-pointer"
    >
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  )
}

