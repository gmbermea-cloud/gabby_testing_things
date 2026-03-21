import { useState, useRef, useCallback } from 'react'
import { swipeCards } from '../data/careers.js'

const SWIPE_THRESHOLD = 80
const LIFT_THRESHOLD  = -80
const ED = { fontFamily: "'Playfair Display', Georgia, serif" }

function SwipeCard({ card, onSwipe, isTop }) {
  const cardRef = useRef(null)
  const startPos = useRef(null)
  const currentPos = useRef({ x: 0, y: 0 })
  const [transform, setTransform] = useState({ x: 0, y: 0, rotate: 0 })
  const [exiting, setExiting] = useState(null)

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
    setTransform({ x: dx, y: dy, rotate: dx * 0.08 })
  }, [isTop])

  const onPointerUp = () => {
    if (!startPos.current) return
    const { x, y } = currentPos.current
    startPos.current = null
    if (x > SWIPE_THRESHOLD)        triggerExit('right', 'approve')
    else if (x < -SWIPE_THRESHOLD)  triggerExit('left', 'reject')
    else if (y < LIFT_THRESHOLD)    triggerExit('up', 'revise')
    else                            setTransform({ x: 0, y: 0, rotate: 0 })
  }

  const triggerExit = (direction, action) => {
    setExiting(direction)
    setTimeout(() => onSwipe(card.id, action), 320)
  }

  const hintOpacity   = Math.min(1, Math.abs(transform.x) / SWIPE_THRESHOLD)
  const upHintOpacity = Math.min(1, Math.abs(Math.min(0, transform.y)) / Math.abs(LIFT_THRESHOLD))
  const isRight = transform.x > 20
  const isLeft  = transform.x < -20
  const isUp    = transform.y < -20 && !isRight && !isLeft

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
      <div
        className="relative mx-4 overflow-hidden"
        style={{
          minHeight: 420,
          borderRadius: 28,
          background: '#F2EDE6',
          border: '1px solid rgba(28,25,21,0.1)',
          boxShadow: '0 8px 40px rgba(28,25,21,0.08)',
        }}
      >
        {/* Approve hint */}
        {isRight && (
          <div
            className="absolute inset-0 z-10 flex items-start justify-start p-6"
            style={{ opacity: hintOpacity, borderRadius: 28, background: 'rgba(100,120,60,0.08)' }}
          >
            <span style={{
              border: '1.5px solid rgba(80,100,40,0.6)',
              color: 'rgba(80,100,40,0.8)',
              fontSize: 18,
              fontWeight: 700,
              padding: '4px 14px',
              borderRadius: 8,
              transform: 'rotate(-12deg)',
              display: 'inline-block',
              letterSpacing: '0.1em',
              ...ED,
              fontStyle: 'italic',
            }}>
              yes
            </span>
          </div>
        )}

        {/* Reject hint */}
        {isLeft && (
          <div
            className="absolute inset-0 z-10 flex items-start justify-end p-6"
            style={{ opacity: hintOpacity, borderRadius: 28, background: 'rgba(120,60,50,0.06)' }}
          >
            <span style={{
              border: '1.5px solid rgba(120,60,50,0.5)',
              color: 'rgba(120,60,50,0.7)',
              fontSize: 18,
              fontWeight: 700,
              padding: '4px 14px',
              borderRadius: 8,
              transform: 'rotate(12deg)',
              display: 'inline-block',
              letterSpacing: '0.1em',
              ...ED,
              fontStyle: 'italic',
            }}>
              nope
            </span>
          </div>
        )}

        {/* Maybe hint */}
        {isUp && (
          <div
            className="absolute inset-0 z-10 flex items-start justify-center pt-6"
            style={{ opacity: upHintOpacity, borderRadius: 28, background: 'rgba(28,25,21,0.04)' }}
          >
            <span style={{
              border: '1.5px solid rgba(28,25,21,0.4)',
              color: 'rgba(28,25,21,0.6)',
              fontSize: 18,
              fontWeight: 700,
              padding: '4px 14px',
              borderRadius: 8,
              display: 'inline-block',
              letterSpacing: '0.1em',
              ...ED,
              fontStyle: 'italic',
            }}>
              maybe
            </span>
          </div>
        )}

        {/* Card content */}
        <div className="flex flex-col h-full p-8 gap-6" style={{ minHeight: 420 }}>
          <div style={{ fontSize: 44 }}>{card.emoji}</div>
          <div className="flex-1 flex flex-col justify-center gap-3">
            <p style={{ ...ED, fontSize: 26, fontWeight: 700, color: '#1C1915', lineHeight: 1.25 }}>
              {card.prompt}
            </p>
            <p style={{ fontSize: 13, color: '#1C1915', opacity: 0.45, lineHeight: 1.5 }}>
              {card.subtext}
            </p>
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

  const handleButton = (action) => {
    if (currentIndex >= swipeCards.length) return
    const card = swipeCards[currentIndex]
    handleSwipe(card.id, action)
  }

  const progress  = currentIndex / swipeCards.length
  const remaining = swipeCards.length - currentIndex

  if (currentIndex >= swipeCards.length) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#E8E3DB]">
        <div style={{ ...ED, fontStyle: 'italic', fontSize: 20, color: '#1C1915', opacity: 0.6 }}>
          Analysing…
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-dvh bg-[#E8E3DB] fade-up">
      {/* Header */}
      <div className="px-6 pt-10 pb-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <p style={{ fontSize: 10, color: '#1C1915', opacity: 0.35, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              React honestly
            </p>
            <h2 style={{ ...ED, fontSize: 20, fontWeight: 700, color: '#1C1915', marginTop: 2 }}>
              Does this sound like you?
            </h2>
          </div>
          <div className="text-right">
            <span style={{ ...ED, fontSize: 30, fontWeight: 900, color: '#1C1915' }}>{remaining}</span>
            <p style={{ fontSize: 10, color: '#1C1915', opacity: 0.35 }}>left</p>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ height: 1, background: 'rgba(28,25,21,0.12)', borderRadius: 2 }}>
          <div
            style={{
              height: '100%',
              background: '#1C1915',
              borderRadius: 2,
              width: `${progress * 100}%`,
              transition: 'width 0.5s ease',
              opacity: 0.4,
            }}
          />
        </div>
      </div>

      {/* Card stack */}
      <div className="flex-1 relative card-stack" style={{ minHeight: 460 }}>
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
              <SwipeCard card={card} isTop={offset === 0} onSwipe={handleSwipe} />
            </div>
          )
        })}
      </div>

      {/* Action buttons */}
      <div className="px-6 pb-10 pt-4">
        {lastAction && (
          <p style={{ textAlign: 'center', fontSize: 11, color: '#1C1915', opacity: 0.35, marginBottom: 12, ...ED, fontStyle: 'italic' }}>
            {lastAction === 'approve' && 'full weight added'}
            {lastAction === 'revise'  && 'partial weight added'}
            {lastAction === 'reject'  && 'counted against'}
          </p>
        )}

        <div className="flex items-center justify-center gap-5">
          {/* Reject */}
          <button
            onClick={() => handleButton('reject')}
            className="active:scale-90 transition-transform flex items-center justify-center"
            style={{
              width: 60, height: 60, borderRadius: 20,
              border: '1.5px solid rgba(28,25,21,0.15)',
              background: 'rgba(28,25,21,0.03)',
              fontSize: 20, color: '#1C1915',
            }}
            aria-label="Reject"
          >
            ✕
          </button>

          {/* Maybe */}
          <button
            onClick={() => handleButton('revise')}
            className="active:scale-90 transition-transform flex items-center justify-center"
            style={{
              width: 52, height: 52, borderRadius: 18,
              border: '1.5px solid rgba(28,25,21,0.12)',
              background: 'rgba(28,25,21,0.03)',
              fontSize: 18, color: '#1C1915',
            }}
            aria-label="Maybe"
          >
            ↑
          </button>

          {/* Approve */}
          <button
            onClick={() => handleButton('approve')}
            className="active:scale-90 transition-transform flex items-center justify-center"
            style={{
              width: 60, height: 60, borderRadius: 20,
              border: '1.5px solid rgba(28,25,21,0.15)',
              background: 'rgba(28,25,21,0.03)',
              fontSize: 20, color: '#1C1915',
            }}
            aria-label="Approve"
          >
            ✓
          </button>
        </div>

        <div className="flex justify-center gap-6 mt-4" style={{ fontSize: 11, color: '#1C1915', opacity: 0.3 }}>
          <span>← Nope</span>
          <span>↑ Maybe</span>
          <span>Yes →</span>
        </div>
      </div>
    </div>
  )
}
