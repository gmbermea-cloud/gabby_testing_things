import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'

const ED = { fontFamily: "'Playfair Display', Georgia, serif" }

/**
 * ShareScreen — renders a 9:16 share card and exports it as PNG.
 * The card is scaled to fit the viewport but the export is full 1080×1920.
 */
export default function ShareScreen({ results, onBack }) {
  const { personalityType, topCareers } = results
  const cardRef = useRef(null)
  const [exporting, setExporting] = useState(false)
  const [exported, setExported]   = useState(false)

  const handleExport = async () => {
    if (!cardRef.current || exporting) return
    setExporting(true)
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: null,
        logging: false,
        width: 360,
        height: 640,
      })
      const dataUrl = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.href = dataUrl
      link.download = `ground-up-${personalityType.id}.png`
      link.click()
      setExported(true)
    } catch (err) {
      console.error('Export failed:', err)
    } finally {
      setExporting(false)
    }
  }

  const top3 = topCareers.slice(0, 3)

  return (
    <div className="flex flex-col min-h-dvh bg-[#E8E3DB] fade-up">
      {/* Back */}
      <div className="px-6 pt-8 pb-4">
        <button
          onClick={onBack}
          style={{ fontSize: 13, color: '#1C1915', opacity: 0.4, display: 'flex', alignItems: 'center', gap: 6 }}
        >
          ← Back to Results
        </button>
      </div>

      <div className="px-6 pb-4">
        <h2 style={{ ...ED, fontSize: 24, fontWeight: 900, color: '#1C1915' }}>Share Card</h2>
        <p style={{ fontSize: 12, color: '#1C1915', opacity: 0.4, marginTop: 4 }}>9:16 — ready for Instagram Stories</p>
      </div>

      {/* Card preview */}
      <div className="flex-1 flex items-start justify-center px-4 pb-4 overflow-y-auto">
        <div style={{ width: '100%', maxWidth: 320 }}>
          {/* Actual card — 360×640, scaled via CSS */}
          <div
            ref={cardRef}
            style={{
              width: 360,
              height: 640,
              background: '#E8E3DB',
              position: 'relative',
              overflow: 'hidden',
              transform: 'scale(0.889)',
              transformOrigin: 'top left',
              borderRadius: 32,
              fontFamily: "'Playfair Display', Georgia, serif",
              border: '1px solid rgba(28,25,21,0.12)',
            }}
          >
            {/* Blob decoration */}
            <div style={{
              position: 'absolute',
              width: 200, height: 200,
              borderRadius: '62% 38% 54% 46% / 48% 56% 44% 52%',
              background: 'radial-gradient(ellipse at 38% 34%, #DDD3C4 0%, #C8B09A 50%, #B09278 100%)',
              top: -40, right: -40,
              opacity: 0.6,
            }} />

            {/* Thin top line */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0,
              height: 1,
              background: 'rgba(28,25,21,0.15)',
            }} />

            {/* Content */}
            <div style={{ padding: '40px 32px', height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', position: 'relative' }}>

              {/* Brand */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 36 }}>
                <span style={{ fontSize: 13, fontStyle: 'italic', fontWeight: 400, color: '#1C1915', opacity: 0.6 }}>
                  Ground Up
                </span>
              </div>

              {/* Label */}
              <div style={{ marginBottom: 6 }}>
                <div style={{
                  display: 'inline-block',
                  border: '1px solid rgba(28,25,21,0.2)',
                  borderRadius: 100,
                  padding: '3px 12px',
                  fontSize: 9,
                  color: '#1C1915',
                  opacity: 0.45,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  marginBottom: 10,
                }}>
                  My Career DNA
                </div>
              </div>

              {/* Personality type */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 10, color: '#1C1915', opacity: 0.3, fontWeight: 600, marginBottom: 4, letterSpacing: '0.1em' }}>
                  I AM
                </div>
                <div style={{ fontSize: 44, fontWeight: 900, lineHeight: 1.0, color: '#1C1915', letterSpacing: '-1px' }}>
                  {personalityType.label}
                </div>
              </div>

              {/* Description */}
              <div style={{ fontSize: 12, color: '#1C1915', opacity: 0.5, lineHeight: 1.65, marginBottom: 28, fontStyle: 'italic', fontWeight: 400 }}>
                {personalityType.description.slice(0, 130)}…
              </div>

              {/* Top matches */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 9, color: '#1C1915', opacity: 0.3, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 10 }}>
                  Top Career Matches
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {top3.map((match, i) => (
                    <div key={match.career.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      border: '1px solid rgba(28,25,21,0.1)',
                      borderRadius: 14,
                      padding: '10px 14px',
                      background: i === 0 ? 'rgba(28,25,21,0.04)' : 'transparent',
                    }}>
                      <div style={{
                        width: 26, height: 26,
                        borderRadius: 8,
                        background: i === 0 ? '#1C1915' : 'rgba(28,25,21,0.07)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11,
                        fontWeight: 700,
                        color: i === 0 ? '#E8E3DB' : 'rgba(28,25,21,0.4)',
                        flexShrink: 0,
                      }}>
                        #{i + 1}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#1C1915', lineHeight: 1 }}>
                          {match.career.title}
                        </div>
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 900, color: '#1C1915', opacity: 0.65, flexShrink: 0 }}>
                        {match.matchPercent}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div style={{
                marginTop: 20,
                paddingTop: 14,
                borderTop: '1px solid rgba(28,25,21,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div style={{ fontSize: 10, color: '#1C1915', opacity: 0.25, fontStyle: 'italic' }}>
                  groundup.app
                </div>
                <div style={{
                  background: '#1C1915',
                  color: '#E8E3DB',
                  borderRadius: 100,
                  padding: '5px 14px',
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                }}>
                  Take the quiz →
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 pb-10 pt-3 flex flex-col gap-3">
        <button
          onClick={handleExport}
          disabled={exporting}
          className="w-full py-4 rounded-full font-bold text-base tracking-wide active:scale-95 transition-all"
          style={{
            background: exporting ? 'rgba(28,25,21,0.06)' : '#1C1915',
            color: exporting ? 'rgba(28,25,21,0.35)' : '#E8E3DB',
            letterSpacing: '0.06em',
          }}
        >
          {exporting ? 'Exporting…' : exported ? 'Downloaded! Save to Camera Roll' : 'Export as PNG'}
        </button>
        {exported && (
          <p style={{ textAlign: 'center', fontSize: 11, color: '#1C1915', opacity: 0.35 }}>
            Saved to your downloads. Add to your Instagram Story!
          </p>
        )}
      </div>
    </div>
  )
}
