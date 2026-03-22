export default function MultipleChoice({ question, selected, onSelect }) {
  return (
    <div className="flex flex-col gap-3">
      {question.options.map((opt) => {
        const isActive = selected === opt.letter
        return (
          <button
            key={opt.letter}
            onClick={() => onSelect(opt.letter, opt.track)}
            className="w-full text-left flex items-start gap-3 px-4 py-4 rounded-2xl transition-all active:scale-[0.98]"
            style={{
              background: isActive ? '#1A1A1A' : '#FFFFFF',
              border: isActive ? '1.5px solid #1A1A1A' : '1.5px solid rgba(26,26,26,0.12)',
              color: isActive ? '#FAF7F0' : '#1A1A1A',
              boxShadow: isActive ? '0 4px 16px rgba(0,0,0,0.12)' : '0 1px 4px rgba(0,0,0,0.04)',
              transform: isActive ? 'translateX(2px)' : 'translateX(0)',
              transition: 'all 0.18s ease',
            }}
          >
            {/* Letter badge */}
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontSize: 12,
                fontWeight: 600,
                background: isActive ? 'rgba(250,247,240,0.15)' : 'rgba(26,26,26,0.06)',
                color: isActive ? '#FAF7F0' : '#1A1A1A',
                marginTop: 1,
              }}
            >
              {opt.letter}
            </div>
            <span style={{ fontSize: 14, lineHeight: 1.55, paddingTop: 4 }}>
              {opt.text}
            </span>
          </button>
        )
      })}
    </div>
  )
}
