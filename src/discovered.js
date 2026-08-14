/**
 * Compteur de masques découverts.
 * ---------------------------------------------------------------
 * Singleton en mémoire (comme sounds.js) : rien n'est stocké, donc
 * quitter ou recharger la page remet le compteur à zéro — c'est
 * voulu, chaque visite est une nouvelle exploration.
 *
 * Le TOTAL est calculé automatiquement à partir des fichiers de
 * zones : ajouter un hotspot ou une image met le dénominateur à
 * jour tout seul, aucun chiffre à maintenir à la main.
 *
 * Ne comptent PAS : la porte, les deux digicodes et leurs écrans
 * (ce sont des mécanismes, pas des masques à trouver).
 */
import cabinetHotspots from "./hotspots.js";
import page1Hotspots from "./page1Hotspots.js";
import { overlays } from "./data/page1Data.js";

// Identifiants à exclure du décompte
// Identifiants à exclure du décompte : la porte, les deux digicodes,
// et l'image 16 (le sarcophage) qui est une énigme, pas un masque.
// 16b, l'image cachée révélée par la bonne tuile, COMPTE comme une
// découverte (c'est une vraie récompense à trouver).
const EXCLUS = new Set([
  "porte",
  "digicodePorte",
  "15",
  "porte-page1",
  "16",
]);

// --- Construction de la liste complète des masques ---
function tousLesMasques() {
  const ids = new Set();

  // Curiosités du cabinet (préfixe "c:" pour éviter les collisions
  // d'identifiants entre les deux pièces)
  cabinetHotspots.forEach((s) => {
    if (!EXCLUS.has(String(s.id))) ids.add("c:" + s.id);
  });

  // Curiosités de la page 1
  page1Hotspots.forEach((s) => {
    if (!EXCLUS.has(String(s.id))) ids.add("p:" + s.id);
  });

  // Images secondaires : affichettes, images "b", etc.
  // (celles qui n'ont pas de hotspot direct dans la scène)
  Object.keys(overlays).forEach((key) => {
    if (EXCLUS.has(key)) return;
    if (overlays[key].type === "digicode") return;
    if (page1Hotspots.some((s) => String(s.id) === key)) return; // déjà compté
    ids.add("p:" + key);
  });

  return ids;
}

const TOUS = tousLesMasques();

let trouves = new Set();
const abonnes = new Set();

function notifier() {
  abonnes.forEach((fn) => fn(trouves.size, TOUS.size));
}

const discovered = {
  /** Total de masques à découvrir (calculé) */
  get total() {
    return TOUS.size;
  },

  /** Nombre trouvés jusqu'ici */
  get count() {
    return trouves.size;
  },

  /** Marque un masque comme découvert. scope : "c" (cabinet) ou "p" (page 1) */
  add(scope, id) {
    const key = scope + ":" + id;
    if (!TOUS.has(key) || trouves.has(key)) return;
    trouves.add(key);
    notifier();
  },

  /** Remet le compteur à zéro */
  reset() {
    trouves = new Set();
    notifier();
  },

  /** S'abonner aux changements ; renvoie la fonction de désabonnement */
  subscribe(fn) {
    abonnes.add(fn);
    fn(trouves.size, TOUS.size);
    return () => abonnes.delete(fn);
  },
};

export default discovered;
