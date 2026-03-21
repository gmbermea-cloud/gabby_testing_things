import { useState } from 'react'

const ED = { fontFamily: "'Playfair Display', Georgia, serif" }

export default function EmailGateScreen({ onContinue, onSkip }) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!isValid) return
    setSubmitted(true)
    // TODO: wire up your email capture endpoint here
    setTimeout(() => onContinue(email), 600)
  }

  return (
    <div className="flex flex-col min-h-dvh bg-[#E8E3DB] px-6 items-center justify-center fade-up">
      <div className="w-full max-w-sm flex flex-col items-center gap-8 text-center">

        {/* Decorative thin circle */}
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
          <circle cx="28" cy="28" r="26" stroke="#1C1915" strokeWidth="1" strokeOpacity="0.2" />
          <circle cx="28" cy="28" r="4" fill="#1C1915" fillOpacity="0.15" />
        </svg>

        <div>
          <h2 style={{ ...ED, fontSize: 32, fontWeight: 900, color: '#1C1915', lineHeight: 1.1 }}>
            Get your full report
          </h2>
          <p style={{ fontSize: 14, color: '#1C1915', opacity: 0.5, marginTop: 12, lineHeight: 1.65 }}>
            Enter your email and we'll send you a deeper breakdown of your career profile — including resources and next steps.
          </p>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center gap-3">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="22" stroke="#1C1915" strokeWidth="1.5" strokeOpacity="0.3" />
              <path d="M15 24l7 7 11-13" stroke="#1C1915" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.6" />
            </svg>
            <p style={{ ...ED, fontStyle: 'italic', fontSize: 16, color: '#1C1915', opacity: 0.6 }}>
              Got it. Loading your results…
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            <div style={{ borderBottom: '1.5px solid rgba(28,25,21,0.25)', paddingBottom: 10 }}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full bg-transparent focus:outline-none text-base"
                style={{ color: '#1C1915', fontSize: 16 }}
                autoComplete="email"
                inputMode="email"
              />
            </div>
            <button
              type="submit"
              disabled={!isValid}
              className="w-full py-4 rounded-full font-bold text-base tracking-wide active:scale-95 transition-all"
              style={{
                border: '2px solid #1C1915',
                color: isValid ? '#E8E3DB' : '#1C1915',
                background: isValid ? '#1C1915' : 'transparent',
                opacity: isValid ? 1 : 0.3,
                letterSpacing: '0.06em',
              }}
            >
              Send My Results
            </button>
          </form>
        )}

        <button
          onClick={() => onSkip()}
          style={{ fontSize: 12, color: '#1C1915', opacity: 0.35, textDecoration: 'underline', textUnderlineOffset: 4, ...ED, fontStyle: 'italic' }}
        >
          Skip and see results now →
        </button>

        <p style={{ fontSize: 11, color: '#1C1915', opacity: 0.25, lineHeight: 1.6 }}>
          No spam. Unsubscribe anytime. Your data is never sold.
        </p>
      </div>
    </div>
  )
}
