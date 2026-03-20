import { useEffect, useState } from 'react'

export default function LandingScreen({ onStart }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="flex flex-col min-h-dvh bg-[#0D1B4B] items-center justify-between px-6 py-12">
      {/* Top accent line */}
      <div className="w-16 h-1 rounded-full bg-[#C9A84C] opacity-60" />

      {/* Center content */}
      <div
        className="flex flex-col items-center gap-6 text-center transition-all duration-700"
        style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)' }}
      >
        {/* Logo mark */}
        <div className="relative w-20 h-20 flex items-center justify-center">
          <div className="absolute inset-0 rounded-2xl bg-[#C9A84C] opacity-15 blur-xl" />
          <div className="relative w-20 h-20 rounded-2xl border-2 border-[#C9A84C] flex items-center justify-center">
            <span className="text-3xl font-black text-[#C9A84C]">GU</span>
          </div>
        </div>

        <div>
          <h1 className="text-5xl font-black text-white tracking-tight leading-none">
            Ground Up
          </h1>
          <p className="mt-3 text-[#C9A84C] text-lg font-medium tracking-wide">
            Find what you're built for.
          </p>
        </div>

        <p className="text-white/60 text-base max-w-xs leading-relaxed">
          A 10-minute career clarity experience built on how you actually think — not who you think you should be.
        </p>

        {/* Step pills */}
        <div className="flex flex-col gap-2 w-full max-w-xs mt-2">
          {[
            { step: '01', label: '30 honest reactions' },
            { step: '02', label: '10 forced choices' },
            { step: '03', label: 'Your career DNA' },
          ].map(({ step, label }) => (
            <div key={step} className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 border border-white/10">
              <span className="text-[#C9A84C] font-black text-sm font-mono">{step}</span>
              <span className="text-white/70 text-sm">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="w-full max-w-xs flex flex-col gap-3">
        <button
          onClick={onStart}
          className="w-full py-4 rounded-2xl bg-[#C9A84C] text-[#0D1B4B] font-black text-lg tracking-tight
                     active:scale-95 transition-transform shadow-lg shadow-[#C9A84C]/20"
        >
          Start Building →
        </button>
        <p className="text-center text-white/30 text-xs">
          No sign-up required · Takes ~10 minutes
        </p>
      </div>
    </div>
  )
}
