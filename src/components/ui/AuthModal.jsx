import React, { useState, useEffect } from 'react'
import { X, Mail, Lock, User, ShieldCheck, Loader2 } from 'lucide-react'
import useEditorStore from '@/store/editorStore'
import { Button } from './button'
import { Input } from './input'
import { Label } from './label'

export default function AuthModal() {
  const { authModalOpen, setAuthModalOpen, login } = useEditorStore()
  const [activeTab, setActiveTab] = useState('signin') // Default to Sign In
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')
  const [error, setError] = useState('')

  if (!authModalOpen) return null

  const handleEmailAuth = (e, type) => {
    e.preventDefault()
    setError('')
    if (!email || !password || (type === 'signup' && !name)) {
      setError('Please fill in all required fields.')
      return
    }

    setLoading(true)
    setLoadingMessage(type === 'signup' ? 'Creating your account...' : 'Logging you in...')
    setTimeout(() => {
      setLoading(false)
      login({ name: name || email.split('@')[0], email, role: 'premium' })
      setAuthModalOpen(false)
      resetForm()
    }, 1200)
  }

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setName('')
    setError('')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-[fadeIn_0.2s_ease-out]">
      <div className="relative w-full max-w-[440px] overflow-hidden rounded-3xl bg-white/95 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] border border-slate-200/80 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex flex-col px-8 pt-8 pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
                <ShieldCheck size={22} strokeWidth={2} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base leading-tight">BizCard Account</h3>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">Save, share and export premium designs</p>
              </div>
            </div>
            <button
              onClick={() => {
                setAuthModalOpen(false)
                resetForm()
              }}
              className="rounded-full p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="px-8 mb-6">
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200/40">
            {[
              { id: 'signin', label: 'Sign In', icon: Mail },
              { id: 'signup', label: 'Sign Up', icon: User },
            ].map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id)
                    setError('')
                  }}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold rounded-xl transition-all duration-300 ${
                    isActive
                      ? 'bg-white text-indigo-600 shadow-sm border border-slate-100'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Icon size={14} strokeWidth={2} />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Modal Body */}
        <div className="px-8 pb-8 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mb-4" />
              <p className="text-sm font-semibold text-slate-700">{loadingMessage}</p>
              <div className="w-48 h-1 bg-slate-100 rounded-full mt-4 overflow-hidden relative">
                <div className="absolute top-0 left-0 h-full bg-indigo-600 rounded-full animate-[shimmer_1.5s_infinite]" style={{ width: '60%' }}></div>
              </div>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-5 rounded-2xl bg-rose-50 p-4 text-xs font-semibold text-rose-600 border border-rose-100">
                  {error}
                </div>
              )}

              {/* Sign In Tab */}
              {activeTab === 'signin' && (
                <form onSubmit={(e) => handleEmailAuth(e, 'signin')} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email" className="text-xs text-slate-600 font-bold uppercase tracking-wider pl-0.5">Email Address</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-11 rounded-xl border-slate-200 focus-visible:ring-indigo-500/25"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="signin-password" className="text-xs text-slate-600 font-bold uppercase tracking-wider pl-0.5">Password</Label>
                      <a href="#" className="text-[10px] text-indigo-600 hover:underline font-bold uppercase tracking-wide">Forgot password?</a>
                    </div>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11 rounded-xl border-slate-200 focus-visible:ring-indigo-500/25"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 h-11 rounded-xl font-semibold text-xs tracking-wider shadow-lg shadow-indigo-600/15 uppercase">
                    Sign In
                  </Button>
                </form>
              )}

              {/* Sign Up Tab */}
              {activeTab === 'signup' && (
                <form onSubmit={(e) => handleEmailAuth(e, 'signup')} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="text-xs text-slate-600 font-bold uppercase tracking-wider pl-0.5">Full Name</Label>
                    <Input
                      id="signup-name"
                      placeholder="Jane Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-11 rounded-xl border-slate-200 focus-visible:ring-indigo-500/25"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-xs text-slate-600 font-bold uppercase tracking-wider pl-0.5">Email Address</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="jane@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-11 rounded-xl border-slate-200 focus-visible:ring-indigo-500/25"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-xs text-slate-600 font-bold uppercase tracking-wider pl-0.5">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a strong password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11 rounded-xl border-slate-200 focus-visible:ring-indigo-500/25"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 h-11 rounded-xl font-semibold text-xs tracking-wider shadow-lg shadow-indigo-600/15 uppercase">
                    Create Premium Account
                  </Button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
      <style>{`
        @keyframes sweep {
          0%, 100% { top: 0%; opacity: 0.8; }
          50% { top: 100%; opacity: 0.8; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  )
}

