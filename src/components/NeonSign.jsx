import { useEffect, useRef, useState } from "react";
import { signZone } from "../hotspots.js";

/**
 * L'enseigne « NEZ à NEZ » : un clic l'allume (image néon superposée
 * à l'enseigne peinte) et joue son grésillement ; un autre clic l'éteint.
 */
export default function NeonSign() {
  const [on, setOn] = useState(false);
  const buzz = useRef(null);

  // Un lecteur audio dédié, indépendant des sons de survol
  useEffect(() => {
    const audio = new Audio("audio/spots/G.mp3");
    audio.volume = 0.35;
    buzz.current = audio;
    return () => audio.pause();
  }, []);

  const handleClick = (e) => {
    e.stopPropagation();
    const next = !on;
    setOn(next);
    const audio = buzz.current;
    if (!audio) return;
    if (next) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  };

  return (
    <button
      type="button"
      className={`neon-sign${on ? " is-on" : ""}`}
      style={{
        left: `${signZone.left}%`,
        top: `${signZone.top}%`,
        width: `${signZone.width}%`,
        height: `${signZone.height}%`,
      }}
      onClick={handleClick}
      aria-pressed={on}
      aria-label={on ? "Éteindre l'enseigne" : "Allumer l'enseigne"}
    >
      <img
        className="neon-glow"
        src="assets/sign-neon.png"
        alt=""
        draggable="false"
        aria-hidden="true"
      />
    </button>
  );
}