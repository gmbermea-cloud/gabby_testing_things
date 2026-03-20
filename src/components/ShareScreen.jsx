import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'

/**
 * ShareScreen — renders a 9:16 share card and exports it as PNG.
 * The card is scaled to fit the viewport but the export is full 1080×1920.
 */
export default function ShareScreen({ results, onBack }) {
  const { personalityType, topCareers } = results
  const cardRef = useRef(null)
  const [exporting, setExporting] = useState(false)
  const [exported, setExported] = useState(false)

  const handleExport = async () => {
    if (!cardRef.current || exporting) return
    setExporting(true)

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,           // 3× pixel density for crisp export
        useCORS: true,
        backgroundColor: null,
        logging: false,
        width: 360,         // design width
        height: 640,        // 9:16 at design width
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
    <div className="flex flex-col min-h-dvh bg-[#0D1B4B]">
      {/* Back button */}
      <div className="px-6 pt-8 pb-4">
        <button
          onClick={onBack}
          className="text-white/40 text-sm flex items-center gap-2 active:text-white/70 transition-colors"
        >
          ← Back to Results
        </button>
      </div>

      <div className="px-6 pb-4">
        <h2 className="text-white font-black text-2xl">Share Card</h2>
        <p className="text-white/40 text-sm mt-1">9:16 — ready for Instagram Stories</p>
      </div>

      {/* Card preview (scaled to fit) */}
      <div className="flex-1 flex items-start justify-center px-4 pb-4 overflow-y-auto">
        <div
          className="relative"
          style={{
            width: '100%',
            maxWidth: '320px',
          }}
        >
          {/* Actual card — fixed 360×640 design, scaled via CSS */}
          <div
            ref={cardRef}
            style={{
              width: '360px',
              height: '640px',
              background: 'linear-gradient(145deg, #0D1B4B 0%, #162354 40%, #0a1538 100%)',
              position: 'relative',
              overflow: 'hidden',
              transform: 'scale(0.889)',
              transformOrigin: 'top left',
              borderRadius: '32px',
              fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif',
            }}
          >
            {/* Background geometric accents */}
            <div style={{
              position: 'absolute', top: -60, right: -60,
              width: 200, height: 200,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%)',
            }} />
            <div style={{
              position: 'absolute', bottom: -40, left: -40,
              width: 160, height: 160,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)',
            }} />

            {/* Top gold line */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0,
              height: 4,
              background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)',
            }} />

            {/* Content */}
            <div style={{ padding: '40px 32px', height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>

              {/* Logo */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
                <div style={{
                  width: 36, height: 36,
                  borderRadius: 10,
                  border: '1.5px solid #C9A84C',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ color: '#C9A84C', fontWeight: 900, fontSize: 13 }}>GU</span>
                </div>
                <div>
                  <div style={{ color: 'white', fontWeight: 900, fontSize: 14, lineHeight: 1 }}>Ground Up</div>
                  <div style={{ color: 'rgba(201,168,76,0.7)', fontSize: 10, letterSpacing: 1 }}>Find what you're built for.</div>
                </div>
              </div>

              {/* Type label */}
              <div style={{ marginBottom: 8 }}>
                <div style={{
                  display: 'inline-block',
                  background: 'rgba(201,168,76,0.15)',
                  border: '1px solid rgba(201,168,76,0.3)',
                  borderRadius: 100,
                  padding: '4px 14px',
                  color: '#C9A84C',
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 1.5,
                  textTransform: 'uppercase',
                  marginBottom: 12,
                }}>
                  My Career DNA
                </div>
              </div>

              {/* Personality type */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 600, marginBottom: 4, letterSpacing: 1 }}>
                  I AM
                </div>
                <div style={{ color: 'white', fontSize: 42, fontWeight: 900, lineHeight: 1.05, letterSpacing: -1 }}>
                  {personalityType.label}
                </div>
              </div>

              {/* Description */}
              <div style={{
                color: 'rgba(255,255,255,0.55)',
                fontSize: 13,
                lineHeight: 1.6,
                marginBottom: 28,
                flex: '0 0 auto',
              }}>
                {personalityType.description.slice(0, 140)}…
              </div>

              {/* Top matches */}
              <div style={{ flex: 1 }}>
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>
                  Top Career Matches
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {top3.map((match, i) => (
                    <div key={match.career.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 14,
                      padding: '10px 14px',
                    }}>
                      <div style={{
                        width: 28, height: 28,
                        borderRadius: 8,
                        background: i === 0 ? '#C9A84C' : 'rgba(255,255,255,0.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: i === 0 ? '#0D1B4B' : 'rgba(255,255,255,0.5)',
                        fontWeight: 900,
                        fontSize: 12,
                        flexShrink: 0,
                      }}>
                        #{i + 1}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ color: 'white', fontWeight: 700, fontSize: 14, lineHeight: 1 }}>{match.career.title}</div>
                      </div>
                      <div style={{ color: '#C9A84C', fontWeight: 900, fontSize: 16, flexShrink: 0 }}>
                        {match.matchPercent}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom CTA */}
              <div style={{
                marginTop: 20,
                paddingTop: 16,
                borderTop: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11 }}>
                  groundup.app
                </div>
                <div style={{
                  background: '#C9A84C',
                  color: '#0D1B4B',
                  borderRadius: 100,
                  padding: '6px 14px',
                  fontSize: 11,
                  fontWeight: 900,
                }}>
                  Take the quiz →
                </div>
              </div>
            </div>

            {/* Bottom gold line */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              height: 3,
              background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)',
            }} />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 pb-10 pt-3 flex flex-col gap-3">
        <button
          onClick={handleExport}
          disabled={exporting}
          className={`w-full py-4 rounded-2xl font-black text-lg transition-all active:scale-95
            ${exporting
              ? 'bg-white/10 text-white/40 cursor-not-allowed'
              : 'bg-[#C9A84C] text-[#0D1B4B] shadow-lg shadow-[#C9A84C]/20'}`}
        >
          {exporting ? 'Exporting…' : exported ? 'Downloaded! Save to Camera Roll' : 'Export as PNG'}
        </button>

        {exported && (
          <p className="text-center text-white/40 text-xs">
            Saved to your downloads. Add to your Instagram Story!
          </p>
        )}
      </div>
    </div>
  )
}
