import { useState, useEffect, useRef, useCallback } from 'react'

// ─── Scoring ────────────────────────────────────────────────────────────────

const FILLERS = [
  'um', 'uh', 'like', 'you know', 'so', 'basically',
  'literally', 'actually', 'right', 'kind of', 'sort of', 'i mean',
]

function computeScores(transcript, durationSeconds) {
  const words = transcript.trim().split(/\s+/).filter(w => w.length > 1)
  const wordCount = words.length
  if (wordCount < 8 || durationSeconds < 5) return null

  const wpm = Math.round(wordCount / (durationSeconds / 60))

  // Pace
  let paceScore
  if (wpm >= 130 && wpm <= 150)      paceScore = 94
  else if (wpm >= 115 && wpm < 130)  paceScore = 78
  else if (wpm > 150 && wpm <= 170)  paceScore = 78
  else if (wpm >= 95 && wpm < 115)   paceScore = 60
  else if (wpm > 170 && wpm <= 190)  paceScore = 60
  else                               paceScore = wpm < 95 ? Math.max(18, 60 - (95 - wpm)) : Math.max(18, 60 - (wpm - 190))

  const paceFeedback =
    wpm >= 130 && wpm <= 150
      ? `${wpm} WPM — right in the zone. You gave the audience time to absorb every word.`
      : wpm < 95
      ? `${wpm} WPM — very slow. This pace can feel labored. Aim for 130–150 WPM.`
      : wpm < 130
      ? `${wpm} WPM — slightly slow. A touch more momentum will help keep the room engaged.`
      : wpm <= 170
      ? `${wpm} WPM — slightly fast. Slow down just a little to let key points land.`
      : wpm <= 190
      ? `${wpm} WPM — too fast. The audience can't keep up. Take a breath and slow down.`
      : `${wpm} WPM — very fast. You're losing the room. Breathe and aim for 130–150 WPM.`

  // Clarity — filler word %
  const lower = transcript.toLowerCase()
  let fillerCount = 0
  FILLERS.forEach(f => {
    const hits = lower.match(new RegExp(`\\b${f}\\b`, 'g'))
    if (hits) fillerCount += hits.length
  })
  const fillerPct = (fillerCount / wordCount) * 100

  let clarityScore
  if (fillerPct < 2)       clarityScore = 93
  else if (fillerPct < 5)  clarityScore = 75
  else if (fillerPct < 10) clarityScore = 54
  else                     clarityScore = 28

  const clarityFeedback =
    fillerPct < 2
      ? `Only ${fillerCount} filler word${fillerCount !== 1 ? 's' : ''} detected. Clean, deliberate speech — the silence is doing the work.`
      : fillerPct < 5
      ? `${fillerCount} fillers (${fillerPct.toFixed(1)}%). Noticeable but manageable. Replace them with a breath or pause.`
      : fillerPct < 10
      ? `${fillerCount} fillers (${fillerPct.toFixed(1)}%). Fillers are diluting your message. Practice pausing instead of filling.`
      : `${fillerCount} fillers (${fillerPct.toFixed(1)}%). This is hurting your credibility. Record yourself daily and count them.`

  // Precision — lexical diversity
  const clean = words.map(w => w.toLowerCase().replace(/[^a-z]/g, '')).filter(Boolean)
  const uniqueCount = new Set(clean).size
  const diversity = uniqueCount / clean.length

  let precisionScore
  if (diversity > 0.65)      precisionScore = 92
  else if (diversity > 0.55) precisionScore = 75
  else if (diversity > 0.45) precisionScore = 56
  else                       precisionScore = 32

  const precisionFeedback =
    diversity > 0.65
      ? `Strong vocabulary range — ${uniqueCount} unique words out of ${wordCount}. Your language is varied and specific.`
      : diversity > 0.55
      ? `Good range — ${uniqueCount} unique words. Swap general terms for more precise ones.`
      : diversity > 0.45
      ? `Some repetition — ${uniqueCount} unique words out of ${wordCount}. Vary your language more.`
      : `High repetition — only ${uniqueCount} unique words out of ${wordCount}. Work on specificity and varied phrasing.`

  const overall = Math.round((paceScore + clarityScore + precisionScore) / 3)

  return {
    overall, wpm, wordCount, durationSeconds, fillerCount,
    pace:      { score: paceScore,      feedback: paceFeedback      },
    clarity:   { score: clarityScore,   feedback: clarityFeedback   },
    precision: { score: precisionScore, feedback: precisionFeedback },
  }
}

function overallLabel(score) {
  if (score >= 85) return 'Excellent'
  if (score >= 70) return 'Strong'
  if (score >= 55) return 'Developing'
  return 'Keep Practicing'
}

