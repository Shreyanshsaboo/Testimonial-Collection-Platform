'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  Plus, FolderOpen, Star, CheckCircle, Clock, LogOut, Loader2, 
  ExternalLink, Settings, Trash2, Copy, Home, BarChart3, 
  User, HelpCircle, MessageSquare, Layout
} from 'lucide-react'

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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

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
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="animate-spin text-white" size={40} />
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border-r border-white/5 flex flex-col backdrop-blur-xl">
        {/* Profile Section */}
        <div className="p-5 border-b border-white/5">
          <div className="text-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white to-slate-200 mx-auto mb-3 flex items-center justify-center text-black text-xl font-bold shadow-xl shadow-white/10">
              {session.user.name?.charAt(0).toUpperCase()}
            </div>
            <h3 className="font-bold text-white text-base">{session.user.name}</h3>
            <p className="text-xs text-slate-500 mt-1">{session.user.email}</p>
          </div>
          <Link href="/dashboard/projects/new">
            <button className="w-full bg-white hover:bg-slate-100 text-black font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-white/10 hover:shadow-white/20 hover:scale-[1.02]">
              <Plus size={18} strokeWidth={2.5} />
              Create Project
            </button>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-1.5">
            <NavItem icon={<Home size={18} />} label="Dashboard" active onClick={() => router.push('/dashboard')} />
            <NavItem icon={<MessageSquare size={18} />} label="Testimonials" onClick={() => router.push('/dashboard/testimonials')} />
            <NavItem icon={<BarChart3 size={18} />} label="Analytics" onClick={() => router.push('/dashboard/analytics')} />
            <NavItem icon={<Settings size={18} />} label="Settings" onClick={() => router.push('/dashboard/settings')} />
            <NavItem icon={<HelpCircle size={18} />} label="Support" onClick={() => {
              alert('Need help? Contact support@testimonials.com')
            }} />
          </div>
        </nav>

        {/* Sign Out */}
        <div className="p-4 border-t border-white/5">
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
          >
            <LogOut size={18} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border-b border-white/5 px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-black text-white mb-1 tracking-tight">
                Dashboard
              </h1>
              <p className="text-slate-400 text-base">
                Welcome back, <span className="text-white font-semibold">{session.user.name?.split(' ')[0]}</span>!
              </p>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <StatCard 
              title="Total Projects" 
              value={stats.totalProjects} 
              icon={<FolderOpen size={20} />}
            />
            <StatCard 
              title="Total Testimonials" 
              value={stats.totalTestimonials} 
              icon={<Star size={20} />}
            />
            <StatCard 
              title="Approved" 
              value={stats.approved} 
              icon={<CheckCircle size={20} />}
            />
            <StatCard 
              title="Pending" 
              value={stats.pending} 
              icon={<Clock size={20} />}
            />
          </div>

          {/* Projects Section */}
          <div id="projects-section" className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl border border-white/5 p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Your Projects</h2>
                <p className="text-slate-400 text-sm mt-1">Manage and track your testimonial collections</p>
              </div>
              {projects.length > 0 && (
                <Link href="/dashboard/projects/new">
                  <button className="bg-white hover:bg-slate-100 text-black font-bold py-2 px-5 rounded-xl transition-all shadow-lg shadow-white/10 hover:shadow-white/20 hover:scale-[1.02]">
                    + New Project
                  </button>
                </Link>
              )}
            </div>
            
            {projects.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] flex items-center justify-center mx-auto mb-5 shadow-xl">
                  <FolderOpen size={36} className="text-slate-400" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">No projects yet</h3>
                <p className="text-slate-400 text-base mb-6 max-w-md mx-auto">
                  Create your first project to start collecting testimonials from your customers
                </p>
                <Link href="/dashboard/projects/new">
                  <button className="bg-white hover:bg-slate-100 text-black font-bold py-3 px-6 rounded-xl inline-flex items-center gap-2 transition-all shadow-xl shadow-white/10 hover:shadow-white/20 hover:scale-[1.02]">
                    <Plus size={18} strokeWidth={2.5} />
                    Create Your First Project
                  </button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
    </div>
  )
}

// Navigation Item Component
function NavItem({ icon, label, active = false, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all text-sm ${
        active
          ? 'bg-white/10 text-white font-bold shadow-lg shadow-white/5 border border-white/10'
          : 'text-slate-400 hover:text-white hover:bg-white/5 font-medium'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}

// Project Card Component
function ProjectCard({ project, onCopyLink, onRefresh }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)
  const [copied, setCopied] = useState(false)

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

  const handleCopy = () => {
    onCopyLink(project.shareId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all duration-300 group shadow-2xl hover:shadow-white/5 hover:scale-[1.02]">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white mb-1.5 tracking-tight">
            {project.name}
          </h3>
          {project.description && (
            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
              {project.description}
            </p>
          )}
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-slate-500 hover:text-red-400 transition disabled:opacity-50 ml-2 p-1.5 rounded-lg hover:bg-white/5"
          title="Delete Project"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4 p-4 bg-black/40 rounded-xl border border-white/5 shadow-inner">
        <div className="text-center">
          <p className="text-2xl font-black text-white tracking-tight">{project.stats?.totalSubmissions || 0}</p>
          <p className="text-[10px] text-slate-500 mt-1.5 uppercase tracking-wider font-semibold">Total</p>
        </div>
        <div className="text-center border-l border-r border-white/10">
          <p className="text-2xl font-black text-white tracking-tight">{project.stats?.approvedCount || 0}</p>
          <p className="text-[10px] text-slate-500 mt-1.5 uppercase tracking-wider font-semibold">Approved</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-black text-white tracking-tight">
            {(project.stats?.totalSubmissions || 0) - (project.stats?.approvedCount || 0) - (project.stats?.rejectedCount || 0)}
          </p>
          <p className="text-[10px] text-slate-500 mt-1.5 uppercase tracking-wider font-semibold">Pending</p>
        </div>
      </div>

      <div className="space-y-2.5">
        <button
          onClick={() => router.push(`/dashboard/projects/${project._id}`)}
          className="w-full bg-white hover:bg-slate-100 text-black font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-white/10 hover:shadow-white/20 hover:scale-[1.02]"
        >
          <Layout size={18} strokeWidth={2.5} />
          Manage Project
        </button>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={handleCopy}
            className="w-full bg-white/5 hover:bg-white/10 text-white font-semibold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all border border-white/10 hover:border-white/20 text-xs"
          >
            <Copy size={14} />
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <a
            href={`/submit/${project.shareId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-white/5 hover:bg-white/10 text-white font-semibold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all border border-white/10 hover:border-white/20 text-xs"
          >
            <ExternalLink size={14} />
            View
          </a>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all duration-300 shadow-2xl hover:shadow-white/5 hover:scale-[1.02] group">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-xl bg-white/5 group-hover:bg-white/10 transition-all shadow-inner border border-white/5">
          <div className="text-white">
            {icon}
          </div>
        </div>
      </div>
      <h3 className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
        {title}
      </h3>
      <p className="text-3xl font-black text-white tracking-tight">{value}</p>
    </div>
  )
}

