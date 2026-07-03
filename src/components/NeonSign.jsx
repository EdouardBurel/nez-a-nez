import { useState } from "react";
import { signZone } from "../hotspots.js";

/**
 * L'enseigne « NEZ à NEZ » : un clic l'allume (image néon superposée
 * à l'enseigne peinte), un autre l'éteint.
 */
export default function NeonSign() {
  const [on, setOn] = useState(false);

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
      onClick={(e) => {
        e.stopPropagation();
        setOn((v) => !v);
      }}
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
