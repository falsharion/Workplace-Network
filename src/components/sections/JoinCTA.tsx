'use client'

import { useState } from 'react'

export function JoinCTA() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || loading) return
    setLoading(true)
    // Simple email capture — could POST to a Supabase function or Resend audience
    await new Promise((r) => setTimeout(r, 800))
    setSubmitted(true)
    setLoading(false)
  }

  return (
    <section
      className="py-16 sm:py-20 lg:py-24"
      style={{ backgroundColor: '#0B0E14' }}
    >
      <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
        <p
          className="text-xs font-bold uppercase tracking-widest mb-4"
          style={{ color: '#E8A33D' }}
        >
          READY TO START?
        </p>
        <h2 className="text-white font-bold  sm:text-3xl  mb-2 leading-tight">
          Join a Community of Christian Professionals <span className="font-extralight">  Committed to Growth, Purpose, and Impact</span>
        </h2>

        {submitted ? (
          <div className="bg-white/10 border border-white/20 rounded-2xl px-6 py-4">
            <p className="text-white font-semibold">You&apos;re on the list! 🎉</p>
            <p className="text-white/60 text-sm mt-1">We&apos;ll be in touch soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 px-4 py-3 rounded-full bg-white text-gray-900 text-sm placeholder-gray-400 outline-none focus:ring-2 focus:ring-gold"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-3 rounded-full font-bold text-sm text-navy whitespace-nowrap transition-opacity hover:opacity-90 disabled:opacity-60"
              style={{ backgroundColor: '#E8A33D', color: '#0B0E14' }}
            >
              {loading ? '…' : 'JOIN NOW'}
            </button>
          </form>
        )}

        <p className="text-white/30 text-xs mt-4">
          By joining you agree to our{' '}
          <a href="/terms" className="underline hover:text-white/60 transition-colors">Terms of Service</a>
          {' '}and{' '}
          <a href="/privacy" className="underline hover:text-white/60 transition-colors">Privacy Policy</a>
        </p>
      </div>
    </section>
  )
}
