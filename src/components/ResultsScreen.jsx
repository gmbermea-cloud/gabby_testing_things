import { useState } from 'react'
import { dimensionLabels } from '../utils/scoring.js'

const ED = { fontFamily: "'Playfair Display', Georgia, serif" }

function CareerCard({ match, rank, isExpanded, onToggle }) {
  const { career, matchPercent } = match
  const rankLabels = ['Top Match', 'Strong Match', 'Great Fit', 'Worth Exploring', 'Also Consider']

  return (
    <div
      className="transition-all duration-300 overflow-hidden"
      style={{
        borderRadius: 20,
        border: isExpanded ? '1.5px solid rgba(28,25,21,0.3)' : '1px solid rgba(28,25,21,0.1)',
        background: isExpanded ? '#F2EDE6' : 'rgba(28,25,21,0.02)',
      }}
    >
      <button onClick={onToggle} className="w-full text-left p-5 flex items-center gap-4">
        <div
          style={{
            width: 36, height: 36, borderRadius: 12,
            background: rank === 0 ? '#1C1915' : 'rgba(28,25,21,0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <span style={{ ...ED, fontSize: 12, fontWeight: 700, color: rank === 0 ? '#E8E3DB' : 'rgba(28,25,21,0.4)' }}>
            #{rank + 1}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <span style={{ fontSize: 10, color: '#1C1915', opacity: rank === 0 ? 0.5 : 0.25, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {rankLabels[rank]}
          </span>
          <h3 style={{ ...ED, fontSize: 18, fontWeight: 700, color: '#1C1915', lineHeight: 1.2, marginTop: 1 }} className="truncate">
            {career.title}
          </h3>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <span style={{ ...ED, fontSize: 20, fontWeight: 900, color: '#1C1915' }}>{matchPercent}%</span>
          <span style={{ fontSize: 10, color: '#1C1915', opacity: 0.3 }}>{isExpanded ? '▲' : '▼'}</span>
        </div>
      </button>

      {/* Match bar */}
      <div className="px-5 pb-3">
        <div style={{ height: 1, background: 'rgba(28,25,21,0.1)', borderRadius: 1 }}>
          <div style={{
            height: '100%',
            width: `${matchPercent}%`,
            background: '#1C1915',
            opacity: 0.35,
            borderRadius: 1,
            transition: 'width 1s ease',
          }} />
        </div>
      </div>

      {/* Expanded */}
      {isExpanded && (
        <div
          className="px-5 pb-6 flex flex-col gap-5"
          style={{ borderTop: '1px solid rgba(28,25,21,0.08)', paddingTop: 20, marginTop: 4 }}
        >
          <p style={{ fontSize: 13, color: '#1C1915', opacity: 0.6, lineHeight: 1.65 }}>
            {career.description}
          </p>

          <div>
            <p style={{ fontSize: 10, color: '#1C1915', opacity: 0.3, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>
              Key Skills
            </p>
            <div className="flex flex-wrap gap-2">
              {career.skills.map(skill => (
                <span
                  key={skill}
                  style={{
                    fontSize: 11,
                    color: '#1C1915',
                    opacity: 0.65,
                    border: '1px solid rgba(28,25,21,0.15)',
                    borderRadius: 100,
                    padding: '4px 12px',
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(28,25,21,0.08)', paddingTop: 16 }}>
            <p style={{ fontSize: 10, color: '#1C1915', opacity: 0.3, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>
              A Note For You
            </p>
            <p style={{ ...ED, fontStyle: 'italic', fontSize: 13, color: '#1C1915', opacity: 0.65, lineHeight: 1.7 }}>
              "{career.personalNote}"
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ResultsScreen({ results, onShare, onRestart }) {
  const { personalityType, topCareers } = results
  const [expandedIdx, setExpandedIdx] = useState(0)

  const toggleExpand = (idx) => {
    setExpandedIdx(prev => prev === idx ? -1 : idx)
  }

  return (
    <div className="flex flex-col min-h-dvh bg-[#E8E3DB] fade-up">
      {/* Hero */}
      <div className="px-6 pt-10 pb-8">
        <p style={{ fontSize: 10, color: '#1C1915', opacity: 0.35, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 10 }}>
          Your Career DNA
        </p>
        <h1 style={{ ...ED, fontSize: 48, fontWeight: 900, color: '#1C1915', lineHeight: 1.0, letterSpacing: '-1px' }}>
          {personalityType.label}
        </h1>
        <p style={{ fontSize: 14, color: '#1C1915', opacity: 0.5, lineHeight: 1.65, marginTop: 12 }}>
          {personalityType.description}
        </p>

        {/* Type badge */}
        <div
          className="mt-5 inline-flex items-center gap-2"
          style={{
            border: '1px solid rgba(28,25,21,0.2)',
            borderRadius: 100,
            padding: '6px 16px',
          }}
        >
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#1C1915', opacity: 0.4 }} />
          <span style={{ fontSize: 12, color: '#1C1915', opacity: 0.55, letterSpacing: '0.06em' }}>
            {personalityType.label}
          </span>
        </div>
      </div>

      {/* Career matches */}
      <div className="px-6 pb-6 flex flex-col gap-3">
        <p style={{ fontSize: 10, color: '#1C1915', opacity: 0.3, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>
          Top Career Matches
        </p>
        {topCareers.map((match, idx) => (
          <CareerCard
            key={match.career.id}
            match={match}
            rank={idx}
            isExpanded={expandedIdx === idx}
            onToggle={() => toggleExpand(idx)}
          />
        ))}
      </div>

      {/* Dimension breakdown */}
      <div className="px-6 pb-6">
        <div style={{ borderRadius: 20, border: '1px solid rgba(28,25,21,0.1)', padding: 20 }}>
          <h3 style={{ fontSize: 10, color: '#1C1915', opacity: 0.3, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>
            Your Profile
          </h3>
          <div className="flex flex-col gap-4">
            {Object.entries(results.scoreVector)
              .sort(([, a], [, b]) => b - a)
              .map(([dim, score]) => {
                const pct   = Math.round(((score + 1) / 2) * 100)
                const label = dimensionLabels[dim] ?? (dim.charAt(0).toUpperCase() + dim.slice(1))
                return (
                  <div key={dim} className="flex flex-col gap-1.5">
                    <div className="flex justify-between" style={{ fontSize: 12 }}>
                      <span style={{ color: '#1C1915', opacity: 0.5 }}>{label}</span>
                      <span style={{ color: '#1C1915', opacity: score > 0.3 ? 0.7 : 0.25 }}>
                        {score > 0 ? '+' : ''}{score.toFixed(2)}
                      </span>
                    </div>
                    <div style={{ height: 1, background: 'rgba(28,25,21,0.08)', borderRadius: 1 }}>
                      <div
                        style={{
                          height: '100%',
                          borderRadius: 1,
                          width: `${Math.abs(pct - 50) * 2}%`,
                          marginLeft: score < 0 ? 'auto' : '0',
                          background: '#1C1915',
                          opacity: score > 0 ? 0.35 : 0.2,
                        }}
                      />
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div
        className="px-6 pb-10 flex flex-col gap-3 sticky bottom-0 pt-6"
        style={{ background: 'linear-gradient(to top, #E8E3DB 80%, transparent)' }}
      >
        <button
          onClick={onShare}
          className="w-full py-4 rounded-full font-bold text-base tracking-wide active:scale-95 transition-transform"
          style={{ background: '#1C1915', color: '#E8E3DB', letterSpacing: '0.06em' }}
        >
          Share My Results →
        </button>
        <button
          onClick={onRestart}
          className="w-full py-4 rounded-full font-bold text-base active:scale-95 transition-transform"
          style={{ border: '1.5px solid rgba(28,25,21,0.15)', color: '#1C1915', opacity: 0.5 }}
        >
          Start Over
        </button>
      </div>
    </div>
  )
}
