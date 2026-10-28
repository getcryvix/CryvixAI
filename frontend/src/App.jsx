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
import InvoicePage from './pages/InvoicePage'
import WhatsAppPage from './pages/WhatsAppPage'
import ProposalPage from './pages/ProposalPage'
import HistoryPage from './pages/HistoryPage'
import ProfilePage from './pages/ProfilePage'
import ImageAnalyzerPage from './pages/ImageAnalyzerPage'
import YouTubeToolkitPage from './pages/YouTubeToolkitPage'
import AICodeAssistantPage from './pages/AICodeAssistantPage'
import EmailWriterPage from './pages/EmailWriterPage'
import ResumeBuilderPage from './pages/ResumeBuilderPage'
import CoverLetterPage from './pages/CoverLetterPage'
import PDFChatPage from './pages/PDFChatPage'
import VoiceToTextPage from './pages/VoiceToTextPage'
import TextToSpeechPage from './pages/TextToSpeechPage'
import TranslatorPage from './pages/TranslatorPage'
import DocumentSummarizerPage from './pages/DocumentSummarizerPage'
import SummarizerPage from './pages/SummarizerPage'
import PresentationGeneratorPage from './pages/PresentationGeneratorPage'
import WebsiteBuilderPage from './pages/WebsiteBuilderPage'
import ExcelFormulaPage from './pages/ExcelFormulaPage'
import GrammarRewriterPage from './pages/GrammarRewriterPage'
import PricingPage from './pages/PricingPage'
import PromptGeneratorPage from './pages/PromptGeneratorPage'
import ProjectsPage from './pages/ProjectsPage'
import OCRPage from './pages/OCRPage'
import { supabase } from './lib/supabase'

function ProtectedRoute({ children, session, loading }) {
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface px-4 text-white">
        <div className="glass rounded-3xl px-8 py-6 text-center shadow-2xl shadow-black/40">
          <p className="text-sm uppercase tracking-[0.3em] text-white/40">
            Loading
          </p>
          <p className="mt-2 text-lg font-semibold">
            Checking your session...
          </p>
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
          <p className="text-sm uppercase tracking-[0.3em] text-white/40">
            Loading
          </p>
          <p className="mt-2 text-lg font-semibold">
            Preparing your workspace...
          </p>
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

  const privatePage = (page) => (
    <ProtectedRoute session={session} loading={loading}>
      {page}
    </ProtectedRoute>
  )

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
          element={privatePage(<DashboardPage session={session} />)}
        />

        <Route
          path="/projects"
          element={privatePage(<ProjectsPage />)}
        />

        <Route path="/ai-chat" element={privatePage(<AIChatPage />)} />
        <Route path="/invoice" element={privatePage(<InvoicePage />)} />
        <Route path="/whatsapp" element={privatePage(<WhatsAppPage />)} />
        <Route path="/proposal" element={privatePage(<ProposalPage />)} />
        <Route path="/history" element={privatePage(<HistoryPage />)} />
        <Route path="/profile" element={privatePage(<ProfilePage />)} />

        <Route
          path="/image-analyzer"
          element={privatePage(<ImageAnalyzerPage />)}
        />

        <Route path="/image" element={privatePage(<ImagePage />)} />
        <Route path="/ai-writer" element={privatePage(<AIWriterPage />)} />

        <Route
          path="/youtube-toolkit"
          element={privatePage(<YouTubeToolkitPage />)}
        />

        <Route
          path="/ai-code"
          element={privatePage(<AICodeAssistantPage />)}
        />

        <Route
          path="/email-writer"
          element={privatePage(<EmailWriterPage />)}
        />

        <Route
          path="/resume-builder"
          element={privatePage(<ResumeBuilderPage />)}
        />

        <Route
          path="/cover-letter"
          element={privatePage(<CoverLetterPage />)}
        />

        <Route path="/pdf-chat" element={privatePage(<PDFChatPage />)} />

        <Route
          path="/voice-to-text"
          element={privatePage(<VoiceToTextPage />)}
        />

        <Route
          path="/text-to-speech"
          element={privatePage(<TextToSpeechPage />)}
        />

        <Route
          path="/translator"
          element={privatePage(<TranslatorPage />)}
        />

        <Route
          path="/document-summary"
          element={privatePage(<DocumentSummarizerPage />)}
        />

        <Route path="/ai-ocr" element={privatePage(<OCRPage />)} />

        <Route
          path="/summarizer"
          element={privatePage(<SummarizerPage />)}
        />

        <Route
          path="/presentation-generator"
          element={privatePage(<PresentationGeneratorPage />)}
        />

        <Route
          path="/website-builder"
          element={privatePage(<WebsiteBuilderPage />)}
        />

        <Route
          path="/excel-formula"
          element={privatePage(<ExcelFormulaPage />)}
        />

        <Route
          path="/grammar-rewriter"
          element={privatePage(<GrammarRewriterPage />)}
        />

        <Route path="/pricing" element={privatePage(<PricingPage />)} />

        <Route
          path="/prompt-generator"
          element={privatePage(<PromptGeneratorPage />)}
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}