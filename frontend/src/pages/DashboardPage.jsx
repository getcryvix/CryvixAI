import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Sidebar from "../components/Sidebar";

export default function DashboardPage({ session }) {
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('/login', { replace: true })
  }

  const tools = [
    {
      title: 'AI Chat',
      description: 'Ask questions, generate ideas and get intelligent answers.',
      icon: '💬',
      path: '/ai-chat',
    },
    {
      title: 'AI Image Generator',
      description: 'Turn your imagination into stunning AI-generated images.',
      icon: '🎨',
    },
    {
      title: 'AI Writer',
      description: 'Create articles, captions, scripts and professional content.',
      icon: '✍️',
    },
    {
      title: 'Image Analyzer',
      description: 'Upload an image and let AI understand and analyze it.',
      icon: '🔍',
    },
    {
      title: 'AI Code Assistant',
      description: 'Generate, explain and fix code with artificial intelligence.',
      icon: '💻',
    },
    {
      title: 'More Tools Coming',
      description: 'New powerful AI tools will be added to CryvixAI.',
      icon: '⚡',
    },
  ]

  return (
    <div className="flex min-h-screen bg-surface text-white">
      <Sidebar />
      <div className="flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <div className="glass rounded-3xl p-6 shadow-black/40 sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="inline-flex rounded-full border border-accent-cyan/30 px-4 py-2 text-sm">
                CryvixAI Dashboard
              </span>

              <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">
                Welcome back,{' '}
                <span className="gradient-text">
                  {session?.user?.email}
                </span>
              </h1>

              <p className="mt-3 max-w-2xl text-white/70">
                Choose an AI tool and start creating with CryvixAI.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              className="btn-ghost"
            >
              Sign out
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <button
              key={tool.title}
              type="button"
              onClick={() => navigate(tool.path)}
              
              className="glass rounded-3xl p-6 text-left transition duration-300 hover:-translate-y-1"
            >
              <div className="text-4xl">{tool.icon}</div>

              <h2 className="mt-5 text-xl font-semibold">
                {tool.title}
              </h2>

              <p className="mt-3 text-sm leading-6 text-white/70">
                {tool.description}
              </p>

              <p className="mt-6 text-sm font-semibold">
                Open tool →
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}