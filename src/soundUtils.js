// ============================================================
// soundUtils.js — helpers audio pour la Page 1
// ------------------------------------------------------------
// - playSfx(src)       : joue un bruitage "one-shot" (clics, bips,
//                        validations, photo.mp3, Croquer.mp3, etc.)
// - playSfxCapped(...)  : idem mais coupe le son en fondu après N ms
//                        (utilisé pour raccourcir Mystère1.mp3)
// - hoverSound(src)    : gestionnaire de sons de survol, un seul à
//                        la fois, avec fade-out du précédent
// ============================================================

// Chemins alignés sur la structure du projet :
//   images → public/assets/page1/   sons → public/audio/page1/
// (les noms avec espaces/accents sont encodés ici)
export const IMG = (name) => "/assets/page1/" + encodeURIComponent(name);
export const SND = (name) => "/audio/page1/" + encodeURIComponent(name);

// ---------- Bruitages one-shot (clics) ----------
export function playSfx(name, volume = 0.9) {
  if (!name) return;
  const a = new Audio(SND(name));
  a.volume = volume;
  // Le catch évite les erreurs "play() interrupted" dans la console
  a.play().catch(() => {});
  return a;
}

// ---------- Bruitage coupé en fondu après maxMs millisecondes ----------
// Laisse le fichier intact : on arrête juste la lecture plus tôt.
export function playSfxCapped(name, maxMs = 3000, volume = 0.9) {
  const a = playSfx(name, volume);
  if (!a) return;
  const fadeMs = 400; // durée du fondu de sortie
  setTimeout(() => {
    const fade = setInterval(() => {
      if (a.volume > 0.08) {
        a.volume = Math.max(0, a.volume - 0.08);
      } else {
        a.pause();
        clearInterval(fade);
      }
    }, 40);
  }, Math.max(0, maxMs - fadeMs));
  return a;
}

// ---------- Sons de survol (un seul à la fois, fade-out) ----------
let currentHover = null;
let fadeTimer = null;

function fadeOutAndStop(audio) {
  if (!audio) return;
  clearInterval(fadeTimer);
  fadeTimer = setInterval(() => {
    if (audio.volume > 0.05) {
      audio.volume = Math.max(0, audio.volume - 0.05);
    } else {
      audio.pause();
      clearInterval(fadeTimer);
    }
  }, 40);
}

export function hoverSound(name, volume = 0.35) {
  if (!name) return;
  // Si un autre son de survol joue, on le fond en sortie
  if (currentHover && !currentHover.paused) {
    fadeOutAndStop(currentHover);
  }
  const a = new Audio(SND(name));
  a.volume = volume;
  a.play().catch(() => {});
  currentHover = a;
  // Note : comme sur le cabinet, le son joue jusqu'au bout même si
  // la souris quitte la zone (on ne coupe rien au mouseleave)
}
