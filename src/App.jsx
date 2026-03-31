import { useState, useEffect, useRef } from 'react'
import LandingScreen     from './components/LandingScreen.jsx'
import QuestionScreen    from './components/QuestionScreen.jsx'
import ResultsScreen     from './components/ResultsScreen.jsx'
import CurriculumScreen  from './components/CurriculumScreen.jsx'
import { computeResults } from './utils/archpathScoring.js'
import { questions } from './data/questions.js'

const SCREENS = {
  LANDING:    'landing',
  QUESTIONS:  'questions',
  RESULTS:    'results',
  CURRICULUM: 'curriculum',
}

function ScreenTransition({ screenKey, children }) {
  const [visible, setVisible] = useState(false)
  const prevKey = useRef(null)

  useEffect(() => {
    if (prevKey.current !== screenKey) {
      setVisible(false)
      const t = setTimeout(() => setVisible(true), 40)
      prevKey.current = screenKey
      return () => clearTimeout(t)
    }
  }, [screenKey])

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
        transition: 'opacity 0.4s ease, transform 0.4s ease',
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {children}
    </div>
  )
}

export default function App() {
  const [screen,  setScreen]  = useState(SCREENS.LANDING)
  const [answers, setAnswers] = useState([])
  const [results, setResults] = useState(null)

  const handleStart = () => setScreen(SCREENS.QUESTIONS)
  const handleCurriculum = () => setScreen(SCREENS.CURRICULUM)

  const handleComplete = (allAnswers) => {
    const scored = computeResults(allAnswers)
    setAnswers(allAnswers)
    setResults(scored)
    setScreen(SCREENS.RESULTS)
  }

  const handleRestart = () => {
    setAnswers([])
    setResults(null)
    setScreen(SCREENS.LANDING)
  }

  return (
    <div className="max-w-lg mx-auto bg-[#FAF7F0] relative" style={{ minHeight: '100dvh' }}>
      <ScreenTransition screenKey={screen}>
        {screen === SCREENS.LANDING && (
          <LandingScreen onStart={handleStart} onCurriculum={handleCurriculum} />
        )}
        {screen === SCREENS.CURRICULUM && (
          <CurriculumScreen onBack={() => setScreen(SCREENS.LANDING)} />
        )}
        {screen === SCREENS.QUESTIONS && (
          <QuestionScreen
            questions={questions}
            onComplete={handleComplete}
          />
        )}
        {screen === SCREENS.RESULTS && results && (
          <ResultsScreen
            results={results}
            onRestart={handleRestart}
          />
        )}
      </ScreenTransition>
    </div>
  )
}
