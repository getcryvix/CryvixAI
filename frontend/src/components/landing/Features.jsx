const features = [
  {
    title: 'AI Chat Assistant',
    description:
      'Get instant answers, brainstorm ideas, and solve problems with a conversational AI that understands your business context.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    gradient: 'from-cyan-500 to-blue-600',
  },
  {
    title: 'Email Writer',
    description:
      'Craft polished emails in seconds — from cold outreach to follow-ups — with the perfect tone for every recipient.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    title: 'Proposal Generator',
    description:
      'Win more clients with compelling, structured proposals tailored to your services, scope, and pricing.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    gradient: 'from-fuchsia-500 to-pink-600',
  },
  {
    title: 'Invoice Generator',
    description:
      'Create professional invoices with line items, tax calculations, and payment terms — ready to send in one click.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 14l6-6m-5.5 3.5h.01M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    ),
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    title: 'WhatsApp Reply Generator',
    description:
      'Respond to clients on WhatsApp with friendly, professional messages that match your brand voice instantly.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    gradient: 'from-green-500 to-emerald-600',
  },
  {
  title: 'YouTube Toolkit',
  description:
    'Generate viral titles, descriptions, hashtags, keywords and thumbnail prompts with AI in seconds.',
  icon: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M4 6h8a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z" />
    </svg>
  ),
  gradient: 'from-red-500 to-orange-600',
},
]

export default function Features() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent-cyan">
            Features
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Everything you need to{' '}
            <span className="gradient-text">move faster</span>
          </h2>
          <p className="mt-4 text-lg text-white/60">
            Powerful AI tools for chat, writing, image generation, image analysis,
invoices, proposals, WhatsApp replies and YouTube content—
everything you need to grow your business faster.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="group glass-hover rounded-2xl p-6 sm:p-8"
            >
              <div
                className={`inline-flex rounded-xl bg-gradient-to-br ${feature.gradient} p-3 text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}
              >
                {feature.icon}
              </div>
              <h3 className="mt-5 text-lg font-semibold text-white">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/55">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
