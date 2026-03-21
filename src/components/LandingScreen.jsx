import { useEffect, useState } from 'react'

const ED = { fontFamily: "'Playfair Display', Georgia, serif" }

function ThinCircle({ size = 72 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 72 72" fill="none">
      <circle cx="36" cy="36" r="34" stroke="#1C1915" strokeWidth="1" strokeOpacity="0.22" />
      <line x1="24" y1="36" x2="48" y2="36" stroke="#1C1915" strokeWidth="1" strokeOpacity="0.22" />
    </svg>
  )
}

function WaveGlyph() {
  return (
    <svg width="52" height="26" viewBox="0 0 52 26" fill="none">
      <path
        d="M1 13 Q8 1 15 13 Q22 25 29 13 Q36 1 43 13 Q50 25 57 13"
        stroke="#1C1915" strokeWidth="1.2" strokeOpacity="0.22" fill="none"
      />
    </svg>
  )
}

function SmallCircle() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="8" stroke="#1C1915" strokeWidth="1" strokeOpacity="0.22" />
    </svg>
  )
}

export default function LandingScreen({ onStart }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="relative flex flex-col min-h-dvh bg-[#E8E3DB] overflow-hidden">

      {/* Clay blob decoration — behind everything */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 280,
          height: 280,
          borderRadius: '62% 38% 54% 46% / 48% 56% 44% 52%',
          background: 'radial-gradient(ellipse at 36% 34%, #DDD3C4 0%, #C8B09A 48%, #B09278 100%)',
          top: '38%',
          left: '50%',
          transform: 'translate(-44%, -50%)',
          opacity: 0.9,
        }}
      />

      {/* Top bar */}
      <div className="relative flex items-start justify-between px-6 pt-8">
        <div style={{ ...ED, fontStyle: 'italic', fontSize: 15, color: '#1C1915', opacity: 0.7 }}>
          Ground Up
        </div>
        <ThinCircle size={68} />
      </div>

      {/* Main editorial headline */}
      <div
        className="relative flex-1 flex flex-col justify-center px-6 pb-4"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(18px)',
          transition: 'opacity 0.75s ease, transform 0.75s ease',
        }}
      >
        <div style={ED}>
          <div style={{ fontSize: 20, fontStyle: 'italic', fontWeight: 400, color: '#1C1915', opacity: 0.75, marginBottom: 2 }}>
            find what
          </div>
          <div style={{ fontSize: 76, fontWeight: 900, lineHeight: 0.88, color: '#1C1915', letterSpacing: '-2px' }}>
            YOU'RE
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 4 }}>
            <span style={{ fontSize: 38, fontStyle: 'italic', fontWeight: 400, color: '#1C1915', opacity: 0.75 }}>
              built
            </span>
            <span style={{ fontSize: 76, fontWeight: 900, lineHeight: 0.88, color: '#1C1915', letterSpacing: '-2px' }}>
              FOR.
            </span>
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div
        className="relative px-6 pb-10 flex flex-col gap-4"
        style={{
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.9s ease 0.2s',
        }}
      >
        {/* Tagline + wave row */}
        <div className="flex items-end justify-between mb-1">
          <p style={{ fontSize: 12, fontStyle: 'italic', color: '#1C1915', opacity: 0.45, maxWidth: 200, lineHeight: 1.6, ...ED }}>
            "A 10-minute career clarity experience built on how you actually think."
          </p>
          <div className="flex flex-col items-end gap-2">
            <WaveGlyph />
            <SmallCircle />
          </div>
        </div>

        {/* Step pills */}
        <div className="flex gap-3 mb-2">
          {[
            ['01', '30 reactions'],
            ['02', '10 choices'],
            ['03', 'Your DNA'],
          ].map(([n, label]) => (
            <div
              key={n}
              className="flex-1 rounded-2xl px-3 py-2.5"
              style={{ border: '1px solid rgba(28,25,21,0.12)' }}
            >
              <div style={{ fontSize: 11, color: '#1C1915', opacity: 0.3, ...ED, fontStyle: 'italic', marginBottom: 2 }}>
                {n}
              </div>
              <div style={{ fontSize: 11, color: '#1C1915', opacity: 0.65, fontWeight: 500 }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={onStart}
          className="w-full py-4 rounded-full font-bold text-base tracking-wide active:scale-95 transition-transform"
          style={{
            border: '2px solid #1C1915',
            color: '#1C1915',
            background: 'transparent',
            letterSpacing: '0.06em',
          }}
        >
          Start Building →
        </button>

        <p style={{ textAlign: 'center', fontSize: 11, color: '#1C1915', opacity: 0.3 }}>
          No sign-up required · Takes ~10 minutes
        </p>
      </div>
    </div>
  )
}
