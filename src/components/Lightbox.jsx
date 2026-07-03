import { useEffect, useRef } from 'react'

/**
 * Pop-up d'image : fondu à l'ouverture et à la fermeture.
 * Se ferme avec le bouton ×, un clic hors de l'image, ou la touche Échap.
 */
export default function Lightbox({ spot, closing, onClose }) {
  const closeBtn = useRef(null)

  useEffect(() => {
    closeBtn.current?.focus()
  }, [])

  return (
    <div
      className={`lightbox${closing ? ' is-closing' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={spot.title || `Curiosité ${spot.id}`}
      onClick={onClose}
    >
      <figure className="lightbox-frame" onClick={(e) => e.stopPropagation()}>
        <button
          ref={closeBtn}
          type="button"
          className="lightbox-close"
          onClick={onClose}
          aria-label="Fermer"
        >
          ×
        </button>
        <img src={spot.image} alt={spot.title || `Curiosité ${spot.id}`} />
      </figure>
    </div>
  )
}
