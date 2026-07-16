import { useState } from 'react'
import { Link } from 'react-router-dom'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    if (!isSupabaseConfigured) {
      setMessage({ type: 'error', text: 'Add your Supabase URL and anon key to continue.' })
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    })

    setLoading(false)

    if (error) {
      setMessage({ type: 'error', text: error.message })
      return
    }

    setMessage({
      type: 'success',
      text: 'Password reset instructions have been sent to your inbox.',
    })
  }

  return (
    <div className="min-h-screen bg-surface px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md">
        <div className="glass rounded-3xl p-6 shadow-2xl shadow-black/40 sm:p-8">
          <div className="mb-6">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-white/40">Reset password</p>
            <h2 className="mt-2 text-2xl font-semibold">Recover your account</h2>
            <p className="mt-3 text-sm text-white/70">
              Enter the email you use for CryvixAI and we will send recovery instructions.
            </p>
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
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-accent-cyan/60"
                placeholder="you@company.com"
              />
            </label>

            <button type="submit" className="btn-primary w-full py-3" disabled={loading}>
              {loading ? 'Sending...' : 'Send reset link'}
            </button>
          </form>

          <div className="mt-6 text-sm text-white/65">
            Remembered your password?{' '}
            <Link to="/login" className="font-medium text-accent-cyan transition hover:text-accent-fuchsia">
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
