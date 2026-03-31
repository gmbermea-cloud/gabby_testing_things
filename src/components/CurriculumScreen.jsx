import { useState } from 'react'
import { CURRICULUM } from '../data/curriculum.js'

const TAG_COLORS = {
  Presence:      '#C85A3F',
  Breath:        '#5B8FA3',
  Voice:         '#D4A574',
  Improv:        '#7A9B76',
  Foundation:    '#1A1A1A',
  Structure:     '#C85A3F',
  Story:         '#D4A574',
  Hook:          '#5B8FA3',
  Close:         '#7A9B76',
  Bridge:        '#D4A574',
  Silence:       '#5B8FA3',
  'Eye Contact': '#C85A3F',
  Connection:    '#7A9B76',
  Adaptation:    '#5B8FA3',
  Recovery:      '#D4A574',
  Conviction:    '#C85A3F',
  Vulnerability: '#7A9B76',
  Range:         '#D4A574',
  Resonance:     '#5B8FA3',
  Memorization:  '#C85A3F',
  Performance:   '#1A1A1A',
  Ritual:        '#7A9B76',
  Mindset:       '#D4A574',
}

const WEEK_COLORS = ['#C85A3F', '#5B8FA3', '#7A9B76', '#D4A574', '#C85A3F', '#5B8FA3']

const LS_KEY = 'curriculum_completed'

function loadCompleted() {
  try {
    return new Set(JSON.parse(localStorage.getItem(LS_KEY) || '[]'))
  } catch {
    return new Set()
  }
}

function saveCompleted(set) {
  localStorage.setItem(LS_KEY, JSON.stringify([...set]))
}

