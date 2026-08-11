// ============================================================
// soundUtils.js — helpers audio pour la Page 1
// ------------------------------------------------------------
// - playSfx(src)      : joue un bruitage "one-shot" (clics, bips,
//                       validations, photo.mp3, Croquer.mp3, etc.)
// - hoverSound(src)   : gestionnaire de sons de survol, un seul à
//                       la fois, avec fade-out du précédent
//                       (même logique que src/sounds.js du cabinet —
//                       si tu préfères, remplace ces appels par ton
//                       manager existant)
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
