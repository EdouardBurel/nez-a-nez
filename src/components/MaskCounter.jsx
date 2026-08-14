import { useEffect, useState } from "react";
import discovered from "../discovered.js";

/**
 * Compteur « masques découverts », affiché en bas de page,
 * aussi bien dans le cabinet que dans la page 1.
 * Petit sursaut lumineux à chaque nouvelle découverte.
 */
export default function MaskCounter() {
  const [{ n, total }, set] = useState({ n: 0, total: discovered.total });
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    return discovered.subscribe((n, total) => {
      set((prev) => {
        if (n > prev.n) {
          setPulse(true);
          setTimeout(() => setPulse(false), 600);
        }
        return { n, total };
      });
    });
  }, []);

  const complet = n === total && total > 0;

  return (
    <div className={`mask-counter${pulse ? " is-pulsing" : ""}${complet ? " is-complete" : ""}`}>
      <span className="mask-counter-score">
        {n}&nbsp;/&nbsp;{total}
      </span>
    </div>
  );
}
