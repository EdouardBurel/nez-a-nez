import { useCallback, useEffect, useRef, useState } from 'react'
import hotspots from './hotspots.js'
import Scene from './components/Scene.jsx'
import Lightbox from './components/Lightbox.jsx'
import AudioPlayer from './components/AudioPlayer.jsx'

export default function App() {
  const [active, setActive] = useState(null) // hotspot ouvert dans la pop-up
  const [closing, setClosing] = useState(false)
  const debug = new URLSearchParams(window.location.search).has('debug')
  const closeTimer = useRef(null)

  const openHotspot = useCallback((spot) => {
    clearTimeout(closeTimer.current)
    setClosing(false)
    setActive(spot)
  }, [])

  const closeLightbox = useCallback(() => {
    setClosing(true)
    closeTimer.current = setTimeout(() => {
      setActive(null)
      setClosing(false)
    }, 320) // durée du fondu de sortie (voir styles.css)
  }, [])

  // Fermeture avec la touche Échap
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') closeLightbox()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closeLightbox])

  return (
    <div className="app">
      <Scene hotspots={hotspots} onSelect={openHotspot} debug={debug} paused={!!active} />

      {active && (
        <Lightbox spot={active} closing={closing} onClose={closeLightbox} />
      )}

      <AudioPlayer src="audio/fond-sonore.mp3" />

      <div className="hint" aria-hidden="true">
        Faites défiler pour explorer&nbsp;— cliquez sur les curiosités
      </div>
    </div>
  )
}
