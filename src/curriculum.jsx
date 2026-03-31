import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import CurriculumScreen from './components/CurriculumScreen.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className="max-w-lg mx-auto bg-[#FAF7F0] relative" style={{ minHeight: '100dvh' }}>
      <CurriculumScreen />
    </div>
  </StrictMode>
)
