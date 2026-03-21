import { useState } from 'react'
import { dimensionLabels } from '../utils/scoring.js'

function MatchBar({ percent }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#C9A84C] rounded-full transition-all duration-1000"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="text-[#C9A84C] font-black text-sm w-10 text-right">{percent}%</span>
    </div>
  )
}

function CareerCard({ match, rank, isExpanded, onToggle }) {
  const { career, matchPercent } = match
  const rankLabels = ['Top Match', 'Strong Match', 'Great Fit', 'Worth Exploring', 'Also Consider']

  return (
    <div
      className={`rounded-3xl border transition-all duration-300 overflow-hidden
        ${isExpanded ? 'border-[#C9A84C]/50 bg-[#C9A84C]/8' : 'border-white/10 bg-white/5'}`}
    >
      {/* Header row */}
      <button
        onClick={onToggle}
        className="w-full text-left p-5 flex items-center gap-4"
      >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0
          ${rank === 0 ? 'bg-[#C9A84C] text-[#0D1B4B]' : 'bg-white/10 text-white/60'}`}>
          #{rank + 1}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold tracking-wide
              ${rank === 0 ? 'text-[#C9A84C]' : 'text-white/40'}`}>
              {rankLabels[rank]}
            </span>
          </div>
          <h3 className="text-white font-black text-lg leading-tight truncate">{career.title}</h3>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <span className="text-[#C9A84C] font-black text-xl">{matchPercent}%</span>
          <span className="text-white/30 text-xs">{isExpanded ? '▲' : '▼'}</span>
        </div>
      </button>

      {/* Match bar */}
      <div className="px-5 pb-3">
        <MatchBar percent={matchPercent} />
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-5 pb-6 flex flex-col gap-5 border-t border-white/10 pt-5 mt-2">
          <p className="text-white/70 text-sm leading-relaxed">{career.description}</p>

          {/* Skills */}
          <div>
            <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Key Skills</p>
            <div className="flex flex-wrap gap-2">
              {career.skills.map(skill => (
                <span key={skill} className="text-xs text-white/70 bg-white/8 border border-white/10 px-3 py-1 rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Personal note */}
          <div className="bg-[#C9A84C]/10 border border-[#C9A84C]/20 rounded-2xl p-4">
            <p className="text-[#C9A84C] text-xs font-bold mb-1 uppercase tracking-wide">A Note For You</p>
            <p className="text-white/80 text-sm italic leading-relaxed">"{career.personalNote}"</p>
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
    <div className="flex flex-col min-h-dvh bg-[#0D1B4B]">
      {/* Hero section */}
      <div className="px-6 pt-10 pb-8 bg-gradient-to-b from-[#1a2d6b] to-[#0D1B4B]">
        <p className="text-[#C9A84C] text-xs uppercase tracking-widest font-bold mb-2">Your Career DNA</p>
        <h1 className="text-white text-4xl font-black leading-tight mb-1">
          {personalityType.label}
        </h1>
        <p className="text-white/60 text-sm leading-relaxed mt-3">
          {personalityType.description}
        </p>

        {/* Personality type badge */}
        <div className="mt-5 inline-flex items-center gap-2 bg-[#C9A84C]/15 border border-[#C9A84C]/30 px-4 py-2 rounded-full">
          <div className="w-2 h-2 rounded-full bg-[#C9A84C]" />
          <span className="text-[#C9A84C] text-sm font-bold">{personalityType.label}</span>
        </div>
      </div>

      {/* Career matches */}
      <div className="px-6 pb-6 flex flex-col gap-3">
        <h2 className="text-white/40 text-xs uppercase tracking-widest font-bold mb-1">
          Top Career Matches
        </h2>

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
        <div className="rounded-3xl border border-white/10 bg-white/3 p-5">
          <h3 className="text-white/40 text-xs uppercase tracking-widest font-bold mb-4">Your Profile</h3>
          <div className="flex flex-col gap-3">
            {Object.entries(results.scoreVector)
              .sort(([, a], [, b]) => b - a)
              .map(([dim, score]) => {
                const pct = Math.round(((score + 1) / 2) * 100)
                const label = dimensionLabels[dim] ?? (dim.charAt(0).toUpperCase() + dim.slice(1))
                return (
                  <div key={dim} className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/50">{dimensionLabels[dim] ?? label}</span>
                      <span className={score > 0.3 ? 'text-[#C9A84C]' : 'text-white/30'}>{score > 0 ? '+' : ''}{score.toFixed(2)}</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${score > 0 ? 'bg-[#C9A84C]' : 'bg-rose-400/50'}`}
                        style={{ width: `${Math.abs(pct - 50) * 2}%`, marginLeft: score < 0 ? 'auto' : '0' }}
                      />
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 pb-10 flex flex-col gap-3 sticky bottom-0 bg-gradient-to-t from-[#0D1B4B] via-[#0D1B4B] to-transparent pt-6">
        <button
          onClick={onShare}
          className="w-full py-4 rounded-2xl bg-[#C9A84C] text-[#0D1B4B] font-black text-lg
                     active:scale-95 transition-transform shadow-lg shadow-[#C9A84C]/20"
        >
          Share My Results →
        </button>
        <button
          onClick={onRestart}
          className="w-full py-4 rounded-2xl border border-white/15 text-white/60 font-bold
                     active:scale-95 transition-transform"
        >
          Start Over
        </button>
      </div>
    </div>
  )
}
