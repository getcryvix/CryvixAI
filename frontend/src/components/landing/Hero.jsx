export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-accent-violet/20 blur-[120px] animate-pulse-glow" />
        <div className="absolute top-20 right-1/4 h-[400px] w-[400px] rounded-full bg-accent-cyan/15 blur-[100px] animate-float-slow" />
        <div className="absolute bottom-0 left-1/2 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-accent-fuchsia/10 blur-[100px] animate-float-delayed" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-sm text-white/70">
            <span className="h-2 w-2 rounded-full bg-accent-cyan animate-pulse" />
            AI-powered tools for freelancers &amp; small teams
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            Work smarter with{' '}
            <span className="gradient-text">CryvixAI</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/60 sm:text-xl">
            Generate emails, proposals, invoices, WhatsApp replies, and social posts
            in seconds. One platform with powerful AI tools for chat, writing, images, invoices, proposals, YouTube content and much more.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href="#pricing" className="btn-primary w-full sm:w-auto px-8 py-3.5 text-base">
              Start for Free
            </a>
            <a href="#features" className="btn-ghost w-full sm:w-auto px-8 py-3.5 text-base">
              Explore Features
            </a>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-4 sm:gap-8">
            {[
              { value: '8+', label: 'AI Tools' },
              { value: '10k+', label: 'Generations' },
              { value: '99%', label: 'Uptime' },
            ].map((stat) => (
              <div key={stat.label} className="glass rounded-2xl px-4 py-5 sm:px-6">
                <div className="text-2xl font-bold gradient-text sm:text-3xl">{stat.value}</div>
                <div className="mt-1 text-xs text-white/50 sm:text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto mt-16 max-w-5xl">
          <div className="glass rounded-3xl p-1 shadow-2xl shadow-accent-violet/10">
            <div className="rounded-[1.35rem] bg-surface-raised/80 p-6 sm:p-8">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-400/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-400/80" />
                <div className="h-3 w-3 rounded-full bg-green-400/80" />
                <span className="ml-3 text-xs text-white/40">CryvixAI Dashboard</span>
              </div>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="h-8 w-8 shrink-0 rounded-lg bg-gradient-to-br from-accent-cyan to-accent-violet" />
                  <div className="glass flex-1 rounded-xl px-4 py-3 text-sm text-white/70">
                    Write a professional follow-up email for a client proposal...
                  </div>
                </div>
                <div className="flex gap-3 justify-end">
                  <div className="glass max-w-md rounded-xl px-4 py-3 text-sm text-white/90">
                    Subject: Following Up on Our Proposal — Next Steps
                    <br /><br />
                    Hi Sarah, I hope this message finds you well. I wanted to follow up on the proposal we shared last week...
                  </div>
                  <div className="h-8 w-8 shrink-0 rounded-lg bg-white/10" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
