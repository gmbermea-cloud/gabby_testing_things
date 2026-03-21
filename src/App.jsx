import { useState, useEffect, useRef } from 'react'
import LandingScreen  from './components/LandingScreen.jsx'
import SwipeScreen    from './components/SwipeScreen.jsx'
import TradeoffScreen from './components/TradeoffScreen.jsx'
import EmailGateScreen from './components/EmailGateScreen.jsx'
import ResultsScreen  from './components/ResultsScreen.jsx'
import ShareScreen    from './components/ShareScreen.jsx'
import { runFullScoring } from './utils/scoring.js'
import { swipeCards, tradeoffPairs } from './data/careers.js'

/**
 * Ground Up — App state machine
 *
 * Screens:
 *   landing → swipe → tradeoff → email (optional) → results → share
 */

const SCREENS = {
  LANDING:  'landing',
  SWIPE:    'swipe',
  TRADEOFF: 'tradeoff',
  EMAIL:    'email',
  RESULTS:  'results',
  SHARE:    'share',
}

function ScreenTransition({ screenKey, children }) {
  const [visible, setVisible] = useState(false)
  const prevKey = useRef(null)

  useEffect(() => {
    if (prevKey.current !== screenKey) {
      setVisible(false)
      const t = setTimeout(() => setVisible(true), 30)
      prevKey.current = screenKey
      return () => clearTimeout(t)
    }
  }, [screenKey])

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.45s ease',
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
  const [screen, setScreen]                 = useState(SCREENS.LANDING)
  const [swipeResponses, setSwipeResponses] = useState([])
  const [tradeoffChoices, setTradeoffChoices] = useState([])
  const [results, setResults]               = useState(null)
  const [email, setEmail]                   = useState(null)

  // ── Transitions ─────────────────────────────────────────────────────────────

  const handleStart = () => setScreen(SCREENS.SWIPE)

  const handleSwipeComplete = (responses) => {
    setSwipeResponses(responses)
    setScreen(SCREENS.TRADEOFF)
  }

  const handleTradeoffComplete = (choices) => {
    setTradeoffChoices(choices)
    setScreen(SCREENS.EMAIL)
  }

  const computeAndShowResults = (emailValue = null) => {
    const scored = runFullScoring(swipeResponses, tradeoffChoices, swipeCards, tradeoffPairs)
    setResults(scored)
    if (emailValue) setEmail(emailValue)
    setScreen(SCREENS.RESULTS)
  }

  const handleEmailContinue = (emailValue) => computeAndShowResults(emailValue)
  const handleEmailSkip     = ()           => computeAndShowResults(null)

  const handleShare = () => setScreen(SCREENS.SHARE)
  const handleBackToResults = () => setScreen(SCREENS.RESULTS)

  const handleRestart = () => {
    setScreen(SCREENS.LANDING)
    setSwipeResponses([])
    setTradeoffChoices([])
    setResults(null)
    setEmail(null)
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-md mx-auto bg-[#E8E3DB] relative" style={{ minHeight: '100dvh' }}>
      <ScreenTransition screenKey={screen}>
        {screen === SCREENS.LANDING  && <LandingScreen   onStart={handleStart} />}
        {screen === SCREENS.SWIPE    && <SwipeScreen     onComplete={handleSwipeComplete} />}
        {screen === SCREENS.TRADEOFF && <TradeoffScreen  onComplete={handleTradeoffComplete} />}
        {screen === SCREENS.EMAIL    && (
          <EmailGateScreen
            onContinue={handleEmailContinue}
            onSkip={handleEmailSkip}
          />
        )}
        {screen === SCREENS.RESULTS  && results && (
          <ResultsScreen
            results={results}
            onShare={handleShare}
            onRestart={handleRestart}
          />
        )}
        {screen === SCREENS.SHARE    && results && (
          <ShareScreen
            results={results}
            onBack={handleBackToResults}
          />
        )}
      </ScreenTransition>
    </div>
  )
}
