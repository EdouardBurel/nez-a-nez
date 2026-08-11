// ============================================================
// Page1.jsx — la pièce derrière la porte
// ------------------------------------------------------------
// Réutilise le composant Scene du cabinet : mêmes effets de survol,
// même état "visited", même défilement, même CSS.
// Les zones ordinaires ouvrent la Lightbox habituelle ; celles qui
// ont des interactions spéciales (digicode, affichettes, enveloppe,
// panières, portraits...) passent par OverlayStack.
// ============================================================
import { useCallback, useRef, useState } from "react";
import Scene from "./Scene.jsx";
import Lightbox from "./Lightbox.jsx";
import OverlayStack from "./OverlayStack.jsx";
import page1Hotspots, { page1SoundZones } from "../page1Hotspots.js";
import { overlays } from "../data/page1Data.js";
import sounds from "../sounds.js";

export default function Page1({ debug }) {
  const [active, setActive] = useState(null); // Lightbox simple
  const [closing, setClosing] = useState(false);
  const [stack, setStack] = useState([]); // images à interactions
  const closeTimer = useRef(null);

  const openHotspot = useCallback((spot) => {
    sounds.play(spot.clickSound);
    // Zone avec interactions spéciales définies dans page1Data.js ?
    if (overlays[spot.id]) {
      setStack([String(spot.id)]);
      return;
    }
    clearTimeout(closeTimer.current);
    setClosing(false);
    setActive(spot);
  }, []);

  const closeLightbox = useCallback(() => {
    sounds.stop();
    setClosing(true);
    closeTimer.current = setTimeout(() => {
      setActive(null);
      setClosing(false);
    }, 320);
  }, []);

  return (
    <>
      <Scene
        image="assets/page1/page1.png"
        alt="La pièce secrète"
        hotspots={page1Hotspots}
        soundZones={page1SoundZones}
        showNeon={false}
        onSelect={openHotspot}
        debug={debug}
        paused={!!active || stack.length > 0}
      />

      {active && (
        <Lightbox spot={active} closing={closing} onClose={closeLightbox} />
      )}

      <OverlayStack stack={stack} setStack={setStack} onGoToPage={() => {}} />
    </>
  );
}