function scoreColor(score) {
  if (score >= 80) return '#7A9B76'
  if (score >= 60) return '#D4A574'
  return '#C85A3F'
}

function formatTime(s) {
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function ScoreRing({ score, animate }) {
  const r = 30
  const circ = 2 * Math.PI * r
  const color = scoreColor(score)
  return (
    <svg width="76" height="76" viewBox="0 0 72 72">
      <circle cx="36" cy="36" r={r} fill="none" stroke="#1A1A1A0D" strokeWidth="5" />
      <circle
        cx="36" cy="36" r={r}
        fill="none" stroke={color} strokeWidth="5"
        strokeDasharray={circ}
        strokeDashoffset={animate ? circ * (1 - score / 100) : circ}
        strokeLinecap="round"
        transform="rotate(-90 36 36)"
        style={{ transition: 'stroke-dashoffset 1.3s cubic-bezier(0.22,1,0.36,1)' }}
      />
      <text
        x="36" y="41"
        textAnchor="middle"
        fontSize="15" fontWeight="700" fill="#1A1A1A"
        fontFamily="Work Sans, sans-serif"
      >
        {score}
      </text>
    </svg>
  )
}

function ScoreCard({ label, data, delay, icon }) {
  const [animate, setAnimate] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setAnimate(true), delay)
    return () => clearTimeout(t)
  }, [delay])

  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: 16,
        padding: '18px 18px 16px',
        border: '1px solid #1A1A1A0D',
        opacity: animate ? 1 : 0,
        transform: animate ? 'translateY(0)' : 'translateY(12px)',
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <ScoreRing score={data.score} animate={animate} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 10, fontWeight: 600, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: scoreColor(data.score),
            marginBottom: 3,
          }}>
            {icon} {label}
          </div>
          <div style={{ fontSize: 12, color: '#1A1A1A', opacity: 0.55, lineHeight: 1.6 }}>
            {data.feedback}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main screen ─────────────────────────────────────────────────────────────

