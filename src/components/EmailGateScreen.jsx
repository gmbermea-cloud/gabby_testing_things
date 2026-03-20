import { useState } from 'react'

export default function EmailGateScreen({ onContinue, onSkip }) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!isValid) return
    setSubmitted(true)
    // TODO: wire up your email capture endpoint here
    // fetch('/api/subscribe', { method: 'POST', body: JSON.stringify({ email }) })
    setTimeout(() => onContinue(email), 600)
  }

  return (
    <div className="flex flex-col min-h-dvh bg-[#0D1B4B] px-6 items-center justify-center">
      <div className="w-full max-w-sm flex flex-col items-center gap-8 text-center">

        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-[#C9A84C]/15 border border-[#C9A84C]/30 flex items-center justify-center text-3xl">
          📬
        </div>

        <div>
          <h2 className="text-white text-3xl font-black leading-tight">
            Get your full report
          </h2>
          <p className="text-white/50 text-base mt-3 leading-relaxed">
            Enter your email and we'll send you a deeper breakdown of your career profile — including resources and next steps.
          </p>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-2xl">
              ✓
            </div>
            <p className="text-emerald-400 font-bold">Got it! Loading your results…</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full bg-white/8 border border-white/15 rounded-2xl px-5 py-4 text-white placeholder-white/30
                         focus:outline-none focus:border-[#C9A84C]/60 focus:bg-white/10 transition-all text-base"
              autoComplete="email"
              inputMode="email"
            />
            <button
              type="submit"
              disabled={!isValid}
              className={`w-full py-4 rounded-2xl font-black text-lg transition-all
                ${isValid
                  ? 'bg-[#C9A84C] text-[#0D1B4B] active:scale-95 shadow-lg shadow-[#C9A84C]/20'
                  : 'bg-white/10 text-white/30 cursor-not-allowed'}`}
            >
              Send My Results
            </button>
          </form>
        )}

        <button
          onClick={() => onSkip()}
          className="text-white/30 text-sm underline underline-offset-4 active:text-white/60 transition-colors"
        >
          Skip and see results now →
        </button>

        <p className="text-white/20 text-xs leading-relaxed">
          No spam. Unsubscribe anytime. Your data is never sold.
        </p>
      </div>
    </div>
  )
}
