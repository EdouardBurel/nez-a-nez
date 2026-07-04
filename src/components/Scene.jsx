import { useEffect, useRef, useState } from "react";
import NeonSign from "./NeonSign.jsx";
import sounds from "../sounds.js";
import { soundZones } from "../hotspots.js";

/**
 * La scène : l'image du cabinet à hauteur d'écran, défilement horizontal.
 * - molette de la souris => défilement horizontal
 * - cliquer-glisser => déplacement (comme dans un point & click)
 * - zones cliquables positionnées en % de l'image
 */
export default function Scene({ hotspots, onSelect, debug, paused }) {
  const scrollerRef = useRef(null);
  const drag = useRef({ down: false, moved: false, startX: 0, startLeft: 0 });
  const [visited, setVisited] = useState(() => new Set());

  // Molette verticale -> défilement horizontal
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onWheel = (e) => {
      if (paused) return;
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        el.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [paused]);

  // Cliquer-glisser pour se déplacer
  const onPointerDown = (e) => {
    if (e.button !== 0) return;
    const el = scrollerRef.current;
    drag.current = {
      down: true,
      moved: false,
      startX: e.clientX,
      startLeft: el.scrollLeft,
    };
  };
  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d.down) return;
    const dx = e.clientX - d.startX;
    if (Math.abs(dx) > 6) d.moved = true;
    if (d.moved) scrollerRef.current.scrollLeft = d.startLeft - dx;
  };
  const endDrag = () => {
    drag.current.down = false;
  };

  const handleSpotClick = (e, spot) => {
    e.stopPropagation();
    if (drag.current.moved) return;
    sounds.stop(true);
    setVisited((prev) => new Set(prev).add(spot.id));
    onSelect(spot);
  };

  // Mode debug : affiche les coordonnées du clic en % de l'image
  const handleSceneClick = (e) => {
    if (!debug || drag.current.moved) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = (((e.clientX - rect.left) / rect.width) * 100).toFixed(2);
    const cy = (((e.clientY - rect.top) / rect.height) * 100).toFixed(2);
    console.log(`Clic scène -> cx: ${cx}, cy: ${cy}`);
  };

  return (
    <div
      className={`scene-scroller${paused ? " is-paused" : ""}`}
      ref={scrollerRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
    >
      <div className="scene" onClick={handleSceneClick}>
        <img
          className="scene-image"
          src="assets/scene.png"
          alt="Le cabinet de curiosités NEZ à NEZ"
          draggable="false"
        />

        {soundZones.map((zone) => (
          <div
            key={zone.id}
            className={`sound-zone${debug ? " debug" : ""}`}
            style={{
              left: `${zone.cx - zone.w / 2}%`,
              top: `${zone.cy - zone.h / 2}%`,
              width: `${zone.w}%`,
              height: `${zone.h}%`,
            }}
            onMouseEnter={() => sounds.play(zone.sound)}
          >
            {debug && <span className="sound-zone-id">{zone.id}</span>}
          </div>
        ))}

        <NeonSign />

        {hotspots.map((spot) => (
          <button
            key={spot.id}
            type="button"
            className={`hotspot${debug ? " debug" : ""}${visited.has(spot.id) ? " visited" : ""}`}
            style={{
              left: `${spot.cx - spot.w / 2}%`,
              top: `${spot.cy - spot.h / 2}%`,
              width: `${spot.w}%`,
              height: `${spot.h}%`,
            }}
            aria-label={spot.title || `Curiosité ${spot.id}`}
            title={debug ? spot.id : undefined}
            onClick={(e) => handleSpotClick(e, spot)}
            onMouseEnter={() => sounds.play(spot.sound)}
            onFocus={() => sounds.play(spot.sound)}
          >
            {debug && <span className="hotspot-id">{spot.id}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
