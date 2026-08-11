// ============================================================
// Digicode.jsx — digicode cliquable réutilisable
// ------------------------------------------------------------
// - 12 touches (1..9, *, 0, #) positionnées en % de l'image
// - Chaque appui joue le bip (def.beep) + flash de la touche
// - Une rangée de LEDs (def.dots) s'allume au fil de la saisie :
//   autant de points que de chiffres dans le code
// - Saisie complète :
//     • code correct  → validation (def.validation) + onSuccess
//     • code faux     → les LEDs clignotent en rouge puis onFail
//       (par défaut : retour à la scène principale)
// ============================================================
import { useEffect, useRef, useState } from "react";
import { IMG, playSfx } from "../soundUtils.js";

export default function Digicode({ def, onSuccess, onFail, onClose, debug }) {
  const [visible, setVisible] = useState(false);
  const [flashKey, setFlashKey] = useState(null);
  const [entered, setEntered] = useState(""); // chiffres saisis
  const [error, setError] = useState(false); // LEDs rouges
  const done = useRef(false);

  const codeLength = def.code.length;

  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const press = (e, key) => {
    e.stopPropagation();
    if (done.current) return;
    playSfx(def.beep);
    setFlashKey(key.symbol);
    setTimeout(() => setFlashKey(null), 150);

    const next = entered + key.symbol;
    setEntered(next);

    if (next.length < codeLength) return;

    // ---- Saisie complète : on vérifie ----
    done.current = true;
    if (next === def.code) {
      playSfx(def.validation);
      onSuccess();
    } else {
      // Mauvais code : LEDs rouges un instant, puis retour
      // à la scène principale (ou l'action def.onFail)
      setError(true);
      setTimeout(() => onFail(), 900);
    }
  };

  // Positions des LEDs : réparties dans la bande def.dots
  const dots = [];
  if (def.dots) {
    const { left, top, width, height } = def.dots;
    for (let i = 0; i < codeLength; i++) {
      dots.push({
        left: left + ((i + 0.5) * width) / codeLength,
        top: top + height / 2,
        size: height,
      });
    }
  }

  const dotColor = (i) => {
    if (error) return "#ff3b30"; // code faux → rouge
    if (i < entered.length) return "#ffd27a"; // saisi → ambre allumé
    return "rgba(255,255,255,0.18)"; // éteint
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.75)",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.35s ease",
        cursor: "pointer",
      }}
    >
      <div style={{ position: "relative", maxWidth: "92vw", maxHeight: "92vh" }}>
        <img
          src={IMG(def.image)}
          alt=""
          draggable={false}
          style={{
            display: "block",
            maxWidth: "92vw",
            maxHeight: "92vh",
            objectFit: "contain",
            userSelect: "none",
          }}
        />

        {/* ---------- LEDs de saisie ---------- */}
        {dots.map((d, i) => (
          <div
            key={"dot" + i}
            style={{
              position: "absolute",
              left: d.left + "%",
              top: d.top + "%",
              width: d.size + "%",
              aspectRatio: "1 / 1",
              transform: "translate(-50%, -50%)",
              borderRadius: "50%",
              background: dotColor(i),
              boxShadow:
                i < entered.length || error
                  ? `0 0 6px 2px ${error ? "rgba(255,59,48,0.7)" : "rgba(255,210,122,0.7)"}`
                  : "none",
              transition: "background 0.12s ease, box-shadow 0.12s ease",
              outline: debug ? "1px solid #00ff66" : "none",
              pointerEvents: "none",
            }}
          />
        ))}

        {/* ---------- Touches ---------- */}
        {def.keys.map((key) => (
          <div
            key={key.symbol}
            onClick={(e) => press(e, key)}
            style={{
              position: "absolute",
              left: key.left + "%",
              top: key.top + "%",
              width: key.width + "%",
              height: key.height + "%",
              cursor: "pointer",
              borderRadius: "20%",
              outline: debug ? "2px solid #00ff66" : "none",
              background:
                flashKey === key.symbol
                  ? "rgba(255, 220, 140, 0.35)"
                  : debug
                  ? "rgba(0,255,102,0.15)"
                  : "transparent",
              transition: "background 0.15s ease",
              display: debug ? "flex" : "block",
              alignItems: "center",
              justifyContent: "center",
              color: debug ? "#00ff66" : "transparent",
              fontFamily: "monospace",
              fontSize: "14px",
            }}
          >
            {debug ? key.symbol : ""}
          </div>
        ))}
      </div>
    </div>
  );
}
