import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from 'react'

export default function DashboardPage({ session }) {

const [plan, setPlan] = useState('Loading...')

  useEffect(() => {
    const fetchPlan = async () => {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('plan, status')
        .eq('user_id', session?.user?.id)
        .maybeSingle()

      if (error) {
        console.error('Plan fetch error:', error)
        setPlan('Free')
        return
      }

      if (data?.status === 'active') {
        setPlan(data.plan || 'Free')
      } else {
        setPlan('Free')
      }
    }

    if (session?.user?.id) {
      fetchPlan()
    }
  }, [session?.user?.id])

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
      path: '/image',
    },
    {
      title: 'AI Writer',
      description: 'Create articles, captions, scripts and professional content.',
      icon: '✍️',
      path: '/ai-writer',
    },

    {
  title: 'Invoice Generator',
  description: 'Generate professional invoices in seconds.',
  icon: '🧾',
  path: '/invoice',
},
{
  title: 'WhatsApp Reply Generator',
  description: 'Create smart and professional WhatsApp replies instantly.',
  icon: '📱',
  path: '/whatsapp',
},
{
  title: "Proposal Generator",
  description: "Create professional business proposals in seconds.",
  icon: "📄",
  path: "/proposal",
},
    {
      title: 'Image Analyzer',
      description: 'Upload an image and let AI understand and analyze it.',
      icon: '🔍',
      path: "/image-analyzer",
    },

    {
  title: "YouTube Toolkit",
  description: "Generate viral titles, descriptions, hashtags, keywords and thumbnail prompts with AI.",
  icon: "🎥",
  path: "/youtube-toolkit",
},
    {
      title: 'AI Code Assistant',
      description: 'Generate, explain and fix code with artificial intelligence.',
      icon: '💻',
      path: "/ai-code",
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

              <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">

  <div className="glass rounded-2xl p-4">
    <p className="text-sm text-white/60">AI Tools</p>
    <h3 className="mt-2 text-3xl font-bold">8+</h3>
  </div>

  <div className="glass rounded-2xl p-4">
    <p className="text-sm text-white/60">Status</p>
    <h3 className="mt-2 text-2xl font-bold text-green-400">
      Online
    </h3>
  </div>

  <div className="glass rounded-2xl p-4">
    <p className="text-sm text-white/60">Plan</p>
    <h3 className="mt-2 text-2xl font-bold">
  {plan}
</h3>
  </div>

  <div className="glass rounded-2xl p-4">
    <p className="text-sm text-white/60">Version</p>
    <h3 className="mt-2 text-2xl font-bold">
      v1.0
    </h3>
  </div>

</div>
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