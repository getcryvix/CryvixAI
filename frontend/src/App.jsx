import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import DashboardPage from './pages/DashboardPage'
import AIChatPage from './pages/AIChatPage'
import ImagePage from './pages/ImagePage'
import AIWriterPage from './pages/AIWriterPage'
import { supabase } from './lib/supabase'

function ProtectedRoute({ children, session, loading }) {
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface px-4 text-white">
        <div className="glass rounded-3xl px-8 py-6 text-center shadow-2xl shadow-black/40">
          <p className="text-sm uppercase tracking-[0.3em] text-white/40">Loading</p>
          <p className="mt-2 text-lg font-semibold">Checking your session...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return children
}

function PublicRoute({ children, session, loading }) {
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface px-4 text-white">
        <div className="glass rounded-3xl px-8 py-6 text-center shadow-2xl shadow-black/40">
          <p className="text-sm uppercase tracking-[0.3em] text-white/40">Loading</p>
          <p className="mt-2 text-lg font-semibold">Preparing your workspace...</p>
        </div>
      </div>
    )
  }

  if (session) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const initializeAuth = async () => {
      const {
  data: { session: currentSession },
} = await supabase.auth.getSession()
  

      if (isMounted) {
        setSession(currentSession)
        setLoading(false)
      }
    }

    initializeAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (isMounted) {
        setSession(currentSession)
        setLoading(false)
      }
    })

    return () => {
      isMounted = false
      subscription?.unsubscribe?.()
    }
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={
            <PublicRoute session={session} loading={loading}>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute session={session} loading={loading}>
              <SignupPage />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute session={session} loading={loading}>
              <ForgotPasswordPage />
            </PublicRoute>
          }
        />
        <Route
  path="/dashboard"
  element={
    <ProtectedRoute session={session} loading={loading}>
      <DashboardPage session={session} />
    </ProtectedRoute>
  }
/>

<Route path="/ai-chat" element={<AIChatPage />} />
<Route path="/image" element={<ImagePage />} />
<Route path="/ai-writer" element={<AIWriterPage />} />

<Route path="*" element={<Navigate to="/" replace />} />

</Routes>
    </BrowserRouter>
  )
}
