'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { 
  ArrowLeft, Loader2, TrendingUp, TrendingDown, 
  Star, CheckCircle, Clock, XCircle, Calendar,
  FolderOpen, MessageSquare, Award
} from 'lucide-react'

export default function AnalyticsPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [projects, setProjects] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30') // days

  useEffect(() => {
    if (status === 'authenticated') {
      fetchAllData()
    }
  }, [status, timeRange])

  const fetchAllData = async () => {
    try {
      const projectsRes = await fetch('/api/projects')
      const projectsData = await projectsRes.json()
      
      if (projectsData.success) {
        setProjects(projectsData.projects)
        
        const allTestimonials = []
        for (const project of projectsData.projects) {
          const testimonialsRes = await fetch(`/api/projects/${project._id}/testimonials?status=all`)
          const testimonialsData = await testimonialsRes.json()
          
          if (testimonialsData.success) {
            const testimonialsWithProject = testimonialsData.testimonials.map(t => ({
              ...t,
              projectName: project.name,
              projectId: project._id
            }))
            allTestimonials.push(...testimonialsWithProject)
          }
        }
        
        setTestimonials(allTestimonials)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
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

  // Calculate analytics
  const now = new Date()
  const daysAgo = new Date(now.getTime() - parseInt(timeRange) * 24 * 60 * 60 * 1000)
  
  const recentTestimonials = testimonials.filter(t => 
    new Date(t.createdAt) >= daysAgo
  )

  const stats = {
    total: testimonials.length,
    approved: testimonials.filter(t => t.status === 'approved').length,
    pending: testimonials.filter(t => t.status === 'pending').length,
    rejected: testimonials.filter(t => t.status === 'rejected').length,
    recentTotal: recentTestimonials.length,
    avgRating: testimonials.length > 0 
      ? (testimonials.reduce((sum, t) => sum + (t.rating || 0), 0) / testimonials.length).toFixed(1)
      : 0,
    approvalRate: testimonials.length > 0
      ? ((testimonials.filter(t => t.status === 'approved').length / testimonials.length) * 100).toFixed(1)
      : 0
  }

  // Growth calculation
  const previousPeriodStart = new Date(daysAgo.getTime() - parseInt(timeRange) * 24 * 60 * 60 * 1000)
  const previousTestimonials = testimonials.filter(t => 
    new Date(t.createdAt) >= previousPeriodStart && new Date(t.createdAt) < daysAgo
  )
  const growth = previousTestimonials.length > 0
    ? (((recentTestimonials.length - previousTestimonials.length) / previousTestimonials.length) * 100).toFixed(1)
    : recentTestimonials.length > 0 ? 100 : 0

  // Project performance
  const projectStats = projects.map(project => {
    const projectTestimonials = testimonials.filter(t => t.projectId === project._id)
    return {
      name: project.name,
      total: projectTestimonials.length,
      approved: projectTestimonials.filter(t => t.status === 'approved').length,
      pending: projectTestimonials.filter(t => t.status === 'pending').length,
      avgRating: projectTestimonials.length > 0
        ? (projectTestimonials.reduce((sum, t) => sum + (t.rating || 0), 0) / projectTestimonials.length).toFixed(1)
        : 0
    }
  }).sort((a, b) => b.total - a.total)

  // Daily submissions for chart
  const dailyData = []
  for (let i = parseInt(timeRange) - 1; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    const dateStr = date.toISOString().split('T')[0]
    const count = testimonials.filter(t => {
      const tDate = new Date(t.createdAt).toISOString().split('T')[0]
      return tDate === dateStr
    }).length
    dailyData.push({ date: dateStr, count, label: formatDate(date) })
  }

  // Rating distribution
  const ratingDistribution = [1, 2, 3, 4, 5].map(rating => ({
    rating,
    count: testimonials.filter(t => t.rating === rating).length,
    percentage: testimonials.length > 0 
      ? ((testimonials.filter(t => t.rating === rating).length / testimonials.length) * 100).toFixed(1)
      : 0
  }))

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
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Analytics</h1>
            <p className="text-slate-400 text-base">
              Track your testimonial collection performance
            </p>
          </div>
          
          {/* Time Range Selector */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2.5 bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 rounded-xl text-white font-semibold focus:border-white/30 focus:outline-none transition"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <MetricCard
            title="Total Testimonials"
            value={stats.total}
            change={growth}
            icon={<MessageSquare size={24} />}
            trend={parseFloat(growth) >= 0}
          />
          <MetricCard
            title="Approval Rate"
            value={`${stats.approvalRate}%`}
            icon={<CheckCircle size={24} />}
            color="green"
          />
          <MetricCard
            title="Avg Rating"
            value={stats.avgRating}
            icon={<Star size={24} />}
            color="yellow"
          />
          <MetricCard
            title="Pending Review"
            value={stats.pending}
            icon={<Clock size={24} />}
            color="orange"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Submissions Timeline */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 rounded-2xl p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <TrendingUp size={20} />
              Submissions Timeline
            </h2>
            <LineChart data={dailyData} />
          </div>

          {/* Status Distribution */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 rounded-2xl p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <CheckCircle size={20} />
              Status Distribution
            </h2>
            <DonutChart
              data={[
                { label: 'Approved', value: stats.approved, color: '#4ade80' },
                { label: 'Pending', value: stats.pending, color: '#fb923c' },
                { label: 'Rejected', value: stats.rejected, color: '#f87171' }
              ]}
            />
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 rounded-2xl p-6 shadow-2xl mb-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Star size={20} />
            Rating Distribution
          </h2>
          <RatingBars data={ratingDistribution} />
        </div>

        {/* Project Performance */}
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 rounded-2xl p-6 shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Award size={20} />
            Project Performance
          </h2>
          <div className="space-y-4">
            {projectStats.length === 0 ? (
              <p className="text-slate-400 text-center py-8">No projects yet</p>
            ) : (
              projectStats.map((project, index) => (
                <ProjectPerformanceBar key={index} project={project} maxValue={Math.max(...projectStats.map(p => p.total))} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function MetricCard({ title, value, change, icon, trend, color = 'blue' }) {
  const colors = {
    blue: 'text-blue-400',
    green: 'text-green-400',
    yellow: 'text-yellow-400',
    orange: 'text-orange-400'
  }

  return (
    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 rounded-2xl p-6 shadow-2xl hover:border-white/20 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-white/5 ${colors[color]}`}>
          {icon}
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-sm font-bold ${trend ? 'text-green-400' : 'text-red-400'}`}>
            {trend ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">{title}</p>
      <p className="text-3xl font-black text-white tracking-tight">{value}</p>
    </div>
  )
}

function LineChart({ data }) {
  const maxValue = Math.max(...data.map(d => d.count), 1)
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100
    const y = 100 - (d.count / maxValue) * 80
    return `${x},${y}`
  }).join(' ')

  return (
    <div className="space-y-4">
      <div className="relative h-64 bg-black/40 rounded-xl p-4 border border-white/5">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="100"
              y2={y}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="0.2"
            />
          ))}
          
          {/* Area fill */}
          <polygon
            points={`0,100 ${points} 100,100`}
            fill="url(#gradient)"
            opacity="0.2"
          />
          
          {/* Line */}
          <polyline
            points={points}
            fill="none"
            stroke="white"
            strokeWidth="0.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Points */}
          {data.map((d, i) => {
            const x = (i / (data.length - 1)) * 100
            const y = 100 - (d.count / maxValue) * 80
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="1"
                fill="white"
                className="drop-shadow-lg"
              />
            )
          })}
          
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="white" stopOpacity="0.3" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-slate-500 pr-2">
          <span>{maxValue}</span>
          <span>{Math.round(maxValue * 0.5)}</span>
          <span>0</span>
        </div>
      </div>
      
      {/* X-axis labels */}
      <div className="flex justify-between text-xs text-slate-500 px-4">
        <span>{data[0]?.label}</span>
        <span>{data[Math.floor(data.length / 2)]?.label}</span>
        <span>{data[data.length - 1]?.label}</span>
      </div>
    </div>
  )
}

function DonutChart({ data }) {
  const total = data.reduce((sum, d) => sum + d.value, 0)
  
  if (total === 0) {
    return <div className="text-center text-slate-400 py-16">No data available</div>
  }

  let currentAngle = -90
  const segments = data.map(item => {
    const percentage = (item.value / total) * 100
    const angle = (percentage / 100) * 360
    const startAngle = currentAngle
    currentAngle += angle
    
    return {
      ...item,
      percentage: percentage.toFixed(1),
      startAngle,
      endAngle: currentAngle
    }
  })

  return (
    <div className="flex items-center justify-center gap-8">
      {/* Donut Chart */}
      <div className="relative w-48 h-48">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="20"
          />
          
          {/* Segments */}
          {segments.map((segment, index) => {
            const startAngle = (segment.startAngle * Math.PI) / 180
            const endAngle = (segment.endAngle * Math.PI) / 180
            const largeArc = segment.endAngle - segment.startAngle > 180 ? 1 : 0
            
            const x1 = 50 + 40 * Math.cos(startAngle)
            const y1 = 50 + 40 * Math.sin(startAngle)
            const x2 = 50 + 40 * Math.cos(endAngle)
            const y2 = 50 + 40 * Math.sin(endAngle)
            
            return (
              <path
                key={index}
                d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                fill={segment.color}
                opacity="0.8"
                className="hover:opacity-100 transition-opacity cursor-pointer"
              />
            )
          })}
          
          {/* Center circle */}
          <circle cx="50" cy="50" r="25" fill="#0a0a0a" />
        </svg>
        
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-3xl font-black text-white">{total}</p>
          <p className="text-xs text-slate-500 uppercase">Total</p>
        </div>
      </div>
      
      {/* Legend */}
      <div className="space-y-3">
        {segments.map((segment, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: segment.color }} />
            <div>
              <p className="text-white font-semibold text-sm">{segment.label}</p>
              <p className="text-slate-400 text-xs">{segment.value} ({segment.percentage}%)</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function RatingBars({ data }) {
  const maxCount = Math.max(...data.map(d => d.count), 1)
  
  return (
    <div className="space-y-4">
      {data.reverse().map((item) => (
        <div key={item.rating} className="flex items-center gap-4">
          <div className="flex items-center gap-1 w-20">
            {[...Array(item.rating)].map((_, i) => (
              <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          
          <div className="flex-1 relative h-8 bg-black/40 rounded-lg overflow-hidden border border-white/5">
            <div 
              className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 transition-all duration-500 flex items-center justify-end pr-3"
              style={{ width: `${(item.count / maxCount) * 100}%` }}
            >
              {item.count > 0 && (
                <span className="text-xs font-bold text-black">{item.count}</span>
              )}
            </div>
          </div>
          
          <span className="text-slate-400 text-sm w-16 text-right">{item.percentage}%</span>
        </div>
      ))}
    </div>
  )
}

function ProjectPerformanceBar({ project, maxValue }) {
  const percentage = maxValue > 0 ? (project.total / maxValue) * 100 : 0
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FolderOpen size={16} className="text-slate-400" />
          <span className="text-white font-semibold">{project.name}</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-slate-400">
            {project.total} total
          </span>
          <span className="text-green-400 font-semibold">
            {project.approved} approved
          </span>
          <div className="flex items-center gap-1 text-yellow-400">
            <Star size={14} className="fill-yellow-400" />
            <span className="font-semibold">{project.avgRating}</span>
          </div>
        </div>
      </div>
      
      <div className="relative h-3 bg-black/40 rounded-full overflow-hidden border border-white/5">
        <div 
          className="h-full bg-gradient-to-r from-white to-slate-300 transition-all duration-500 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

function formatDate(date) {
  const month = date.toLocaleDateString('en-US', { month: 'short' })
  const day = date.getDate()
  return `${month} ${day}`
}
