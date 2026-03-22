import { useState } from 'react'

export default function SliderQuestion({ question, value, onChange }) {
  const pos = value ?? 50
  const [touched, setTouched] = useState(value !== null)

  const handleChange = (e) => {
    const newPos = Number(e.target.value)
    setTouched(true)
    onChange(newPos)
  }

  // Gradient colors
  const leftColor  = '#C85A3F'  // terracotta (left label always feels design/warm)
  const rightColor = '#5B8FA3'  // blue (right label feels technical/cool)

  return (
    <div className="flex flex-col gap-6">
      {/* Slider track */}
      <div className="px-1">
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={pos}
          onChange={handleChange}
          style={{
            background: `linear-gradient(to right, ${leftColor} 0%, ${rightColor} 100%)`,
            width: '100%',
          }}
          aria-label={question.text}
        />
      </div>

      {/* Labels */}
      <div className="flex justify-between gap-4">
        <div
          className="flex-1 rounded-2xl px-4 py-3"
          style={{
            background: pos < 50 ? `${leftColor}18` : 'rgba(26,26,26,0.04)',
            border: pos < 50 ? `1.5px solid ${leftColor}40` : '1.5px solid rgba(26,26,26,0.08)',
            transition: 'all 0.2s ease',
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: leftColor,
              marginBottom: 4,
              opacity: pos < 50 ? 1 : 0.5,
            }}
          >
            ← {question.leftTrack}
          </div>
          <p
            style={{
              fontSize: 12,
              lineHeight: 1.5,
              color: '#1A1A1A',
              opacity: pos < 50 ? 0.75 : 0.4,
            }}
          >
            {question.leftLabel}
          </p>
        </div>

        <div
          className="flex-1 rounded-2xl px-4 py-3 text-right"
          style={{
            background: pos > 50 ? `${rightColor}18` : 'rgba(26,26,26,0.04)',
            border: pos > 50 ? `1.5px solid ${rightColor}40` : '1.5px solid rgba(26,26,26,0.08)',
            transition: 'all 0.2s ease',
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: rightColor,
              marginBottom: 4,
              opacity: pos > 50 ? 1 : 0.5,
            }}
          >
            {question.rightTrack} →
          </div>
          <p
            style={{
              fontSize: 12,
              lineHeight: 1.5,
              color: '#1A1A1A',
              opacity: pos > 50 ? 0.75 : 0.4,
            }}
          >
            {question.rightLabel}
          </p>
        </div>
      </div>

      {!touched && (
        <p
          style={{
            textAlign: 'center',
            fontSize: 12,
            color: '#1A1A1A',
            opacity: 0.35,
          }}
        >
          Drag the slider to answer
        </p>
      )}
    </div>
  )
}
