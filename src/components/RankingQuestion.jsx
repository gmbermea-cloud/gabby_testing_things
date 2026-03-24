import { useState, useRef, useCallback } from 'react'

const TRACK_COLORS = {
  Design:     '#C85A3F',
  Technical:  '#5B8FA3',
  Management: '#7A9B76',
  Business:   '#D4A574',
}

const RANK_LABELS = ['1st', '2nd', '3rd', '4th']

export default function RankingQuestion({ question, value, onChange }) {
  const initialOrder = value ?? question.items.map((_, i) => i)
  const [order, setOrder] = useState(initialOrder)

  // Drag state
  const dragIndex  = useRef(null)
  const hoverIndex = useRef(null)

  const getOrderedItems = () => order.map(i => question.items[i])

  const handleDragStart = (e, idx) => {
    dragIndex.current = idx
    e.dataTransfer.effectAllowed = 'move'
    // Transparent ghost
    const el = document.createElement('div')
    el.style.opacity = '0'
    document.body.appendChild(el)
    e.dataTransfer.setDragImage(el, 0, 0)
    setTimeout(() => document.body.removeChild(el), 0)
  }

  const handleDragEnter = (e, idx) => {
    e.preventDefault()
    if (dragIndex.current === null || dragIndex.current === idx) return
    hoverIndex.current = idx
    const newOrder = [...order]
    const [moved] = newOrder.splice(dragIndex.current, 1)
    newOrder.splice(idx, 0, moved)
    dragIndex.current = idx
    setOrder(newOrder)
    onChange(newOrder.map(i => question.items[i]))
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDragEnd = () => {
    dragIndex.current  = null
    hoverIndex.current = null
  }

  // Touch-based drag (pointer events) for mobile
  const pointerDragIdx = useRef(null)
  const touchStartY    = useRef(null)
  const containerRef   = useRef(null)
  const itemHeightRef  = useRef(72)

  const handlePointerDown = (e, idx) => {
    // Only handle touch, not mouse (mouse handled by HTML5 drag API above)
    if (e.pointerType === 'mouse') return
    e.currentTarget.setPointerCapture(e.pointerId)
    pointerDragIdx.current = idx
    touchStartY.current = e.clientY
  }

  const handlePointerMove = useCallback((e, idx) => {
    if (pointerDragIdx.current === null || pointerDragIdx.current !== idx) return
    if (e.pointerType === 'mouse') return
    e.preventDefault()

    const startY = touchStartY.current ?? e.clientY
    const dy = e.clientY - startY
    const h  = itemHeightRef.current

    if (dy < -h * 0.55 && pointerDragIdx.current > 0) {
      const newOrder = [...order]
      const a = pointerDragIdx.current - 1
      const b = pointerDragIdx.current
      ;[newOrder[a], newOrder[b]] = [newOrder[b], newOrder[a]]
      pointerDragIdx.current = a
      touchStartY.current = e.clientY
      setOrder(newOrder)
      onChange(newOrder.map(i => question.items[i]))
    } else if (dy > h * 0.55 && pointerDragIdx.current < order.length - 1) {
      const newOrder = [...order]
      const a = pointerDragIdx.current
      const b = pointerDragIdx.current + 1
      ;[newOrder[a], newOrder[b]] = [newOrder[b], newOrder[a]]
      pointerDragIdx.current = b
      touchStartY.current = e.clientY
      setOrder(newOrder)
      onChange(newOrder.map(i => question.items[i]))
    }
  }, [order, onChange, question.items])

  const handlePointerUp = () => {
    pointerDragIdx.current = null
    touchStartY.current = null
  }

  // Move up/down buttons (keyboard / accessibility)
  const moveUp = (rankPos) => {
    if (rankPos === 0) return
    const newOrder = [...order]
    ;[newOrder[rankPos - 1], newOrder[rankPos]] = [newOrder[rankPos], newOrder[rankPos - 1]]
    setOrder(newOrder)
    onChange(newOrder.map(i => question.items[i]))
  }

  const moveDown = (rankPos) => {
    if (rankPos === order.length - 1) return
    const newOrder = [...order]
    ;[newOrder[rankPos], newOrder[rankPos + 1]] = [newOrder[rankPos + 1], newOrder[rankPos]]
    setOrder(newOrder)
    onChange(newOrder.map(i => question.items[i]))
  }

  const orderedItems = getOrderedItems()
  const isDraggingItem = (rankPos) => dragIndex.current === rankPos

  return (
    <div ref={containerRef} className="flex flex-col gap-2">
      {orderedItems.map((item, rankPos) => {
        const color = TRACK_COLORS[item.track] ?? '#999'
        return (
          <div
            key={`${item.track}-${item.text.slice(0, 20)}`}
            draggable
            onDragStart={(e) => handleDragStart(e, rankPos)}
            onDragEnter={(e) => handleDragEnter(e, rankPos)}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            onPointerDown={(e) => handlePointerDown(e, rankPos)}
            onPointerMove={(e) => handlePointerMove(e, rankPos)}
            onPointerUp={handlePointerUp}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 14px',
              borderRadius: 16,
              background: '#FFFFFF',
              border: `1.5px solid rgba(26,26,26,0.10)`,
              cursor: 'grab',
              userSelect: 'none',
              touchAction: 'none',
              opacity: isDraggingItem(rankPos) ? 0.5 : 1,
              transition: 'opacity 0.15s ease, transform 0.15s ease',
              boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
              minHeight: 72,
            }}
          >
            {/* Rank badge */}
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                background: rankPos === 0 ? '#1A1A1A' : `${color}18`,
                border: rankPos === 0 ? 'none' : `1px solid ${color}30`,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: rankPos === 0 ? '#FAF7F0' : color,
                  lineHeight: 1,
                }}
              >
                {rankPos + 1}
              </span>
              <span
                style={{
                  fontSize: 8,
                  color: rankPos === 0 ? 'rgba(250,247,240,0.6)' : `${color}99`,
                  lineHeight: 1,
                  marginTop: 1,
                }}
              >
                {RANK_LABELS[rankPos]?.slice(1) ?? ''}
              </span>
            </div>

            {/* Item text */}
            <p
              style={{
                flex: 1,
                fontSize: 13,
                lineHeight: 1.5,
                color: '#1A1A1A',
              }}
            >
              {item.text}
            </p>

            {/* Controls: up/down + drag handle */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                flexShrink: 0,
              }}
            >
              <button
                onClick={(e) => { e.stopPropagation(); moveUp(rankPos) }}
                disabled={rankPos === 0}
                aria-label="Move up"
                style={{
                  width: 26,
                  height: 22,
                  borderRadius: 6,
                  border: '1px solid rgba(26,26,26,0.12)',
                  background: 'transparent',
                  cursor: rankPos === 0 ? 'default' : 'pointer',
                  opacity: rankPos === 0 ? 0.2 : 0.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 10,
                }}
              >
                ↑
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); moveDown(rankPos) }}
                disabled={rankPos === order.length - 1}
                aria-label="Move down"
                style={{
                  width: 26,
                  height: 22,
                  borderRadius: 6,
                  border: '1px solid rgba(26,26,26,0.12)',
                  background: 'transparent',
                  cursor: rankPos === order.length - 1 ? 'default' : 'pointer',
                  opacity: rankPos === order.length - 1 ? 0.2 : 0.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 10,
                }}
              >
                ↓
              </button>
            </div>

            {/* Drag handle indicator */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                flexShrink: 0,
                opacity: 0.25,
                paddingRight: 2,
              }}
            >
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  style={{
                    width: 16,
                    height: 2,
                    borderRadius: 1,
                    background: '#1A1A1A',
                  }}
                />
              ))}
            </div>
          </div>
        )
      })}

      <p
        style={{
          textAlign: 'center',
          fontSize: 11,
          color: '#1A1A1A',
          opacity: 0.3,
          marginTop: 4,
        }}
      >
        Drag to reorder · Use ↑↓ buttons or keyboard
      </p>
    </div>
  )
}
