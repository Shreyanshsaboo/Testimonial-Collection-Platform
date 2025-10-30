'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react'

export default function SignInPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password')
        setLoading(false)
      } else if (result?.ok) {
        router.push('/dashboard')
        router.refresh()
      } else {
        setError('An unexpected error occurred')
        setLoading(false)
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Floating testimonial cards in background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-40 h-40 bg-slate-800/40 rounded-3xl backdrop-blur-sm border border-slate-700/30 p-6 rotate-[-15deg]">
          <div className="text-yellow-400 text-3xl mb-2">⭐</div>
          <p className="text-slate-400 text-sm">"Best tool!"</p>
        </div>
        
        <div className="absolute top-40 right-20 w-48 h-48 bg-slate-800/40 rounded-3xl backdrop-blur-sm border border-slate-700/30 p-6 rotate-[12deg]">
          <div className="flex gap-1 mb-2">
            <span className="text-yellow-400">⭐</span>
            <span className="text-yellow-400">⭐</span>
            <span className="text-yellow-400">⭐</span>
            <span className="text-yellow-400">⭐</span>
            <span className="text-yellow-400">⭐</span>
          </div>
          <p className="text-slate-500 text-xs">5.0 rating</p>
        </div>

        <div className="absolute bottom-32 left-16 w-44 h-44 bg-slate-800/40 rounded-3xl backdrop-blur-sm border border-slate-700/30 p-6 rotate-[8deg]">
          <p className="text-slate-300 text-sm mb-3">"Amazing!"</p>
          <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-slate-400 text-xs">
            JD
          </div>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="block text-center mb-8">
          <h1 className="text-2xl font-bold text-white hover:text-slate-300 transition-colors">
            Testimonial Manager
          </h1>
        </Link>

        {/* Sign In Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              Welcome Back
            </h2>
            <p className="text-slate-400">
              Sign in to manage your testimonials
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-black border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-black border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white hover:bg-slate-100 text-black font-semibold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-slate-900/80 text-slate-500">
                Don't have an account?
              </span>
            </div>
          </div>

          <Link href="/auth/signup" className="block mt-6">
            <button
              type="button"
              className="w-full bg-transparent hover:bg-slate-800 text-white font-semibold py-3.5 rounded-xl border border-slate-800 transition-all duration-200"
            >
              Create new account
            </button>
          </Link>
        </div>

        <p className="mt-6 text-center">
          <Link href="/" className="text-slate-500 hover:text-white transition-colors text-sm">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  )
}
