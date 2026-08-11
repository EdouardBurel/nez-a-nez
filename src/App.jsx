import { useCallback, useEffect, useRef, useState } from "react";
import hotspots from "./hotspots.js";
import Scene from "./components/Scene.jsx";
import Lightbox from "./components/Lightbox.jsx";
import AudioPlayer from "./components/AudioPlayer.jsx";
import sounds from "./sounds.js";
// ---------- NOUVEAU : page 1 ----------
import Page1 from "./components/page1.jsx";
import OverlayStack from "./components/OverlayStack.jsx";


export default function App() {
  const [active, setActive] = useState(null); // hotspot ouvert dans la pop-up
  const [closing, setClosing] = useState(false);
  const debug = new URLSearchParams(window.location.search).has("debug");
  const closeTimer = useRef(null);

  // ---------- NOUVEAU : navigation + pile d'overlays du cabinet ----------
  const [page, setPage] = useState("cabinet"); // "cabinet" | "page1"
  const [stack, setStack] = useState([]); // porte.png → digicode → ...

  const openHotspot = useCallback((spot) => {
    // NOUVEAU : la porte n'ouvre pas la Lightbox, elle lance
    // la séquence porte.png → digicode → page 1
    if (spot.action === "porte") {
      sounds.play(spot.clickSound); // même clic universel que les autres
      setStack(["porte"]);
      return;
    }
    clearTimeout(closeTimer.current);
    setClosing(false);
    setActive(spot);
    sounds.play(spot.clickSound);
  }, []);

  const closeLightbox = useCallback(() => {
    sounds.stop(); // fondu de sortie
    setClosing(true);
    closeTimer.current = setTimeout(() => {
      setActive(null);
      setClosing(false);
    }, 320);
  }, []);

  // Fermeture avec la touche Échap (Lightbox OU overlay du dessus)
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      if (stack.length > 0) {
        setStack((s) => s.slice(0, -1)); // NOUVEAU : dépile porte/digicode
      } else {
        closeLightbox();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeLightbox, stack.length]);

  // ---------- NOUVEAU : la musique change avec la page ----------
  // key={page} force le remontage de l'AudioPlayer pour que la
  // nouvelle piste démarre au changement de page. Le bouton mute
  // reste le tien, et ne coupe toujours que la musique.
  const musicSrc =
    page === "page1"
      ? "audio/page1/" + encodeURIComponent("Musique de fond page 1.mp3")
      : "audio/fond-sonore.mp3";

  // ---------- NOUVEAU : rendu de la page 1 ----------
  if (page === "page1") {
    return (
      <div className="app">
        <Page1 debug={debug} />
        <AudioPlayer key={page} src={musicSrc} />
      </div>
    );
  }

  // ---------- Page du cabinet (ton rendu actuel + la porte) ----------
  return (
    <div className="app">
      <Scene
        hotspots={hotspots}
        onSelect={openHotspot}
        debug={debug}
        paused={!!active || stack.length > 0} // NOUVEAU : pause aussi si porte ouverte
      />

      {active && (
        <Lightbox spot={active} closing={closing} onClose={closeLightbox} />
      )}

      {/* NOUVEAU : pile porte.png → digicode 3825869 → page 1
          (la porte elle-même est un hotspot dans hotspots.js,
          avec action: "porte" — voir openHotspot ci-dessus) */}
      <OverlayStack stack={stack} setStack={setStack} onGoToPage={setPage} />

      <AudioPlayer key={page} src={musicSrc} />

      <div className="hint" aria-hidden="true">
        Faites défiler pour explorer&nbsp;— cliquez sur les curiosités
      </div>
    </div>
  );
}
