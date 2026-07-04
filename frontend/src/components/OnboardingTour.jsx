import { useEffect } from 'react'
import introJs from 'intro.js'
import 'intro.js/introjs.css'

export default function OnboardingTour({ onComplete }) {
  useEffect(() => {
    const hasSeenTour = localStorage.getItem('solarsathi_tour_done')
    if (hasSeenTour) return

    const intro = introJs()
    intro.setOptions({
      steps: [
        {
          title: '☀️ Welcome to SolarSathi!',
          intro: 'Your AI-powered solar monitoring platform. Let us show you around.',
        },
        {
          element: document.querySelector('.sidebar-nav'),
          title: '🧭 Navigation',
          intro: 'Use the sidebar to switch between Dashboard, Add Plant, Profile, and AI Assistant.',
          position: 'right',
        },
        {
          element: document.querySelector('.plant-card'),
          title: '🔆 Your Plants',
          intro: 'Each plant card shows your solar plant. Click "Run Prediction" to get today\'s energy forecast.',
          position: 'bottom',
        },
        {
          element: document.querySelector('.section-header'),
          title: '📊 Email Report',
          intro: 'Click "Email Report" to get an AI-generated analysis of your plant performance sent to your email.',
          position: 'bottom',
        },
      ],
      nextLabel: 'Next →',
      prevLabel: '← Back',
      doneLabel: 'Get Started ☀️',
      showProgress: true,
      showBullets: false,
      overlayOpacity: 0.6,
    })

    intro.oncomplete(() => {
      localStorage.setItem('solarsathi_tour_done', 'true')
      onComplete?.()
    })

    intro.onexit(() => {
      localStorage.setItem('solarsathi_tour_done', 'true')
    })

    // Small delay so DOM elements are ready
    setTimeout(() => intro.start(), 800)
  }, [])

  return null
}
