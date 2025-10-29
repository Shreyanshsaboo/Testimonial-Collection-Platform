'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Button, Input, Label, Card } from '@/components/ui'

export default function NewProjectPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    collectEmail: true,
    collectCompany: true,
    collectPosition: true,
    allowVideo: true,
    allowPhoto: true,
    requireApproval: true,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create project')
      }

      router.push(`/dashboard/projects/${data.project._id}`)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  if (status === 'loading') {
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

      <div className="container mx-auto px-6 py-10 max-w-3xl">
        <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Create New Project</h1>
        <p className="text-slate-400 text-base mb-8">
          Set up a new project to start collecting testimonials
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-5 py-4 rounded-xl mb-6 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 rounded-2xl p-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-5 tracking-tight">Basic Information</h2>
            
            <div className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-white mb-2">Project Name *</label>
                <input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="My Awesome Product"
                  required
                  maxLength={100}
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-white/30 focus:outline-none transition"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-white mb-2">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Brief description of your project..."
                  rows={3}
                  maxLength={500}
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-white/30 focus:outline-none transition resize-none"
                />
                <p className="text-xs text-slate-500 mt-2">
                  {formData.description.length}/500 characters
                </p>
              </div>

              <div>
                <label htmlFor="website" className="block text-sm font-semibold text-white mb-2">Website URL</label>
                <input
                  id="website"
                  name="website"
                  type="url"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  maxLength={200}
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-white/30 focus:outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* Form Settings */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 rounded-2xl p-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Collection Settings</h2>
            <p className="text-slate-400 text-sm mb-5">
              Choose what information to collect from your customers
            </p>
            
            <div className="space-y-3.5">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  name="collectEmail"
                  checked={formData.collectEmail}
                  onChange={handleChange}
                  className="w-5 h-5 rounded-lg border-white/20 bg-black/40 text-white focus:ring-white/30 focus:ring-2"
                />
                <span className="text-white font-medium group-hover:text-slate-200 transition">Collect Email Address</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  name="collectCompany"
                  checked={formData.collectCompany}
                  onChange={handleChange}
                  className="w-5 h-5 rounded-lg border-white/20 bg-black/40 text-white focus:ring-white/30 focus:ring-2"
                />
                <span className="text-white font-medium group-hover:text-slate-200 transition">Collect Company Name</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  name="collectPosition"
                  checked={formData.collectPosition}
                  onChange={handleChange}
                  className="w-5 h-5 rounded-lg border-white/20 bg-black/40 text-white focus:ring-white/30 focus:ring-2"
                />
                <span className="text-white font-medium group-hover:text-slate-200 transition">Collect Position/Title</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  name="allowPhoto"
                  checked={formData.allowPhoto}
                  onChange={handleChange}
                  className="w-5 h-5 rounded-lg border-white/20 bg-black/40 text-white focus:ring-white/30 focus:ring-2"
                />
                <span className="text-white font-medium group-hover:text-slate-200 transition">Allow Photo Upload</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  name="allowVideo"
                  checked={formData.allowVideo}
                  onChange={handleChange}
                  className="w-5 h-5 rounded-lg border-white/20 bg-black/40 text-white focus:ring-white/30 focus:ring-2"
                />
                <span className="text-white font-medium group-hover:text-slate-200 transition">Allow Video Upload</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  name="requireApproval"
                  checked={formData.requireApproval}
                  onChange={handleChange}
                  className="w-5 h-5 rounded-lg border-white/20 bg-black/40 text-white focus:ring-white/30 focus:ring-2"
                />
                <span className="text-white font-medium group-hover:text-slate-200 transition">Require Manual Approval</span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading || !formData.name}
              className="bg-white hover:bg-slate-100 disabled:bg-slate-600 disabled:cursor-not-allowed text-black font-bold py-3 px-8 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-white/10 hover:shadow-white/20 hover:scale-[1.02]"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Creating...
                </>
              ) : (
                'Create Project'
              )}
            </button>
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="bg-white/5 hover:bg-white/10 text-white font-semibold py-3 px-8 rounded-xl transition-all border border-white/10 hover:border-white/20"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
