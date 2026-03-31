import { useEffect, useState } from 'react'

const TRACKS = [
  { label: 'Design',     color: '#C85A3F' },
  { label: 'Technical',  color: '#5B8FA3' },
  { label: 'Management', color: '#7A9B76' },
  { label: 'Business',   color: '#D4A574' },
]

export default function LandingScreen({ onStart, onCurriculum }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  return (
    <div
      className="flex flex-col min-h-dvh px-6 pt-10 pb-10"
      style={{ background: '#FAF7F0' }}
    >
      {/* Logo / wordmark */}
      <div
        style={{
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.6s ease',
        }}
      >
        <div
          className="serif"
          style={{
            fontSize: 15,
            color: '#1A1A1A',
            opacity: 0.4,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            fontStyle: 'italic',
          }}
        >
          ArchPath
        </div>
      </div>

      {/* Main headline */}
      <div
        className="flex-1 flex flex-col justify-center"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s',
        }}
      >
        <h1
          className="serif"
          style={{
            fontSize: 'clamp(48px, 13vw, 68px)',
            lineHeight: 1.0,
            fontWeight: 400,
            color: '#1A1A1A',
            letterSpacing: '-0.02em',
            marginBottom: 20,
          }}
        >
          Find your
          <br />
          architectural
          <br />
          <em>track.</em>
        </h1>

        <p
          style={{
            fontSize: 15,
            lineHeight: 1.7,
            color: '#1A1A1A',
            opacity: 0.6,
            maxWidth: 340,
          }}
        >
          30 instinct-based questions. No subject-matter expertise required.
          Just honest reactions to real workplace situations.
        </p>
      </div>

      {/* Bottom section */}
      <div
        style={{
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.7s ease 0.25s',
        }}
      >
        {/* Track pills */}
        <div className="flex gap-2 flex-wrap mb-8">
          {TRACKS.map(({ label, color }) => (
            <div
              key={label}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: 20,
                border: `1px solid ${color}40`,
                background: `${color}12`,
              }}
            >
              <div
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: color,
                }}
              />
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: '#1A1A1A',
                  opacity: 0.7,
                }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Meta info row */}
        <div className="flex gap-6 mb-7">
          {[
            ['30', 'questions'],
            ['~10', 'minutes'],
            ['4', 'career tracks'],
          ].map(([num, label]) => (
            <div key={label}>
              <div
                className="serif"
                style={{ fontSize: 22, color: '#1A1A1A', lineHeight: 1 }}
              >
                {num}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: '#1A1A1A',
                  opacity: 0.4,
                  marginTop: 2,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={onStart}
          className="w-full py-4 rounded-full font-semibold text-base active:scale-95 transition-transform"
          style={{
            background: '#1A1A1A',
            color: '#FAF7F0',
            fontSize: 15,
            letterSpacing: '0.03em',
          }}
        >
          Start Discovery →
        </button>

        <p
          style={{
            textAlign: 'center',
            fontSize: 11,
            color: '#1A1A1A',
            opacity: 0.3,
            marginTop: 12,
          }}
        >
          No sign-up required · Questions reveal instinct, not knowledge
        </p>

        <button
          onClick={onCurriculum}
          style={{
            display: 'block',
            width: '100%',
            marginTop: 18,
            background: 'none',
            border: '1px solid #1A1A1A18',
            borderRadius: 40,
            padding: '13px 24px',
            fontSize: 14,
            fontWeight: 500,
            color: '#1A1A1A',
            opacity: 0.65,
            cursor: 'pointer',
            letterSpacing: '0.02em',
            fontFamily: 'inherit',
          }}
        >
          View 6-Week Speaking Curriculum →
        </button>
      </div>
    </div>
  )
}
