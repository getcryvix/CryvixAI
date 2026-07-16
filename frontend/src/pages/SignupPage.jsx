import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

export default function SignupPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    if (!isSupabaseConfigured) {
      setMessage({ type: 'error', text: 'Add your Supabase URL and anon key to continue.' })
      setLoading(false)
      return
    }

    if (form.password !== form.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' })
      setLoading(false)
      return
    }

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.fullName } },
    })

    setLoading(false)

    if (error) {
      setMessage({ type: 'error', text: error.message })
      return
    }

    if (data.session) {
      navigate('/dashboard', { replace: true })
      return
    }

    setMessage({
      type: 'success',
      text: 'Account created. Please check your inbox to confirm the email address before signing in.',
    })
  }

  return (
    <div className="min-h-screen bg-surface px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl space-y-6">
          <span className="inline-flex rounded-full border border-accent-violet/30 bg-accent-violet/10 px-3 py-1 text-sm font-medium text-accent-violet">
            Start free today
          </span>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Create your <span className="gradient-text">CryvixAI</span> account
          </h1>
          <p className="text-lg text-white/70">
            Build faster with secure AI workflows, collaboration tools, and an elegant workspace environment.
          </p>
        </div>

        <div className="glass w-full max-w-md rounded-3xl p-6 shadow-2xl shadow-black/40 sm:p-8">
          <div className="mb-6">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-white/40">Signup</p>
            <h2 className="mt-2 text-2xl font-semibold">Create your account</h2>
          </div>

          {message.text ? (
            <div
              className={`mb-4 rounded-2xl border px-4 py-3 text-sm ${
                message.type === 'error'
                  ? 'border-rose-400/30 bg-rose-500/10 text-rose-200'
                  : 'border-emerald-400/30 bg-emerald-500/10 text-emerald-200'
              }`}
            >
              {message.text}
            </div>
          ) : null}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-white/70">
              Full name
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-accent-cyan/60"
                placeholder="Alex Morgan"
              />
            </label>

            <label className="block text-sm font-medium text-white/70">
              Email
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-accent-cyan/60"
                placeholder="you@company.com"
              />
            </label>

            <label className="block text-sm font-medium text-white/70">
              Password
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-accent-cyan/60"
                placeholder="Create a secure password"
              />
            </label>

            <label className="block text-sm font-medium text-white/70">
              Confirm password
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-accent-cyan/60"
                placeholder="Confirm your password"
              />
            </label>

            <button type="submit" className="btn-primary w-full py-3" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <div className="mt-6 text-sm text-white/65">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-accent-cyan transition hover:text-accent-fuchsia">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