export default function EvaluatorScreen() {
  const [phase, setPhase]             = useState('idle')      // idle | recording | results
  const [transcript, setTranscript]   = useState('')
  const [interim, setInterim]         = useState('')
  const [elapsed, setElapsed]         = useState(0)
  const [results, setResults]         = useState(null)
  const [showFull, setShowFull]       = useState(false)
  const [supported, setSupported]     = useState(true)
  const [headerIn, setHeaderIn]       = useState(false)

  const recogRef       = useRef(null)
  const timerRef       = useRef(null)
  const startRef       = useRef(null)
  const transcriptRef  = useRef('')
  const isRecordingRef = useRef(false)
  const elapsedRef     = useRef(0)

  useEffect(() => {
    const t = setTimeout(() => setHeaderIn(true), 60)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      setSupported(false)
    }
  }, [])

  const startRecognition = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return
    const r = new SR()
    r.continuous = true
    r.interimResults = true
    r.lang = 'en-US'

    r.onresult = (e) => {
      let buf = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript
        if (e.results[i].isFinal) {
          transcriptRef.current += t + ' '
          setTranscript(transcriptRef.current)
        } else {
          buf += t
        }
      }
      setInterim(buf)
    }

    r.onend = () => {
      if (isRecordingRef.current) {
        try { r.start() } catch {}
      }
    }

    r.onerror = (e) => {
      if (e.error !== 'aborted' && isRecordingRef.current) {
        try { r.start() } catch {}
      }
    }

    try { r.start() } catch {}
    recogRef.current = r
  }, [])

  function start() {
    transcriptRef.current = ''
    elapsedRef.current = 0
    setTranscript('')
    setInterim('')
    setElapsed(0)
    setResults(null)
    setShowFull(false)
    isRecordingRef.current = true
    startRef.current = Date.now()
    setPhase('recording')
    startRecognition()
    timerRef.current = setInterval(() => {
      const s = Math.floor((Date.now() - startRef.current) / 1000)
      elapsedRef.current = s
      setElapsed(s)
    }, 500)
  }

  function stop() {
    isRecordingRef.current = false
    if (recogRef.current) recogRef.current.stop()
    clearInterval(timerRef.current)
    const final = transcriptRef.current.trim()
    const dur   = elapsedRef.current
    setResults(computeScores(final, dur))
    setPhase('results')
  }

  function reset() {
    setPhase('idle')
    setTranscript('')
    setInterim('')
    setElapsed(0)
    setResults(null)
    setShowFull(false)
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div style={{ minHeight: '100dvh', background: '#FAF7F0', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div
        className="px-6 pt-8 pb-4"
        style={{
          opacity: headerIn ? 1 : 0,
          transform: headerIn ? 'none' : 'translateY(10px)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
        }}
      >
        <div className="serif" style={{
          fontSize: 13, color: '#1A1A1A', opacity: 0.4,
          letterSpacing: '0.18em', textTransform: 'uppercase', fontStyle: 'italic',
          marginBottom: 6,
        }}>
          Speech Evaluator
        </div>
        <h1 className="serif" style={{
          fontSize: 'clamp(30px, 9vw, 42px)', lineHeight: 1.05,
          fontWeight: 400, color: '#1A1A1A', letterSpacing: '-0.02em',
          marginBottom: 0,
        }}>
          {phase === 'idle'      && <>How clear<br />is your voice?</>}
          {phase === 'recording' && <>Listening…</>}
          {phase === 'results'   && <>Your results.</>}
        </h1>
      </div>

      {/* ── IDLE ── */}
      {phase === 'idle' && (
        <div className="px-6 flex-1 flex flex-col">

          {/* Category pills */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
            {[
              { label: 'Clarity',   color: '#C85A3F' },
              { label: 'Pace',      color: '#5B8FA3' },
              { label: 'Precision', color: '#7A9B76' },
            ].map(({ label, color }) => (
              <div key={label} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '5px 12px', borderRadius: 20,
                border: `1px solid ${color}40`, background: `${color}12`,
              }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: color }} />
                <span style={{ fontSize: 12, fontWeight: 500, color: '#1A1A1A', opacity: 0.7 }}>
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Big record button */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, paddingBottom: 40 }}>
            <button
              onClick={supported ? start : undefined}
              disabled={!supported}
              style={{
                width: 96, height: 96, borderRadius: '50%',
                background: supported ? '#1A1A1A' : '#1A1A1A40',
                border: 'none', cursor: supported ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
              }}
              className="active:scale-95 transition-transform"
            >
              {/* Mic icon */}
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <rect x="13" y="4" width="10" height="16" rx="5" fill="#FAF7F0" />
                <path d="M8 18c0 5.523 4.477 10 10 10s10-4.477 10-10" stroke="#FAF7F0" strokeWidth="2.2" strokeLinecap="round" />
                <line x1="18" y1="28" x2="18" y2="33" stroke="#FAF7F0" strokeWidth="2.2" strokeLinecap="round" />
                <line x1="13" y1="33" x2="23" y2="33" stroke="#FAF7F0" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </button>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: '#1A1A1A', marginBottom: 4 }}>
                {supported ? 'Tap to begin recording' : 'Not supported in this browser'}
              </div>
              <div style={{ fontSize: 12, color: '#1A1A1A', opacity: 0.4 }}>
                {supported ? 'Speak for at least 30 seconds · Works best in Chrome' : 'Please open in Chrome or Edge'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── RECORDING ── */}
      {phase === 'recording' && (
        <div className="px-6 flex-1 flex flex-col" style={{ paddingBottom: 32 }}>

          {/* Timer */}
          <div style={{
            textAlign: 'center', marginBottom: 24,
            fontSize: 'clamp(48px, 14vw, 64px)',
            fontWeight: 700, color: '#1A1A1A',
            letterSpacing: '-0.04em', lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
          }}>
            {formatTime(elapsed)}
          </div>

          {/* Pulse + stop button */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
            <div style={{ position: 'relative', width: 96, height: 96 }}>
              {/* Pulse rings */}
              <div className="pulse-ring" style={{
                position: 'absolute', inset: -16,
                borderRadius: '50%', background: '#C85A3F22',
                pointerEvents: 'none',
              }} />
              <div className="pulse-ring" style={{
                position: 'absolute', inset: -8,
                borderRadius: '50%', background: '#C85A3F18',
                pointerEvents: 'none',
                animationDelay: '0.4s',
              }} />
              <button
                onClick={stop}
                style={{
                  width: 96, height: 96, borderRadius: '50%',
                  background: '#C85A3F', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative', zIndex: 1,
                  boxShadow: '0 4px 24px rgba(200,90,63,0.35)',
                }}
                className="active:scale-95 transition-transform"
              >
                {/* Stop square */}
                <div style={{ width: 26, height: 26, borderRadius: 5, background: '#FAF7F0' }} />
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'center', fontSize: 12, color: '#1A1A1A', opacity: 0.38, marginBottom: 20 }}>
            Tap to stop and score
          </div>

          {/* Live transcript */}
          <div style={{
            flex: 1, minHeight: 120, maxHeight: 220,
            background: '#FFFFFF', borderRadius: 14,
            border: '1px solid #1A1A1A0D',
            padding: '14px 16px', overflowY: 'auto',
          }}>
            <div style={{ fontSize: 11, color: '#1A1A1A', opacity: 0.3, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
              Live transcript
            </div>
            <div style={{ fontSize: 14, color: '#1A1A1A', lineHeight: 1.7, opacity: 0.75 }}>
              {transcript}
              <span style={{ color: '#1A1A1A', opacity: 0.35 }}>{interim}</span>
              {!transcript && !interim && (
                <span style={{ opacity: 0.3, fontStyle: 'italic' }}>Start speaking…</span>
              )}
            </div>
          </div>

          {/* Word count */}
          {transcript && (
            <div style={{ textAlign: 'right', fontSize: 11, color: '#1A1A1A', opacity: 0.3, marginTop: 6 }}>
              {transcript.trim().split(/\s+/).filter(Boolean).length} words
            </div>
          )}
        </div>
      )}

      {/* ── RESULTS ── */}
      {phase === 'results' && (
        <div className="px-6 pb-16 flex-1 flex flex-col">

          {results ? (
            <>
              {/* Overall score */}
              <div style={{
                background: '#FFFFFF', borderRadius: 16,
                padding: '20px 20px 18px',
                border: `1px solid ${scoreColor(results.overall)}30`,
                marginBottom: 12, textAlign: 'center',
              }}>
                <div style={{
                  fontSize: 'clamp(56px, 16vw, 72px)',
                  fontWeight: 700, color: scoreColor(results.overall),
                  lineHeight: 1, marginBottom: 4,
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  {results.overall}
                </div>
                <div className="serif" style={{
                  fontSize: 18, color: '#1A1A1A', opacity: 0.55,
                  fontStyle: 'italic', marginBottom: 10,
                }}>
                  {overallLabel(results.overall)}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 18 }}>
                  {[
                    { label: 'WPM',   value: results.wpm },
                    { label: 'Words', value: results.wordCount },
                    { label: 'Time',  value: formatTime(results.durationSeconds) },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A' }}>{value}</div>
                      <div style={{ fontSize: 10, color: '#1A1A1A', opacity: 0.35, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Score cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 }}>
                <ScoreCard label="Clarity"   data={results.clarity}   delay={100} icon="○" />
                <ScoreCard label="Pace"      data={results.pace}      delay={220} icon="→" />
                <ScoreCard label="Precision" data={results.precision} delay={340} icon="◇" />
              </div>

              {/* Transcript toggle */}
              <button
                onClick={() => setShowFull(v => !v)}
                style={{
                  background: 'none', border: '1px solid #1A1A1A14',
                  borderRadius: 10, padding: '10px 16px',
                  cursor: 'pointer', width: '100%', textAlign: 'left',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  marginBottom: showFull ? 0 : 16,
                }}
              >
                <span style={{ fontSize: 12, color: '#1A1A1A', opacity: 0.45 }}>Transcript</span>
                <span style={{ fontSize: 12, color: '#1A1A1A', opacity: 0.3 }}>{showFull ? '▲' : '▼'}</span>
              </button>

              {showFull && (
                <div style={{
                  background: '#FFFFFF', borderRadius: '0 0 12px 12px',
                  border: '1px solid #1A1A1A0D', borderTop: 'none',
                  padding: '14px 16px', marginBottom: 16,
                  maxHeight: 200, overflowY: 'auto',
                }}>
                  <p style={{ fontSize: 13, color: '#1A1A1A', opacity: 0.6, lineHeight: 1.7, margin: 0 }}>
                    {transcript || '(No transcript captured)'}
                  </p>
                </div>
              )}
            </>
          ) : (
            /* Not enough speech */
            <div style={{
              background: '#FFFFFF', borderRadius: 16,
              padding: '28px 20px', textAlign: 'center',
              border: '1px solid #1A1A1A0D', marginBottom: 16,
            }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🎙</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#1A1A1A', marginBottom: 6 }}>
                Not enough speech
              </div>
              <div style={{ fontSize: 13, color: '#1A1A1A', opacity: 0.5, lineHeight: 1.6 }}>
                We need at least 30 seconds to score accurately. Try again and keep going.
              </div>
            </div>
          )}

          {/* Try again */}
          <button
            onClick={reset}
            style={{
              width: '100%', padding: '15px 24px',
              background: '#1A1A1A', borderRadius: 40, border: 'none',
              color: '#FAF7F0', fontSize: 15, fontWeight: 600,
              cursor: 'pointer', letterSpacing: '0.02em', fontFamily: 'inherit',
            }}
            className="active:scale-95 transition-transform"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  )
}
