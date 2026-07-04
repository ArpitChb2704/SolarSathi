import { useState, useEffect } from 'react'

const steps = [
  {
    title: '☀️ Welcome to SolarSathi!',
    desc: 'Your AI-powered solar monitoring platform. Let us show you around.',
    target: null,
  },
  {
    title: '🧭 Navigation',
    desc: 'Use the sidebar to switch between Dashboard, Add Plant, Profile, and AI Assistant.',
    target: '.sidebar-nav',
  },
  {
    title: '🔆 Your Plants',
    desc: 'Each plant card shows your solar plant. Click "Run Prediction" to get today\'s energy forecast.',
    target: '.plant-card',
  },
  {
    title: '📊 Email Report',
    desc: 'Click "Email Report" to get an AI-generated performance analysis sent to your email.',
    target: '.section-header',
  },
  {
    title: '🤖 AI Assistant',
    desc: 'Ask the AI anything about your plants, predictions, or performance.',
    target: null,
  },
]

export default function OnboardingTour() {
  const [step, setStep] = useState(0)
  const [visible, setVisible] = useState(false)
  const [pos, setPos] = useState({ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' })

  useEffect(() => {
    const done = localStorage.getItem('solarsathi_tour_done')
    if (!done) setTimeout(() => setVisible(true), 800)
  }, [])

  useEffect(() => {
    if (!visible) return
    const target = steps[step].target
    if (!target) {
      setPos({ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' })
      return
    }
    const el = document.querySelector(target)
    if (!el) return
    const rect = el.getBoundingClientRect()
    setPos({
      top: rect.bottom + 12 + 'px',
      left: rect.left + 'px',
      transform: 'none',
    })
  }, [step, visible])

  const finish = () => {
    localStorage.setItem('solarsathi_tour_done', 'true')
    setVisible(false)
  }

  if (!visible) return null

  const current = steps[step]
  const isLast = step === steps.length - 1

  return (
    <>
      {/* Overlay */}
      <div
        onClick={finish}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.6)',
          zIndex: 9998,
          backdropFilter: 'blur(2px)',
        }}
      />

      {/* Tooltip */}
      <div style={{
        position: 'fixed',
        ...pos,
        zIndex: 9999,
        width: 320,
        background: 'rgba(10,14,23,0.98)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(245,200,66,0.35)',
        borderRadius: 16,
        padding: '24px',
        boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
      }}>
        {/* Progress dots */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
          {steps.map((_, i) => (
            <div key={i} style={{
              width: i === step ? 20 : 6,
              height: 6,
              borderRadius: 3,
              background: i === step ? '#f5c842' : 'rgba(255,255,255,0.15)',
              transition: 'all 0.3s',
            }} />
          ))}
        </div>

        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 17, fontWeight: 800,
          color: '#fff', marginBottom: 10,
        }}>
          {current.title}
        </div>

        <div style={{
          fontSize: 14, color: 'rgba(255,255,255,0.6)',
          lineHeight: 1.6, marginBottom: 20,
        }}>
          {current.desc}
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={finish}
            style={{
              background: 'none', border: 'none',
              color: 'rgba(255,255,255,0.3)',
              fontSize: 13, cursor: 'pointer',
              fontFamily: 'var(--font-body)',
            }}
          >
            Skip tour
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            {step > 0 && (
              <button
                onClick={() => setStep(s => s - 1)}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 8, padding: '8px 16px',
                  color: '#fff', fontSize: 13,
                  cursor: 'pointer', fontFamily: 'var(--font-body)',
                }}
              >
                ← Back
              </button>
            )}
            <button
              onClick={() => isLast ? finish() : setStep(s => s + 1)}
              style={{
                background: 'linear-gradient(135deg, #f5c842, #ff9f1c)',
                border: 'none', borderRadius: 8,
                padding: '8px 20px',
                color: '#0a0e17', fontWeight: 700,
                fontSize: 13, cursor: 'pointer',
                fontFamily: 'var(--font-body)',
              }}
            >
              {isLast ? 'Get Started ☀️' : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
