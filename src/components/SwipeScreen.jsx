import { useState, useRef, useCallback } from 'react'
import { swipeCards } from '../data/careers.js'

const SWIPE_THRESHOLD = 80   // px to trigger swipe
const LIFT_THRESHOLD  = -80  // negative Y to trigger "revise" (up swipe)

function SwipeCard({ card, onSwipe, isTop }) {
  const cardRef = useRef(null)
  const startPos = useRef(null)
  const currentPos = useRef({ x: 0, y: 0 })
  const [transform, setTransform] = useState({ x: 0, y: 0, rotate: 0 })
  const [exiting, setExiting] = useState(null) // 'right' | 'left' | 'up'

  const getPointerPos = (e) => {
    if (e.touches) return { x: e.touches[0].clientX, y: e.touches[0].clientY }
    return { x: e.clientX, y: e.clientY }
  }

  const onPointerDown = useCallback((e) => {
    if (!isTop) return
    e.preventDefault()
    startPos.current = getPointerPos(e)
    currentPos.current = { x: 0, y: 0 }
  }, [isTop])

  const onPointerMove = useCallback((e) => {
    if (!isTop || !startPos.current) return
    e.preventDefault()
    const pos = getPointerPos(e)
    const dx = pos.x - startPos.current.x
    const dy = pos.y - startPos.current.y
    currentPos.current = { x: dx, y: dy }

    const rotate = dx * 0.08
    setTransform({ x: dx, y: dy, rotate })
  }, [isTop])

  const onPointerUp = () => {
    if (!startPos.current) return
    const { x, y } = currentPos.current
    startPos.current = null

    if (x > SWIPE_THRESHOLD) {
      triggerExit('right', 'approve')
    } else if (x < -SWIPE_THRESHOLD) {
      triggerExit('left', 'reject')
    } else if (y < LIFT_THRESHOLD) {
      triggerExit('up', 'revise')
    } else {
      // Snap back
      setTransform({ x: 0, y: 0, rotate: 0 })
    }
  }

  const triggerExit = (direction, action) => {
    setExiting(direction)
    setTimeout(() => onSwipe(card.id, action), 320)
  }

  // Determine hint overlay opacity
  const hintOpacity = Math.min(1, Math.abs(transform.x) / SWIPE_THRESHOLD)
  const upHintOpacity = Math.min(1, Math.abs(Math.min(0, transform.y)) / Math.abs(LIFT_THRESHOLD))
  const isRight = transform.x > 20
  const isLeft = transform.x < -20
  const isUp = transform.y < -20 && !isRight && !isLeft

  const exitStyles = {
    right: 'translate-x-[130%] rotate-[20deg] opacity-0',
    left:  'translate-x-[-130%] rotate-[-20deg] opacity-0',
    up:    'translate-y-[-130%] rotate-[5deg] opacity-0',
  }

  return (
    <div
      ref={cardRef}
      className={`absolute inset-x-0 swipe-card select-none ${exiting ? 'transition-all duration-300 ' + exitStyles[exiting] : ''}`}
      style={!exiting ? {
        transform: `translateX(${transform.x}px) translateY(${transform.y}px) rotate(${transform.rotate}deg)`,
        transition: startPos.current ? 'none' : 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',
      } : {}}
      onMouseDown={onPointerDown}
      onMouseMove={onPointerMove}
      onMouseUp={onPointerUp}
      onMouseLeave={onPointerUp}
      onTouchStart={onPointerDown}
      onTouchMove={onPointerMove}
      onTouchEnd={onPointerUp}
    >
      <div className="relative mx-4 rounded-3xl overflow-hidden border border-white/10 bg-[#111f54] shadow-2xl"
           style={{ minHeight: '420px' }}>

        {/* Approve hint overlay */}
        {isRight && (
          <div className="absolute inset-0 bg-emerald-500/20 z-10 flex items-start justify-start p-6 rounded-3xl"
               style={{ opacity: hintOpacity }}>
            <span className="border-2 border-emerald-400 text-emerald-400 font-black text-2xl px-4 py-1 rounded-xl rotate-[-12deg]">
              YES
            </span>
          </div>
        )}

        {/* Reject hint overlay */}
        {isLeft && (
          <div className="absolute inset-0 bg-rose-500/20 z-10 flex items-start justify-end p-6 rounded-3xl"
               style={{ opacity: hintOpacity }}>
            <span className="border-2 border-rose-400 text-rose-400 font-black text-2xl px-4 py-1 rounded-xl rotate-[12deg]">
              NOPE
            </span>
          </div>
        )}

        {/* Revise hint overlay */}
        {isUp && (
          <div className="absolute inset-0 bg-[#C9A84C]/20 z-10 flex items-start justify-center pt-6 rounded-3xl"
               style={{ opacity: upHintOpacity }}>
            <span className="border-2 border-[#C9A84C] text-[#C9A84C] font-black text-2xl px-4 py-1 rounded-xl">
              MAYBE
            </span>
          </div>
        )}

        {/* Card content */}
        <div className="flex flex-col h-full p-8 gap-6" style={{ minHeight: '420px' }}>
          <div className="text-5xl">{card.emoji}</div>
          <div className="flex-1 flex flex-col justify-center gap-3">
            <p className="text-white text-2xl font-bold leading-snug">{card.prompt}</p>
            <p className="text-white/50 text-sm">{card.subtext}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SwipeScreen({ onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [responses, setResponses] = useState([])
  const [lastAction, setLastAction] = useState(null)

  const handleSwipe = (cardId, action) => {
    const newResponses = [...responses, { cardId, action }]
    setResponses(newResponses)
    setLastAction(action)

    const nextIndex = currentIndex + 1
    setCurrentIndex(nextIndex)

    if (nextIndex >= swipeCards.length) {
      setTimeout(() => onComplete(newResponses), 300)
    }
  }

  // Manual action buttons
  const handleButton = (action) => {
    if (currentIndex >= swipeCards.length) return
    const card = swipeCards[currentIndex]
    handleSwipe(card.id, action)
  }

  const progress = currentIndex / swipeCards.length
  const remaining = swipeCards.length - currentIndex

  if (currentIndex >= swipeCards.length) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#0D1B4B]">
        <div className="text-white text-xl font-bold">Analyzing…</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-dvh bg-[#0D1B4B]">
      {/* Header */}
      <div className="px-6 pt-10 pb-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/40 text-xs uppercase tracking-widest">React honestly</p>
            <h2 className="text-white font-bold text-lg">Does this sound like you?</h2>
          </div>
          <div className="text-right">
            <span className="text-[#C9A84C] font-black text-2xl">{remaining}</span>
            <p className="text-white/30 text-xs">left</p>
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

      {/* Card stack */}
      <div className="flex-1 relative card-stack" style={{ minHeight: '460px' }}>
        {/* Render top 3 cards for stack effect */}
        {[2, 1, 0].map(offset => {
          const idx = currentIndex + offset
          if (idx >= swipeCards.length) return null
          const card = swipeCards[idx]
          return (
            <div
              key={card.id}
              className="absolute inset-0 transition-transform duration-300"
              style={{
                transform: `scale(${1 - offset * 0.04}) translateY(${offset * 10}px)`,
                zIndex: 10 - offset,
              }}
            >
              <SwipeCard
                card={card}
                isTop={offset === 0}
                onSwipe={handleSwipe}
              />
            </div>
          )
        })}
      </div>

      {/* Action buttons */}
      <div className="px-6 pb-10 pt-4">
        {/* Last action feedback */}
        {lastAction && (
          <p className="text-center text-white/30 text-xs mb-3 transition-all">
            {lastAction === 'approve' && '✓ Added full weight'}
            {lastAction === 'revise' && '~ Added partial weight'}
            {lastAction === 'reject' && '✗ Counted against'}
          </p>
        )}

        <div className="flex items-center justify-center gap-6">
          {/* Reject */}
          <button
            onClick={() => handleButton('reject')}
            className="w-16 h-16 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center
                       active:scale-90 transition-transform text-2xl"
            aria-label="Reject"
          >
            ✕
          </button>

          {/* Revise (up) */}
          <button
            onClick={() => handleButton('revise')}
            className="w-14 h-14 rounded-2xl bg-[#C9A84C]/15 border border-[#C9A84C]/30 flex items-center justify-center
                       active:scale-90 transition-transform text-xl"
            aria-label="Revise / Maybe"
          >
            ↑
          </button>

          {/* Approve */}
          <button
            onClick={() => handleButton('approve')}
            className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center
                       active:scale-90 transition-transform text-2xl"
            aria-label="Approve"
          >
            ✓
          </button>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 mt-4 text-xs text-white/30">
          <span>← Nope</span>
          <span>↑ Maybe</span>
          <span>Yes →</span>
        </div>
      </div>
    </div>
  )
}
