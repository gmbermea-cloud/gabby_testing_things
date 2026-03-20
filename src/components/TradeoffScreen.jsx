import { useState } from 'react'
import { tradeoffPairs } from '../data/careers.js'

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
      <div className="flex min-h-dvh items-center justify-center bg-[#0D1B4B]">
        <div className="text-white text-xl font-bold">Almost there…</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-dvh bg-[#0D1B4B] px-6">
      {/* Header */}
      <div className="pt-10 pb-6 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/40 text-xs uppercase tracking-widest">No neutral option</p>
            <h2 className="text-white font-bold text-lg">Pick one. Be honest.</h2>
          </div>
          <div className="text-right">
            <span className="text-[#C9A84C] font-black text-2xl">{currentIndex + 1}</span>
            <span className="text-white/30 text-sm"> / {tradeoffPairs.length}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#C9A84C] rounded-full transition-all duration-500"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="text-center mb-8">
        <p className="text-white/60 text-base">{pair.question}</p>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-4 flex-1 justify-center max-w-sm mx-auto w-full">
        {[
          { key: 'A', option: pair.optionA },
          { key: 'B', option: pair.optionB },
        ].map(({ key, option }) => {
          const isSelected = selected === key
          const isUnselected = selected && selected !== key

          return (
            <button
              key={key}
              onClick={() => handleChoice(key)}
              disabled={!!selected}
              className={`
                w-full rounded-3xl border-2 p-6 text-left transition-all duration-300 active:scale-95
                ${isSelected
                  ? 'border-[#C9A84C] bg-[#C9A84C]/20 scale-105'
                  : isUnselected
                    ? 'border-white/5 bg-white/3 opacity-30 scale-95'
                    : 'border-white/15 bg-white/5 hover:border-[#C9A84C]/50 hover:bg-[#C9A84C]/10'}
              `}
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl">{option.emoji}</span>
                <div className="flex-1">
                  <p className="text-white font-bold text-xl leading-tight">{option.label}</p>
                </div>
                {isSelected && (
                  <div className="w-8 h-8 rounded-full bg-[#C9A84C] flex items-center justify-center flex-shrink-0">
                    <span className="text-[#0D1B4B] font-black text-sm">✓</span>
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* VS divider hint */}
      {!selected && (
        <div className="flex items-center gap-4 my-2 max-w-sm mx-auto w-full">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-white/20 text-xs font-bold tracking-widest">VS</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>
      )}

      <div className="pb-10 pt-6 text-center text-white/20 text-xs">
        You must pick one — both matter, but one matters more.
      </div>
    </div>
  )
}
