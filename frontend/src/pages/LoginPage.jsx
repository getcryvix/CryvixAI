import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

export default function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
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

    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    })

    setLoading(false)

    if (error) {
      setMessage({ type: 'error', text: error.message })
      return
    }

    navigate('/dashboard', { replace: true })
  }

  const handleGoogleLogin = async () => {
    if (!isSupabaseConfigured) {
      setMessage({ type: 'error', text: 'Add your Supabase URL and anon key to continue.' })
      return
    }

    const redirectTo = `${window.location.origin}/dashboard`
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    })

    if (error) {
      setMessage({ type: 'error', text: error.message })
      return
    }

    if (data?.url) {
      window.location.href = data.url
    }
  }

  return (
    <div className="min-h-screen bg-surface px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl space-y-6">
          <span className="inline-flex rounded-full border border-accent-cyan/30 bg-accent-cyan/10 px-3 py-1 text-sm font-medium text-accent-cyan">
            Secure AI workspace access
          </span>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Welcome back to <span className="gradient-text">CryvixAI</span>
          </h1>
          <p className="text-lg text-white/70">
            Sign in to continue building faster with your private AI workspace, team tools, and insights.
          </p>
        </div>

        <div className="glass w-full max-w-md rounded-3xl p-6 shadow-2xl shadow-black/40 sm:p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-white/40">Login</p>
              <h2 className="mt-2 text-2xl font-semibold">Access your account</h2>
            </div>
            <Link to="/" className="text-sm text-accent-cyan transition hover:text-accent-fuchsia">
              Back home
            </Link>
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
              Email
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none ring-0 transition focus:border-accent-cyan/60"
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
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none ring-0 transition focus:border-accent-cyan/60"
                placeholder="Enter your password"
              />
            </label>

            <button type="submit" className="btn-primary w-full py-3" disabled={loading}>
              {loading ? 'Signing in...' : 'Log in'}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs uppercase tracking-[0.3em] text-white/40">Or continue with</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="btn-ghost flex w-full items-center justify-center gap-2"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M21.805 10.023h-9.16v3.955h5.24c-.226 1.27-.97 2.345-2.068 3.067v2.55h3.347c1.96-1.806 3.085-4.46 3.085-7.572 0-.718-.068-1.41-.244-2.0Z" />
              <path d="M12.645 22c2.8 0 5.153-.926 6.87-2.52l-3.347-2.55c-.926.621-2.112.987-3.522.987-2.71 0-5.005-1.83-5.827-4.292H3.392v2.694A10.004 10.004 0 0 0 12.645 22Z" />
              <path d="M6.818 12.625a5.99 5.99 0 0 1 0-3.82V6.11H3.392a10.003 10.003 0 0 0 0 13.03l3.426-2.694Z" />
              <path d="M12.645 6.22c1.53 0 2.9.525 3.976 1.556l2.98-2.98C17.79 3.123 15.437 2 12.645 2A10.003 10.003 0 0 0 3.392 6.11l3.426 2.694c.822-2.463 3.117-4.293 5.827-4.293Z" />
            </svg>
            Continue with Google
          </button>

          <div className="mt-6 flex flex-col gap-2 text-sm text-white/65 sm:flex-row sm:items-center sm:justify-between">
            <Link to="/signup" className="transition hover:text-white">
              Create an account
            </Link>
            <Link to="/forgot-password" className="transition hover:text-white">
              Forgot password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
