'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { 
  ArrowLeft, Loader2, Save, Trash2, AlertTriangle 
} from 'lucide-react'
import { Button, Input, Label, Card } from '@/components/ui'

export default function ProjectSettingsPage({ params }) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [activeTab, setActiveTab] = useState('basic')

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    active: true,
    // Form settings
    collectEmail: true,
    collectCompany: true,
    collectPosition: true,
    allowVideo: true,
    allowPhoto: true,
    requireApproval: true,
    // Widget settings
    layout: 'carousel',
    primaryColor: '#2563eb',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    fontFamily: 'Inter',
    showRatings: true,
    showPhotos: true,
    showCompany: true,
    maxTestimonials: 10,
  })

  useEffect(() => {
    if (status === 'authenticated') {
      fetchProject()
    }
  }, [status, params.id])

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${params.id}`)
      const data = await response.json()
      
      if (data.success) {
        setProject(data.project)
        setFormData({
          name: data.project.name,
          description: data.project.description || '',
          website: data.project.website || '',
          active: data.project.active,
          // Form settings
          collectEmail: data.project.formSettings?.collectEmail ?? true,
          collectCompany: data.project.formSettings?.collectCompany ?? true,
          collectPosition: data.project.formSettings?.collectPosition ?? true,
          allowVideo: data.project.formSettings?.allowVideo ?? true,
          allowPhoto: data.project.formSettings?.allowPhoto ?? true,
          requireApproval: data.project.formSettings?.requireApproval ?? true,
          // Widget settings
          layout: data.project.widgetSettings?.layout || 'carousel',
          primaryColor: data.project.widgetSettings?.theme?.primaryColor || '#2563eb',
          backgroundColor: data.project.widgetSettings?.theme?.backgroundColor || '#ffffff',
          textColor: data.project.widgetSettings?.theme?.textColor || '#1f2937',
          fontFamily: data.project.widgetSettings?.theme?.fontFamily || 'Inter',
          showRatings: data.project.widgetSettings?.showRatings ?? true,
          showPhotos: data.project.widgetSettings?.showPhotos ?? true,
          showCompany: data.project.widgetSettings?.showCompany ?? true,
          maxTestimonials: data.project.widgetSettings?.maxTestimonials || 10,
        })
      }
    } catch (error) {
      console.error('Error fetching project:', error)
      setError('Failed to load project')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const updateData = {
        name: formData.name,
        description: formData.description,
        website: formData.website,
        active: formData.active,
        formSettings: {
          collectEmail: formData.collectEmail,
          collectCompany: formData.collectCompany,
          collectPosition: formData.collectPosition,
          allowVideo: formData.allowVideo,
          allowPhoto: formData.allowPhoto,
          requireApproval: formData.requireApproval,
        },
        widgetSettings: {
          layout: formData.layout,
          theme: {
            primaryColor: formData.primaryColor,
            backgroundColor: formData.backgroundColor,
            textColor: formData.textColor,
            fontFamily: formData.fontFamily,
          },
          showRatings: formData.showRatings,
          showPhotos: formData.showPhotos,
          showCompany: formData.showCompany,
          maxTestimonials: parseInt(formData.maxTestimonials),
        },
      }

      const response = await fetch(`/api/projects/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update project')
      }

      setSuccess('Project updated successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('⚠️ WARNING: This will permanently delete this project and ALL its testimonials. This action cannot be undone!\n\nType the project name to confirm deletion.')) {
      return
    }

    const confirmation = prompt(`Please type "${project.name}" to confirm deletion:`)
    if (confirmation !== project.name) {
      alert('Project name does not match. Deletion cancelled.')
      return
    }

    setDeleting(true)
    try {
      const response = await fetch(`/api/projects/${params.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.push('/dashboard')
      } else {
        throw new Error('Failed to delete project')
      }
    } catch (error) {
      console.error('Error deleting project:', error)
      setError('Failed to delete project')
      setDeleting(false)
    }
  }

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow">
        <div className="container mx-auto px-4 py-4">
          <Link 
            href={`/dashboard/projects/${params.id}`} 
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition"
          >
            <ArrowLeft size={20} />
            <span className="font-semibold">Back to Project</span>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold mb-2">Project Settings</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Configure your project settings and customize the testimonial collection experience
        </p>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('basic')}
            className={`px-6 py-3 font-semibold transition border-b-2 ${
              activeTab === 'basic'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            Basic Info
          </button>
          <button
            onClick={() => setActiveTab('form')}
            className={`px-6 py-3 font-semibold transition border-b-2 ${
              activeTab === 'form'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            Form Settings
          </button>
          <button
            onClick={() => setActiveTab('widget')}
            className={`px-6 py-3 font-semibold transition border-b-2 ${
              activeTab === 'widget'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            Widget Design
          </button>
          <button
            onClick={() => setActiveTab('danger')}
            className={`px-6 py-3 font-semibold transition border-b-2 ${
              activeTab === 'danger'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            Danger Zone
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Basic Info Tab */}
          {activeTab === 'basic' && (
            <Card className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Basic Information</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Update your project's basic details
                </p>
              </div>

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

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="active"
                    checked={formData.active}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-gray-900 dark:text-white font-medium">Active Project</span>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Inactive projects won't accept new testimonials
                    </p>
                  </div>
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={saving} className="flex items-center gap-2">
                  {saving ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </Card>
          )}

          {/* Form Settings Tab */}
          {activeTab === 'form' && (
            <Card className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Form Collection Settings</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Choose what information to collect from your customers
                </p>
              </div>

              <div className="space-y-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="collectEmail"
                    checked={formData.collectEmail}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
                  />
                  <div>
                    <span className="text-gray-900 dark:text-white font-medium">Collect Email Address</span>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Request the customer's email for follow-up
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="collectCompany"
                    checked={formData.collectCompany}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
                  />
                  <div>
                    <span className="text-gray-900 dark:text-white font-medium">Collect Company Name</span>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Show where they work to add credibility
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="collectPosition"
                    checked={formData.collectPosition}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
                  />
                  <div>
                    <span className="text-gray-900 dark:text-white font-medium">Collect Position/Title</span>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Display their job title or role
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="allowPhoto"
                    checked={formData.allowPhoto}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
                  />
                  <div>
                    <span className="text-gray-900 dark:text-white font-medium">Allow Photo Upload</span>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Let customers upload their photo
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="allowVideo"
                    checked={formData.allowVideo}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
                  />
                  <div>
                    <span className="text-gray-900 dark:text-white font-medium">Allow Video Upload</span>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Accept video testimonials (more engaging!)
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="requireApproval"
                    checked={formData.requireApproval}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
                  />
                  <div>
                    <span className="text-gray-900 dark:text-white font-medium">Require Manual Approval</span>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Review testimonials before they appear publicly
                    </p>
                  </div>
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={saving} className="flex items-center gap-2">
                  {saving ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </Card>
          )}

          {/* Widget Design Tab */}
          {activeTab === 'widget' && (
            <Card className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Widget Design & Display</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Customize how testimonials appear on your website
                </p>
              </div>

              <div>
                <Label htmlFor="layout">Widget Layout</Label>
                <select
                  id="layout"
                  name="layout"
                  value={formData.layout}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="carousel">Carousel (Slideshow)</option>
                  <option value="grid">Grid Layout</option>
                  <option value="cards">Card Layout</option>
                  <option value="list">List View</option>
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      id="primaryColor"
                      name="primaryColor"
                      value={formData.primaryColor}
                      onChange={handleChange}
                      className="h-10 w-20 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={formData.primaryColor}
                      onChange={(e) => setFormData(prev => ({ ...prev, primaryColor: e.target.value }))}
                      placeholder="#2563eb"
                      maxLength={7}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="backgroundColor">Background Color</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      id="backgroundColor"
                      name="backgroundColor"
                      value={formData.backgroundColor}
                      onChange={handleChange}
                      className="h-10 w-20 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={formData.backgroundColor}
                      onChange={(e) => setFormData(prev => ({ ...prev, backgroundColor: e.target.value }))}
                      placeholder="#ffffff"
                      maxLength={7}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="textColor">Text Color</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      id="textColor"
                      name="textColor"
                      value={formData.textColor}
                      onChange={handleChange}
                      className="h-10 w-20 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={formData.textColor}
                      onChange={(e) => setFormData(prev => ({ ...prev, textColor: e.target.value }))}
                      placeholder="#1f2937"
                      maxLength={7}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="fontFamily">Font Family</Label>
                  <select
                    id="fontFamily"
                    name="fontFamily"
                    value={formData.fontFamily}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="Inter">Inter</option>
                    <option value="Arial">Arial</option>
                    <option value="Helvetica">Helvetica</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Courier New">Courier New</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="maxTestimonials">Maximum Testimonials to Display</Label>
                <Input
                  id="maxTestimonials"
                  name="maxTestimonials"
                  type="number"
                  min="1"
                  max="50"
                  value={formData.maxTestimonials}
                  onChange={handleChange}
                />
                <p className="text-sm text-gray-500 mt-1">
                  How many testimonials to show in the widget
                </p>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="showRatings"
                    checked={formData.showRatings}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-900 dark:text-white">Show Star Ratings</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="showPhotos"
                    checked={formData.showPhotos}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-900 dark:text-white">Show Customer Photos</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="showCompany"
                    checked={formData.showCompany}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-900 dark:text-white">Show Company Names</span>
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={saving} className="flex items-center gap-2">
                  {saving ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      Save Changes
                    </>
                  )}
                </Button>
                <Link href={`/dashboard/projects/${params.id}/embed`}>
                  <Button type="button" variant="secondary">
                    Preview Widget
                  </Button>
                </Link>
              </div>
            </Card>
          )}

          {/* Danger Zone Tab */}
          {activeTab === 'danger' && (
            <Card className="border-2 border-red-200 dark:border-red-800">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-lg">
                  <AlertTriangle className="text-red-600 dark:text-red-400" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-red-600 dark:text-red-400 mb-2">
                    Danger Zone
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Irreversible and destructive actions
                  </p>
                </div>
              </div>

              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-2">Delete This Project</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Once you delete a project, there is no going back. This will permanently delete:
                </p>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-6 space-y-1">
                  <li>All project data and settings</li>
                  <li>All testimonials ({project.stats?.totalSubmissions || 0} testimonials)</li>
                  <li>The shareable form link</li>
                  <li>All widget configurations</li>
                </ul>
                <Button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={20} />
                      Delete Project
                    </>
                  )}
                </Button>
              </div>
            </Card>
          )}
        </form>
      </div>
    </div>
  )
}
