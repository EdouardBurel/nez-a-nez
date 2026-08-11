// ============================================================
// OverlayStack.jsx — pile d'images en premier plan
// ------------------------------------------------------------
// Gère l'empilement des images (17 → 17c, 6 → AF1, 16 → 16b...).
// - Seule l'image du dessus est interactive.
// - Clic hors zone = ferme l'image du dessus (comme la Lightbox).
// - Chaque zone exécute une "action" déclarée dans page1Data.js.
// - type: "digicode" → rendu spécial avec saisie de code.
// Fondu d'apparition/disparition dans le même esprit que Lightbox.
// ============================================================
import { useEffect, useState } from "react";
import { overlays } from "../data/page1Data.js";
import { IMG, playSfx } from "../soundUtils.js";
import Digicode from "./Digicode.jsx";

const DEBUG =
  typeof window !== "undefined" &&
  new URLSearchParams(window.location.search).has("debug");

function OverlayImage({ def, onAction, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Fondu d'entrée + bruitage d'ouverture
    const t = requestAnimationFrame(() => setVisible(true));
    if (def.openSound) playSfx(def.openSound);
    return () => cancelAnimationFrame(t);
  }, [def]);

  const handleZoneClick = (e, zone) => {
    e.stopPropagation();
    onAction(zone.action || { close: true });
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
      <div
        style={{ position: "relative", maxWidth: "92vw", maxHeight: "92vh" }}
        // Les zones sont positionnées en % de l'image elle-même
      >
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
        {(def.zones || []).map((zone) => (
          <div
            key={zone.id}
            onClick={(e) => handleZoneClick(e, zone)}
            style={{
              position: "absolute",
              left: zone.left + "%",
              top: zone.top + "%",
              width: zone.width + "%",
              height: zone.height + "%",
              cursor: "pointer",
              outline: DEBUG ? "2px solid #00ff66" : "none",
              background: DEBUG ? "rgba(0,255,102,0.15)" : "transparent",
            }}
            title={DEBUG ? zone.id : undefined}
          />
        ))}
      </div>
    </div>
  );
}

export default function OverlayStack({ stack, setStack, onGoToPage }) {
  if (stack.length === 0) return null;
  const topId = stack[stack.length - 1];
  const def = overlays[topId];
  if (!def) return null;

  const closeTop = () => setStack((s) => s.slice(0, -1));

  const runAction = (action) => {
    if (!action) return closeTop();
    if (action.sound) playSfx(action.sound);
    if (action.goToPage) {
      // Petit délai pour laisser partir le son de validation
      setTimeout(() => {
        setStack([]);
        onGoToPage(action.goToPage);
      }, 400);
      return;
    }
    if (action.replace) {
      setStack((s) => [...s.slice(0, -1), String(action.replace)]);
      return;
    }
    if (action.open) {
      setStack((s) => [...s, String(action.open)]);
      return;
    }
    if (action.close) return closeTop();
    if (action.closeAll) return setStack([]); // retour à la scène principale
    if (action.keepOpen) return; // son joué, image maintenue
  };

  if (def.type === "digicode") {
    return (
      <Digicode
        def={def}
        onSuccess={() => runAction(def.onSuccess)}
        onFail={() => runAction(def.onFail || { closeAll: true })}
        onClose={closeTop}
        debug={DEBUG}
      />
    );
  }

  return <OverlayImage def={def} onAction={runAction} onClose={closeTop} />;
}
