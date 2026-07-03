import { useEffect, useRef, useState } from "react";
import sounds from "../sounds.js";

/**
 * Fond sonore en boucle.
 * Les navigateurs bloquent la lecture automatique : la musique démarre
 * donc à la première interaction (clic, touche, défilement).
 * Un bouton en bas à droite permet de couper / remettre le son.
 */
export default function AudioPlayer({ src }) {
  const audioRef = useRef(null);
  const [muted, setMuted] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const tryPlay = () => {
      const el = audioRef.current;
      if (!el) return;
      el.volume = 1.0;
      el.play()
        .then(() => setStarted(true))
        .catch(() => {});
    };
    // Tentative directe (fonctionne si le navigateur l'autorise)…
    tryPlay();
    // …sinon à la première interaction de l'utilisateur.
    const events = ["pointerdown", "keydown", "wheel", "touchstart"];
    const once = () => {
      tryPlay();
      events.forEach((ev) => window.removeEventListener(ev, once));
    };
    events.forEach((ev) =>
      window.addEventListener(ev, once, { passive: true }),
    );
    return () => events.forEach((ev) => window.removeEventListener(ev, once));
  }, []);

  const toggleMute = () => {
    const el = audioRef.current;
    if (!el) return;
    if (!started) {
      el.play()
        .then(() => setStarted(true))
        .catch(() => {});
    }
    el.muted = !el.muted;
    sounds.setMuted(el.muted); // ← ajout
    setMuted(el.muted);
  };

  return (
    <>
      <audio ref={audioRef} src={src} loop preload="auto" />
      <button
        type="button"
        className="audio-toggle"
        onClick={toggleMute}
        aria-label={muted ? "Activer la musique" : "Couper la musique"}
        title={muted ? "Activer la musique" : "Couper la musique"}
      >
        {muted ? (
          /* haut-parleur barré */
          <svg
            viewBox="0 0 24 24"
            width="22"
            height="22"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M3 9v6h4l5 5V4L7 9H3z" />
            <path
              d="M16.5 8.5l5 7m0-7l-5 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        ) : (
          /* haut-parleur avec ondes */
          <svg
            viewBox="0 0 24 24"
            width="22"
            height="22"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M3 9v6h4l5 5V4L7 9H3z" />
            <path
              d="M16 8a5 5 0 010 8M18.5 5.5a9 9 0 010 13"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        )}
      </button>
    </>
  );
}
