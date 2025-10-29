'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { 
  ArrowLeft, Loader2, User, Bell, Shield, 
  Mail, Key, Trash2, CheckCircle, AlertTriangle,
  Eye, EyeOff, Save
} from 'lucide-react'

export default function SettingsPage() {
  const router = useRouter()
  const { data: session, status, update } = useSession()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [message, setMessage] = useState({ type: '', text: '' })
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState('')

  // Profile settings
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    currentName: '',
    currentEmail: ''
  })

  // Password settings
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailOnNewTestimonial: true,
    emailOnApproval: false,
    emailWeeklyReport: true,
    emailMonthlyReport: false
  })

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      setProfileData({
        name: session.user.name || '',
        email: session.user.email || '',
        currentName: session.user.name || '',
        currentEmail: session.user.email || ''
      })
      fetchNotificationSettings()
      setLoading(false)
    }
  }, [status, session])

  const fetchNotificationSettings = async () => {
    try {
      const response = await fetch('/api/user/notifications')
      const data = await response.json()
      
      if (data.success && data.notificationSettings) {
        setNotificationSettings(data.notificationSettings)
      }
    } catch (error) {
      console.error('Error fetching notification settings:', error)
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

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage({ type: '', text: '' })

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profileData.name,
          email: profileData.email
        })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' })
        setProfileData(prev => ({
          ...prev,
          currentName: prev.name,
          currentEmail: prev.email
        }))
        // Update session
        await update({
          ...session,
          user: {
            ...session.user,
            name: profileData.name,
            email: profileData.email
          }
        })
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update profile' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred' })
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage({ type: '', text: '' })

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' })
      setSaving(false)
      return
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' })
      setSaving(false)
      return
    }

    try {
      const response = await fetch('/api/user/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: 'Password changed successfully!' })
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to change password' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred' })
    } finally {
      setSaving(false)
    }
  }

  const handleNotificationUpdate = async () => {
    setSaving(true)
    setMessage({ type: '', text: '' })

    try {
      const response = await fetch('/api/user/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notificationSettings)
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: 'Notification preferences saved!' })
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update preferences' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred' })
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAccount = async (e) => {
    e.preventDefault()
    
    if (deleteConfirm !== 'DELETE') {
      setMessage({ type: 'error', text: 'Please type DELETE to confirm' })
      return
    }

    if (!confirm('Are you absolutely sure? This action cannot be undone. All your projects and testimonials will be permanently deleted.')) {
      return
    }

    setSaving(true)
    setMessage({ type: '', text: '' })

    try {
      const response = await fetch('/api/user/account', {
        method: 'DELETE'
      })

      const data = await response.json()

      if (response.ok) {
        await signOut({ callbackUrl: '/' })
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to delete account' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred' })
    } finally {
      setSaving(false)
    }
  }

  const hasProfileChanges = profileData.name !== profileData.currentName || 
                           profileData.email !== profileData.currentEmail

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
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Settings</h1>
          <p className="text-slate-400 text-base">
            Manage your account preferences and settings
          </p>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div className={`mb-6 px-4 py-3 rounded-xl border font-semibold flex items-center gap-2 ${
            message.type === 'success' 
              ? 'bg-green-500/10 border-green-500/20 text-green-400' 
              : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}>
            {message.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 rounded-2xl p-4 shadow-2xl">
              <nav className="space-y-2">
                <TabButton
                  icon={<User size={18} />}
                  label="Profile"
                  active={activeTab === 'profile'}
                  onClick={() => setActiveTab('profile')}
                />
                <TabButton
                  icon={<Key size={18} />}
                  label="Password"
                  active={activeTab === 'password'}
                  onClick={() => setActiveTab('password')}
                />
                <TabButton
                  icon={<Bell size={18} />}
                  label="Notifications"
                  active={activeTab === 'notifications'}
                  onClick={() => setActiveTab('notifications')}
                />
                <TabButton
                  icon={<Shield size={18} />}
                  label="Security"
                  active={activeTab === 'security'}
                  onClick={() => setActiveTab('security')}
                />
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 rounded-2xl p-8 shadow-2xl">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
                    <User size={24} />
                    Profile Information
                  </h2>
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-bold text-white mb-2">
                        Full Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-white/30 focus:outline-none transition font-medium"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-bold text-white mb-2">
                        Email Address
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-white/30 focus:outline-none transition font-medium"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={saving || !hasProfileChanges}
                      className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
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
                    </button>
                  </form>
                </div>
              )}

              {/* Password Tab */}
              {activeTab === 'password' && (
                <div>
                  <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
                    <Key size={24} />
                    Change Password
                  </h2>
                  <form onSubmit={handlePasswordChange} className="space-y-6">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-bold text-white mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          id="currentPassword"
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-white/30 focus:outline-none transition font-medium pr-12"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                        >
                          {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-bold text-white mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          id="newPassword"
                          type={showNewPassword ? 'text' : 'password'}
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-white/30 focus:outline-none transition font-medium pr-12"
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                        >
                          {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                      <p className="text-slate-500 text-sm mt-1">Minimum 6 characters</p>
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-bold text-white mb-2">
                        Confirm New Password
                      </label>
                      <input
                        id="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-white/30 focus:outline-none transition font-medium"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="animate-spin" size={20} />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Key size={20} />
                          Update Password
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
                    <Bell size={24} />
                    Notification Preferences
                  </h2>
                  <div className="space-y-6">
                    <p className="text-slate-400">
                      Choose what notifications you want to receive via email.
                    </p>

                    <NotificationToggle
                      icon={<Mail size={20} />}
                      label="New Testimonial"
                      description="Get notified when someone submits a new testimonial"
                      checked={notificationSettings.emailOnNewTestimonial}
                      onChange={(checked) => setNotificationSettings({ 
                        ...notificationSettings, 
                        emailOnNewTestimonial: checked 
                      })}
                    />

                    <NotificationToggle
                      icon={<CheckCircle size={20} />}
                      label="Testimonial Approved"
                      description="Get notified when you approve a testimonial"
                      checked={notificationSettings.emailOnApproval}
                      onChange={(checked) => setNotificationSettings({ 
                        ...notificationSettings, 
                        emailOnApproval: checked 
                      })}
                    />

                    <NotificationToggle
                      icon={<Mail size={20} />}
                      label="Weekly Report"
                      description="Receive a weekly summary of your testimonials"
                      checked={notificationSettings.emailWeeklyReport}
                      onChange={(checked) => setNotificationSettings({ 
                        ...notificationSettings, 
                        emailWeeklyReport: checked 
                      })}
                    />

                    <NotificationToggle
                      icon={<Mail size={20} />}
                      label="Monthly Report"
                      description="Receive a monthly analytics report"
                      checked={notificationSettings.emailMonthlyReport}
                      onChange={(checked) => setNotificationSettings({ 
                        ...notificationSettings, 
                        emailMonthlyReport: checked 
                      })}
                    />

                    <button
                      onClick={handleNotificationUpdate}
                      disabled={saving}
                      className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="animate-spin" size={20} />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={20} />
                          Save Preferences
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div>
                  <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
                    <Shield size={24} />
                    Security & Account
                  </h2>
                  
                  <div className="space-y-8">
                    {/* Account Info */}
                    <div className="border border-white/10 rounded-xl p-6 bg-black/20">
                      <h3 className="text-lg font-bold text-white mb-4">Account Information</h3>
                      <div className="space-y-3 text-slate-300">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Account Created:</span>
                          <span className="font-semibold">{new Date(session.user.createdAt || Date.now()).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Account ID:</span>
                          <span className="font-mono text-sm">{session.user.id || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Delete Account */}
                    <div className="border border-red-500/20 rounded-xl p-6 bg-red-500/5">
                      <h3 className="text-lg font-bold text-red-400 mb-2 flex items-center gap-2">
                        <Trash2 size={20} />
                        Danger Zone
                      </h3>
                      <p className="text-slate-400 mb-4">
                        Once you delete your account, there is no going back. All your projects, 
                        testimonials, and data will be permanently deleted.
                      </p>
                      
                      <form onSubmit={handleDeleteAccount} className="space-y-4">
                        <div>
                          <label htmlFor="deleteConfirm" className="block text-sm font-bold text-white mb-2">
                            Type <span className="text-red-400">DELETE</span> to confirm
                          </label>
                          <input
                            id="deleteConfirm"
                            type="text"
                            value={deleteConfirm}
                            onChange={(e) => setDeleteConfirm(e.target.value)}
                            className="w-full px-4 py-3 bg-black/40 border border-red-500/30 rounded-xl text-white placeholder-slate-500 focus:border-red-500/50 focus:outline-none transition font-medium"
                            placeholder="DELETE"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={saving || deleteConfirm !== 'DELETE'}
                          className="px-6 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {saving ? (
                            <>
                              <Loader2 className="animate-spin" size={20} />
                              Deleting...
                            </>
                          ) : (
                            <>
                              <Trash2 size={20} />
                              Delete Account Permanently
                            </>
                          )}
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TabButton({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
        active
          ? 'bg-white text-black'
          : 'text-slate-400 hover:bg-white/5 hover:text-white'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}

function NotificationToggle({ icon, label, description, checked, onChange }) {
  return (
    <div className="flex items-start justify-between border border-white/10 rounded-xl p-4 bg-black/20">
      <div className="flex gap-3">
        <div className="text-slate-400 mt-1">
          {icon}
        </div>
        <div>
          <h4 className="font-bold text-white mb-1">{label}</h4>
          <p className="text-sm text-slate-400">{description}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? 'bg-white' : 'bg-white/20'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full transition-transform ${
            checked ? 'translate-x-6 bg-black' : 'translate-x-1 bg-white'
          }`}
        />
      </button>
    </div>
  )
}
