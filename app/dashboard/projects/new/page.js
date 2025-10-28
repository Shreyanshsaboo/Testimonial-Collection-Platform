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

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-4xl font-bold mb-2">Create New Project</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Set up a new project to start collecting testimonials
        </p>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Project Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="My Awesome Product"
                  required
                  maxLength={100}
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Brief description of your project..."
                  rows={3}
                  maxLength={500}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.description.length}/500 characters
                </p>
              </div>

              <div>
                <Label htmlFor="website">Website URL</Label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  maxLength={200}
                />
              </div>
            </div>
          </Card>

          {/* Form Settings */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Collection Settings</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Choose what information to collect from your customers
            </p>
            
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="collectEmail"
                  checked={formData.collectEmail}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-900 dark:text-white">Collect Email Address</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="collectCompany"
                  checked={formData.collectCompany}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-900 dark:text-white">Collect Company Name</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="collectPosition"
                  checked={formData.collectPosition}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-900 dark:text-white">Collect Position/Title</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="allowPhoto"
                  checked={formData.allowPhoto}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-900 dark:text-white">Allow Photo Upload</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="allowVideo"
                  checked={formData.allowVideo}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-900 dark:text-white">Allow Video Upload</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="requireApproval"
                  checked={formData.requireApproval}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-900 dark:text-white">Require Manual Approval</span>
              </label>
            </div>
          </Card>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={loading || !formData.name}
              className="flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Creating...
                </>
              ) : (
                'Create Project'
              )}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push('/dashboard')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
