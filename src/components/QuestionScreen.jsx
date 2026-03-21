import { useState, useEffect, useRef } from 'react'
import MultipleChoice  from './MultipleChoice.jsx'
import SliderQuestion  from './SliderQuestion.jsx'
import RankingQuestion from './RankingQuestion.jsx'

export default function QuestionScreen({ questions, onComplete }) {
  const [currentIndex, setCurrentIndex]   = useState(0)
  const [answers, setAnswers]             = useState([])
  const [currentAnswer, setCurrentAnswer] = useState(null)
  const [cardVisible, setCardVisible]     = useState(true)

  const total   = questions.length
  const current = questions[currentIndex]
  const isLast  = currentIndex === total - 1

  // Reset answer state when question changes
  useEffect(() => {
    setCurrentAnswer(null)
    setCardVisible(true)
  }, [currentIndex])

  // Slider starts valid at 50
  const isAnswered = (() => {
    if (!current) return false
    if (current.type === 'multiple_choice') return currentAnswer !== null
    if (current.type === 'slider')          return true // valid once slider exists (starts at 50)
    if (current.type === 'ranking')         return true // always valid (has default order)
    return false
  })()

  // Default slider value
  const effectiveAnswer = (() => {
    if (current?.type === 'slider' && currentAnswer === null) return 50
    return currentAnswer
  })()

  const handleMultipleChoiceSelect = (letter, track) => {
    setCurrentAnswer({ letter, track })
  }

  const handleSliderChange = (pos) => {
    setCurrentAnswer(pos)
  }

  const handleRankingChange = (orderedItems) => {
    setCurrentAnswer(orderedItems)
  }

  const handleNext = () => {
    // Build answer record
    let answerValue
    if (current.type === 'multiple_choice') {
      answerValue = currentAnswer.track
    } else if (current.type === 'slider') {
      answerValue = {
        pos:        effectiveAnswer,
        leftTrack:  current.leftTrack,
        rightTrack: current.rightTrack,
      }
    } else if (current.type === 'ranking') {
      // Default order if never touched
      answerValue = currentAnswer ?? current.items
    }

    const newAnswer = {
      questionId: current.id,
      type:       current.type,
      value:      answerValue,
    }

    const newAnswers = [...answers, newAnswer]

    if (isLast) {
      onComplete(newAnswers)
      return
    }

    // Animate card out, then advance
    setCardVisible(false)
    setTimeout(() => {
      setAnswers(newAnswers)
      setCurrentIndex(prev => prev + 1)
    }, 200)
  }

  const handleBack = () => {
    if (currentIndex === 0) return
    setCardVisible(false)
    setTimeout(() => {
      setAnswers(prev => prev.slice(0, -1))
      setCurrentIndex(prev => prev - 1)
    }, 200)
  }

  const progressPct = ((currentIndex) / total) * 100

  return (
    <div
      className="flex flex-col min-h-dvh"
      style={{ background: '#FAF7F0' }}
    >
      {/* Progress bar */}
      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: '#FAF7F0', paddingTop: 16, paddingBottom: 8, paddingLeft: 24, paddingRight: 24 }}>
        <div className="flex justify-between items-center mb-2">
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: '#1A1A1A',
              opacity: 0.4,
            }}
          >
            Question {currentIndex + 1} of {total}
          </span>
          <span
            style={{
              fontSize: 11,
              color: '#1A1A1A',
              opacity: 0.35,
            }}
          >
            {Math.round(progressPct)}%
          </span>
        </div>
        <div
          style={{
            height: 3,
            background: 'rgba(26,26,26,0.1)',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progressPct}%`,
              background: '#C85A3F',
              borderRadius: 2,
              transition: 'width 0.4s ease',
            }}
          />
        </div>
      </div>

      {/* Question card */}
      <div
        className="flex-1 px-6 pb-6"
        style={{
          opacity: cardVisible ? 1 : 0,
          transform: cardVisible ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity 0.22s ease, transform 0.22s ease',
        }}
      >
        <div
          className="rounded-3xl p-6 mb-5"
          style={{
            background: '#FFFFFF',
            boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
            marginTop: 12,
          }}
        >
          {/* Question type label */}
          {current.label && (
            <div
              style={{
                fontSize: 10,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                color: '#C85A3F',
                opacity: 0.7,
                marginBottom: 10,
              }}
            >
              {current.label}
            </div>
          )}

          {/* Question text */}
          <h2
            className="serif"
            style={{
              fontSize: 'clamp(17px, 4.5vw, 21px)',
              lineHeight: 1.4,
              color: '#1A1A1A',
              marginBottom: current.type !== 'multiple_choice' ? 24 : 20,
              fontWeight: 400,
            }}
          >
            {current.text}
          </h2>

          {/* Question input */}
          {current.type === 'multiple_choice' && (
            <MultipleChoice
              question={current}
              selected={currentAnswer?.letter ?? null}
              onSelect={handleMultipleChoiceSelect}
            />
          )}

          {current.type === 'slider' && (
            <SliderQuestion
              question={current}
              value={currentAnswer}
              onChange={handleSliderChange}
            />
          )}

          {current.type === 'ranking' && (
            <RankingQuestion
              question={current}
              value={currentAnswer ? currentAnswer.map(item =>
                current.items.findIndex(i => i.text === item.text)
              ) : null}
              onChange={handleRankingChange}
            />
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          {currentIndex > 0 && (
            <button
              onClick={handleBack}
              className="py-4 px-6 rounded-full font-semibold transition-all active:scale-95"
              style={{
                background: 'transparent',
                border: '1.5px solid rgba(26,26,26,0.18)',
                color: '#1A1A1A',
                fontSize: 14,
              }}
            >
              ← Back
            </button>
          )}

          <button
            onClick={handleNext}
            disabled={!isAnswered && current.type === 'multiple_choice'}
            className="flex-1 py-4 rounded-full font-semibold transition-all active:scale-[0.98]"
            style={{
              background: isAnswered ? '#1A1A1A' : 'rgba(26,26,26,0.08)',
              color: isAnswered ? '#FAF7F0' : 'rgba(26,26,26,0.3)',
              fontSize: 15,
              cursor: isAnswered ? 'pointer' : 'default',
              transition: 'all 0.2s ease',
            }}
          >
            {isLast ? 'See My Results →' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  )
}
