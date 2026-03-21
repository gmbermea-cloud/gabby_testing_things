import { useState } from 'react'
import { tradeoffPairs } from '../data/careers.js'

const ED = { fontFamily: "'Playfair Display', Georgia, serif" }

export default function TradeoffScreen({ onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [choices, setChoices] = useState([])
  const [selected, setSelected] = useState(null)
  const [animating, setAnimating] = useState(false)

  const pair = tradeoffPairs[currentIndex]
  const progress = currentIndex / tradeoffPairs.length

  const handleChoice = (choice) => {
    if (animating || selected) return
    setSelected(choice)
    setAnimating(true)

    setTimeout(() => {
      const newChoices = [...choices, { pairId: pair.id, choice }]
      setChoices(newChoices)
      setSelected(null)
      setAnimating(false)

      const nextIndex = currentIndex + 1
      setCurrentIndex(nextIndex)
      if (nextIndex >= tradeoffPairs.length) {
        onComplete(newChoices)
      }
    }, 500)
  }

  if (currentIndex >= tradeoffPairs.length) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#E8E3DB]">
        <div style={{ ...ED, fontStyle: 'italic', fontSize: 20, color: '#1C1915', opacity: 0.6 }}>
          Almost there…
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-dvh bg-[#E8E3DB] px-6 fade-up">
      {/* Header */}
      <div className="pt-10 pb-6 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <p style={{ fontSize: 10, color: '#1C1915', opacity: 0.35, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              No neutral option
            </p>
            <h2 style={{ ...ED, fontSize: 20, fontWeight: 700, color: '#1C1915', marginTop: 2 }}>
              Pick one. Be honest.
            </h2>
          </div>
          <div className="text-right flex items-baseline gap-1">
            <span style={{ ...ED, fontSize: 28, fontWeight: 900, color: '#1C1915' }}>{currentIndex + 1}</span>
            <span style={{ fontSize: 14, color: '#1C1915', opacity: 0.3 }}>/ {tradeoffPairs.length}</span>
          </div>
        </div>

        {/* Progress */}
        <div style={{ height: 1, background: 'rgba(28,25,21,0.12)', borderRadius: 2 }}>
          <div
            style={{
              height: '100%',
              background: '#1C1915',
              opacity: 0.4,
              borderRadius: 2,
              width: `${progress * 100}%`,
              transition: 'width 0.5s ease',
            }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="text-center mb-8">
        <p style={{ ...ED, fontStyle: 'italic', fontSize: 16, color: '#1C1915', opacity: 0.55, lineHeight: 1.5 }}>
          {pair.question}
        </p>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-4 flex-1 justify-center max-w-sm mx-auto w-full">
        {[
          { key: 'A', option: pair.optionA },
          { key: 'B', option: pair.optionB },
        ].map(({ key, option }) => {
          const isSelected   = selected === key
          const isUnselected = selected && selected !== key

          return (
            <button
              key={key}
              onClick={() => handleChoice(key)}
              disabled={!!selected}
              className="w-full text-left active:scale-95 transition-all duration-300"
              style={{
                borderRadius: 24,
                padding: '20px 24px',
                border: isSelected
                  ? '2px solid #1C1915'
                  : '1.5px solid rgba(28,25,21,0.12)',
                background: isSelected
                  ? '#1C1915'
                  : isUnselected
                    ? 'rgba(28,25,21,0.02)'
                    : '#F2EDE6',
                opacity: isUnselected ? 0.35 : 1,
                transform: isSelected ? 'scale(1.02)' : isUnselected ? 'scale(0.97)' : 'scale(1)',
              }}
            >
              <div className="flex items-center gap-4">
                <span style={{ fontSize: 36 }}>{option.emoji}</span>
                <div className="flex-1">
                  <p style={{
                    ...ED,
                    fontSize: 20,
                    fontWeight: 700,
                    lineHeight: 1.2,
                    color: isSelected ? '#E8E3DB' : '#1C1915',
                  }}>
                    {option.label}
                  </p>
                </div>
                {isSelected && (
                  <div style={{
                    width: 28, height: 28,
                    borderRadius: '50%',
                    border: '1.5px solid rgba(232,227,219,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <span style={{ color: '#E8E3DB', fontSize: 13 }}>✓</span>
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* VS divider */}
      {!selected && (
        <div className="flex items-center gap-4 my-3 max-w-sm mx-auto w-full">
          <div style={{ flex: 1, height: 1, background: 'rgba(28,25,21,0.08)' }} />
          <span style={{ fontSize: 10, color: '#1C1915', opacity: 0.25, letterSpacing: '0.2em' }}>VS</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(28,25,21,0.08)' }} />
        </div>
      )}

      <div className="pb-10 pt-6 text-center" style={{ fontSize: 11, color: '#1C1915', opacity: 0.25, ...ED, fontStyle: 'italic' }}>
        You must pick one — both matter, but one matters more.
      </div>
    </div>
  )
}