function CheckIcon({ color = '#FAF7F0', size = 10 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" fill="none">
      <path d="M2 5L4.2 7L8 3" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M4 6L8 10L12 6" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function CurriculumScreen({ onBack }) {
  const [completed, setCompleted] = useState(loadCompleted)
  const [expanded, setExpanded] = useState(new Set([0]))

  const totalExercises = CURRICULUM.reduce((sum, w) => sum + w.exercises.length, 0)
  const totalCompleted = completed.size
  const progressPct = totalExercises > 0 ? (totalCompleted / totalExercises) * 100 : 0

  function toggleExercise(id) {
    setCompleted(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      saveCompleted(next)
      return next
    })
  }

  function toggleWeek(index) {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  return (
    <div style={{ minHeight: '100dvh', background: '#FAF7F0' }}>
      {/* Header */}
      <div className="px-6 pt-8 pb-5">
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            marginBottom: 22,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 4L6 8L10 12" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontSize: 13, color: '#1A1A1A', opacity: 0.45, letterSpacing: '0.03em' }}>Back</span>
        </button>

        <div
          className="serif"
          style={{
            fontSize: 13,
            color: '#1A1A1A',
            opacity: 0.4,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            fontStyle: 'italic',
            marginBottom: 6,
          }}
        >
          Speaking Curriculum
        </div>

        <h1
          className="serif"
          style={{
            fontSize: 'clamp(32px, 9vw, 44px)',
            lineHeight: 1.05,
            fontWeight: 400,
            color: '#1A1A1A',
            letterSpacing: '-0.02em',
            marginBottom: 20,
          }}
        >
          Six weeks to<br />the red dot.
        </h1>

        {/* Overall progress */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 12,
            padding: '14px 16px',
            border: '1px solid #1A1A1A0D',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
            <span style={{ fontSize: 11, color: '#1A1A1A', opacity: 0.4, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Overall Progress
            </span>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', opacity: 0.55 }}>
              {totalCompleted} / {totalExercises}
            </span>
          </div>
          <div style={{ height: 5, background: '#1A1A1A', opacity: 0.08, borderRadius: 3, overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                background: '#C85A3F',
                borderRadius: 3,
                width: `${progressPct}%`,
                transition: 'width 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
                opacity: 1,
              }}
            />
          </div>
          {totalCompleted === totalExercises && totalExercises > 0 && (
            <div style={{ fontSize: 12, color: '#C85A3F', marginTop: 8, fontWeight: 500 }}>
              All 36 exercises complete. You are ready.
            </div>
          )}
        </div>
      </div>

      {/* Week cards */}
      <div className="px-6 pb-16" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {CURRICULUM.map((week, wi) => {
          const weekColor = WEEK_COLORS[wi]
          const exerciseIds = week.exercises.map((_, ei) => `w${wi}-e${ei}`)
          const weekCompleted = exerciseIds.filter(id => completed.has(id)).length
          const isExpanded = expanded.has(wi)
          const isWeekDone = weekCompleted === week.exercises.length

          return (
            <div
              key={wi}
              style={{
                background: '#FFFFFF',
                borderRadius: 16,
                overflow: 'hidden',
                border: `1px solid ${isWeekDone ? weekColor + '35' : '#1A1A1A0D'}`,
                transition: 'border-color 0.35s ease',
              }}
            >
              {/* Week header */}
              <button
                onClick={() => toggleWeek(wi)}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  padding: '16px 18px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  textAlign: 'left',
                }}
              >
                {/* Week number / done circle */}
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    flexShrink: 0,
                    background: isWeekDone ? weekColor : `${weekColor}18`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background 0.35s ease',
                  }}
                >
                  {isWeekDone ? (
                    <CheckIcon color="#FAF7F0" size={14} />
                  ) : (
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: weekColor,
                        lineHeight: 1,
                        fontFamily: 'inherit',
                      }}
                    >
                      {week.week}
                    </span>
                  )}
                </div>

                {/* Text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 10,
                      color: '#1A1A1A',
                      opacity: 0.38,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      marginBottom: 2,
                    }}
                  >
                    Week {week.week} · {week.focus}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#1A1A1A', lineHeight: 1.25 }}>
                    {week.title}
                  </div>
                  {/* Mini progress bar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
                    <div style={{ flex: 1, height: 3, background: '#1A1A1A0D', borderRadius: 2, overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          background: weekColor,
                          borderRadius: 2,
                          width: `${(weekCompleted / week.exercises.length) * 100}%`,
                          transition: 'width 0.4s ease',
                        }}
                      />
                    </div>
                    <span style={{ fontSize: 10, color: '#1A1A1A', opacity: 0.35, flexShrink: 0 }}>
                      {weekCompleted}/{week.exercises.length}
                    </span>
                  </div>
                </div>

                {/* Chevron */}
                <div
                  style={{
                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.25s ease',
                    opacity: 0.28,
                    flexShrink: 0,
                  }}
                >
                  <ChevronIcon />
                </div>
              </button>

              {/* Expanded body */}
              {isExpanded && (
                <div>
                  {/* Objectives */}
                  <div
                    style={{
                      padding: '14px 18px 16px',
                      borderTop: '1px solid #1A1A1A08',
                      background: `${weekColor}06`,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 10,
                        color: '#1A1A1A',
                        opacity: 0.35,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        marginBottom: 10,
                      }}
                    >
                      This week's goals
                    </div>
                    {week.objectives.map((obj, oi) => (
                      <div key={oi} style={{ display: 'flex', gap: 9, marginBottom: oi < week.objectives.length - 1 ? 7 : 0 }}>
                        <div
                          style={{
                            width: 5,
                            height: 5,
                            borderRadius: '50%',
                            background: weekColor,
                            flexShrink: 0,
                            marginTop: 6,
                            opacity: 0.7,
                          }}
                        />
                        <span style={{ fontSize: 13, color: '#1A1A1A', opacity: 0.58, lineHeight: 1.55 }}>
                          {obj}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Exercises */}
                  <div style={{ borderTop: '1px solid #1A1A1A08' }}>
                    {week.exercises.map((ex, ei) => {
                      const id = `w${wi}-e${ei}`
                      const isDone = completed.has(id)
                      const tagColor = TAG_COLORS[ex.tag] || '#1A1A1A'

                      return (
                        <button
                          key={ei}
                          onClick={() => toggleExercise(id)}
                          style={{
                            width: '100%',
                            background: isDone ? `${weekColor}0A` : 'transparent',
                            border: 'none',
                            borderTop: ei > 0 ? '1px solid #1A1A1A06' : 'none',
                            padding: '14px 18px',
                            cursor: 'pointer',
                            display: 'flex',
                            gap: 13,
                            alignItems: 'flex-start',
                            textAlign: 'left',
                            transition: 'background 0.2s ease',
                          }}
                        >
                          {/* Checkbox */}
                          <div
                            style={{
                              width: 22,
                              height: 22,
                              borderRadius: '50%',
                              flexShrink: 0,
                              marginTop: 1,
                              border: `2px solid ${isDone ? weekColor : '#1A1A1A1A'}`,
                              background: isDone ? weekColor : 'transparent',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.2s ease',
                            }}
                          >
                            {isDone && <CheckIcon />}
                          </div>

                          {/* Exercise content */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5, flexWrap: 'wrap' }}>
                              <span
                                style={{
                                  fontSize: 10,
                                  fontWeight: 600,
                                  letterSpacing: '0.08em',
                                  textTransform: 'uppercase',
                                  color: tagColor,
                                  background: `${tagColor}14`,
                                  padding: '2px 7px',
                                  borderRadius: 4,
                                }}
                              >
                                {ex.tag}
                              </span>
                              <span style={{ fontSize: 10, color: '#1A1A1A', opacity: 0.32 }}>
                                {ex.minutes} min
                              </span>
                            </div>
                            <div
                              style={{
                                fontSize: 14,
                                fontWeight: 600,
                                color: '#1A1A1A',
                                opacity: isDone ? 0.38 : 1,
                                lineHeight: 1.3,
                                marginBottom: 4,
                                textDecoration: isDone ? 'line-through' : 'none',
                                transition: 'opacity 0.2s ease',
                              }}
                            >
                              {ex.name}
                            </div>
                            <div
                              style={{
                                fontSize: 12,
                                color: '#1A1A1A',
                                opacity: isDone ? 0.28 : 0.5,
                                lineHeight: 1.6,
                                transition: 'opacity 0.2s ease',
                              }}
                            >
                              {ex.desc}
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
