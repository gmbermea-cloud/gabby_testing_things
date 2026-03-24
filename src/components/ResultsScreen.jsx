import { useEffect, useState } from 'react'

export default function ResultsScreen({ results, onRestart }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  const { ranked, topTrack } = results

  return (
    <div
      className="flex flex-col min-h-dvh px-6 pt-10 pb-12"
      style={{ background: '#FAF7F0' }}
    >
      {/* Header */}
      <div
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
          marginBottom: 32,
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            color: '#C85A3F',
            opacity: 0.8,
            marginBottom: 10,
          }}
        >
          Your Results
        </div>
        <h1
          className="serif"
          style={{
            fontSize: 'clamp(28px, 7.5vw, 38px)',
            lineHeight: 1.2,
            color: '#1A1A1A',
            fontWeight: 400,
            marginBottom: 10,
          }}
        >
          You're a{' '}
          <em style={{ color: topTrack.meta.color }}>
            {topTrack.track} Architect.
          </em>
        </h1>
        <p
          style={{
            fontSize: 15,
            lineHeight: 1.6,
            color: '#1A1A1A',
            opacity: 0.55,
          }}
        >
          {topTrack.meta.tagline}
        </p>
      </div>

      {/* Track cards */}
      <div className="flex flex-col gap-4 flex-1">
        {ranked.map((entry, i) => (
          <TrackCard
            key={entry.track}
            entry={entry}
            rank={i}
            visible={visible}
            delay={0.1 + i * 0.08}
          />
        ))}
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: 32,
          opacity: visible ? 1 : 0,
          transition: `opacity 0.6s ease 0.6s`,
        }}
      >
        <button
          onClick={onRestart}
          className="w-full py-4 rounded-full font-semibold active:scale-95 transition-transform"
          style={{
            background: 'transparent',
            border: '1.5px solid rgba(26,26,26,0.18)',
            color: '#1A1A1A',
            fontSize: 14,
          }}
        >
          Retake the Discovery
        </button>
        <p
          style={{
            textAlign: 'center',
            fontSize: 11,
            color: '#1A1A1A',
            opacity: 0.3,
            marginTop: 10,
          }}
        >
          ArchPath by @gabbybermea
        </p>
      </div>
    </div>
  )
}

function TrackCard({ entry, rank, visible, delay }) {
  const { track, percentage, meta } = entry
  const isTop = rank === 0

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        transition: `opacity 0.55s ease ${delay}s, transform 0.55s ease ${delay}s`,
      }}
    >
      <div
        style={{
          background: isTop ? meta.bg : '#FFFFFF',
          border: isTop ? `1.5px solid ${meta.color}40` : '1.5px solid rgba(26,26,26,0.08)',
          borderLeft: isTop ? `4px solid ${meta.color}` : '1.5px solid rgba(26,26,26,0.08)',
          borderRadius: 20,
          padding: isTop ? '20px 20px 20px 18px' : '16px 18px',
          boxShadow: isTop ? `0 4px 20px ${meta.color}18` : '0 1px 6px rgba(0,0,0,0.04)',
        }}
      >
        {/* Top Match badge */}
        {isTop && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              padding: '3px 10px',
              borderRadius: 20,
              background: meta.color,
              color: '#FFFFFF',
              fontSize: 10,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: 12,
            }}
          >
            ★ Top Match
          </div>
        )}

        {/* Track header row */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <div
              className="serif"
              style={{
                fontSize: isTop ? 22 : 17,
                color: '#1A1A1A',
                lineHeight: 1.2,
                fontWeight: 400,
              }}
            >
              {track}
            </div>
            <div
              style={{
                fontSize: 12,
                color: '#1A1A1A',
                opacity: 0.5,
                marginTop: 2,
              }}
            >
              {meta.tagline}
            </div>
          </div>

          {/* Percentage circle */}
          <div
            style={{
              flexShrink: 0,
              width: isTop ? 52 : 44,
              height: isTop ? 52 : 44,
              borderRadius: '50%',
              background: isTop ? meta.color : 'rgba(26,26,26,0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                fontSize: isTop ? 13 : 11,
                fontWeight: 700,
                color: isTop ? '#FFFFFF' : '#1A1A1A',
              }}
            >
              {percentage}%
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div
          style={{
            height: 3,
            background: 'rgba(26,26,26,0.08)',
            borderRadius: 2,
            marginBottom: 14,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${percentage}%`,
              background: meta.color,
              borderRadius: 2,
              transition: 'width 1s ease 0.4s',
            }}
          />
        </div>

        {/* Description (top track only) */}
        {isTop && (
          <p
            style={{
              fontSize: 13,
              lineHeight: 1.65,
              color: '#1A1A1A',
              opacity: 0.65,
              marginBottom: 16,
            }}
          >
            {meta.description}
          </p>
        )}

        {/* Skills */}
        <div className="flex flex-wrap gap-2">
          {meta.skills.slice(0, isTop ? meta.skills.length : 3).map((skill) => (
            <span
              key={skill}
              style={{
                padding: '4px 10px',
                borderRadius: 20,
                fontSize: 11,
                fontWeight: 500,
                background: isTop ? `${meta.color}18` : 'rgba(26,26,26,0.05)',
                color: isTop ? meta.color : '#1A1A1A',
                opacity: isTop ? 1 : 0.6,
                border: isTop ? `1px solid ${meta.color}30` : 'none',
              }}
            >
              {skill}
            </span>
          ))}
          {!isTop && meta.skills.length > 3 && (
            <span
              style={{
                padding: '4px 10px',
                borderRadius: 20,
                fontSize: 11,
                color: '#1A1A1A',
                opacity: 0.35,
              }}
            >
              +{meta.skills.length - 3} more
            </span>
          )}
        </div>

        {/* Typical roles (top track only) */}
        {isTop && meta.roles && (
          <div style={{ marginTop: 16 }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: '#1A1A1A',
                opacity: 0.35,
                marginBottom: 8,
              }}
            >
              Typical Roles
            </div>
            <div className="flex flex-wrap gap-2">
              {meta.roles.map((role) => (
                <span
                  key={role}
                  style={{
                    padding: '4px 12px',
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 500,
                    background: 'rgba(26,26,26,0.06)',
                    color: '#1A1A1A',
                    opacity: 0.7,
                  }}
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
