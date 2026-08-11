// ============================================================
// page1Data.js — TOUTE la configuration de la Page 1
// ------------------------------------------------------------
// Coordonnées en % de l'image (comme hotspots.js du cabinet).
// Toutes les positions sont des ESTIMATIONS à ajuster avec ?debug
// (rouge = zones de clic, bleu = zones de survol, vert = sous-zones
// des images qui s'ouvrent).
//
// Actions possibles sur une zone :
//   { sound: "x.mp3" }            → joue un bruitage
//   { open: "idOverlay" }         → ouvre une image PAR-DESSUS
//   { replace: "idOverlay" }      → remplace l'image courante
//   { close: true }               → ferme l'image courante
//   { goToPage: "page1" }         → change de page
//   { keepOpen: true }            → le clic ne ferme PAS l'image
// (combinables : { sound: "...", open: "..." })
// ============================================================

// ---------- Générateur de grille de digicode (12 touches) ----------
// box = zone du pavé de touches en % de l'image du digicode
function grilleDigicode(box) {
  const symbols = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"];
  const cols = 3, rows = 4;
  const keys = [];
  symbols.forEach((sym, i) => {
    const c = i % cols;
    const r = Math.floor(i / cols);
    keys.push({
      symbol: sym,
      left: box.left + (c * box.width) / cols,
      top: box.top + (r * box.height) / rows,
      width: box.width / cols,
      height: box.height / rows,
    });
  });
  return keys;
}

// ---------- Générateur de la grille de l'image 16 (30 encarts) ----------
// 6 colonnes × 5 lignes. Seul l'encart "special" ouvre 16b.
function grille16() {
  const zones = [];
  const cols = 6, rows = 5;
  // Zone occupée par l'ensemble des tableaux dans 16.png (à ajuster)
  const box = { left: 9, top: 20, width: 82, height: 66 };
  // L'encart blanc de la maquette : 4e ligne, 3e colonne
  const SPECIAL = { row: 3, col: 2 }; // index base 0
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const special = r === SPECIAL.row && c === SPECIAL.col;
      zones.push({
        id: `tile-${r}-${c}`,
        left: box.left + (c * box.width) / cols,
        top: box.top + (r * box.height) / rows,
        width: box.width / cols - 1,
        height: box.height / rows - 1,
        action: special ? { open: "16b" } : { close: true },
      });
    }
  }
  return zones;
}

// ============================================================
// OVERLAYS — toutes les images qui s'affichent en premier plan
// ------------------------------------------------------------
// Par défaut : cliquer n'importe où (hors zone) FERME l'image,
// comme la Lightbox actuelle. openSound = bruitage joué à
// l'ouverture de l'image.
// ============================================================
export const overlays = {
  // ----- Séquence de la porte (depuis le cabinet) -----
  porte: {
    image: "Porte.png",
    zones: [
      {
        id: "digicode-mural",
        // Petit boîtier à gauche de la porte dans porte.png (à ajuster)
        left: 26, top: 40, width: 9, height: 12,
        action: { open: "digicodePorte" },
      },
    ],
  },

  digicodePorte: {
    type: "digicode",
    image: "3825869 Digicode Porte.png",
    code: "3825869",
    beep: "Bip digicode.mp3",
    validation: "Validation Digicode porte 1.mp3",
    // Pavé de touches dans l'image (à ajuster avec ?debug)
    keys: grilleDigicode({ left: 36, top: 50, width: 27, height: 28 }),
    // Bande des petites LEDs au-dessus des touches (à ajuster) :
    // 7 points répartis dans cette bande (autant que de chiffres)
    dots: { left: 34, top: 42, width: 31, height: 2.2 },
    onSuccess: { goToPage: "page1" },
    // Code faux (7 chiffres saisis) → retour à la scène principale
    onFail: { closeAll: true },
  },

  // ----- Image 2 : affiche LE CYCLOPE -----
  2: {
    image: "2.png",
    zones: [
      {
        id: "pupille",
        left: 44, top: 33, width: 12, height: 9,
        action: { sound: "Cyclope enfermé 1.mp3", keepOpen: true },
      },
    ],
  },

  // ----- Image 6 : cockpit + affichettes AF1 / AF2 -----
  6: {
    image: "6.png",
    zones: [
      { id: "af1", left: 72, top: 17, width: 12, height: 22, action: { open: "af1" } },
      { id: "af2", left: 80, top: 47, width: 11, height: 20, action: { open: "af2" } },
    ],
  },
  af1: { image: "AF1.png" },
  af2: { image: "AF2.png" },

  // ----- Image 15 : second digicode -----
  15: {
    type: "digicode",
    image: "15.png",
    code: "15082021",
    beep: "Bip digicode.mp3",
    validation: "Validation Digicode porte 1.mp3",
    keys: grilleDigicode({ left: 37, top: 33, width: 26, height: 37 }),
    // Les deux fentes blanches en haut du boîtier → 8 LEDs (à ajuster)
    dots: { left: 36, top: 26, width: 28, height: 2.2 },
    onSuccess: { open: "15b" },
    // Code faux → on referme le digicode, retour à la scène Page 1
    onFail: { closeAll: true },
  },
  "15b": { image: "15b.png", openSound: "Mystère3.mp3" },

  // ----- Image 16 : mur de 30 encarts -----
  16: {
    image: "16.png",
    openSound: "Mystère1.mp3",
    zones: grille16(),
  },
  "16b": { image: "16b.png", openSound: "Mystère2.mp3" },

  // ----- Image 17 : enveloppe sur une table -----
  17: {
    image: "17.png",
    zones: [
      {
        id: "enveloppe",
        left: 30, top: 40, width: 40, height: 30,
        action: { replace: "17b" },
      },
    ],
  },
  "17b": {
    image: "17b.png",
    zones: [
      {
        id: "photo-qui-depasse",
        left: 38, top: 35, width: 26, height: 22,
        action: { open: "17c" },
      },
    ],
  },
  "17c": { image: "17c.png", openSound: "photo.mp3" },

  // ----- Image 20 : femme à l'échelle + AF3 / AF4 -----
  20: {
    image: "20.png",
    zones: [
      { id: "af3", left: 10, top: 32, width: 11, height: 14, action: { open: "af3" } },
      { id: "af4", left: 10, top: 49, width: 8, height: 8, action: { open: "af4" } },
    ],
  },
  af3: { image: "AF3.png", openSound: "photo.mp3" },
  af4: { image: "AF4.png", openSound: "photo.mp3" },

  // ----- Image 29 : pochette Keyhole Vision -----
  29: {
    image: "29.png",
    zones: [
      {
        id: "pupille",
        left: 45, top: 33, width: 13, height: 12,
        action: { sound: "Cyclope enfermé 2.mp3", keepOpen: true },
      },
    ],
  },

  // ----- Image 41 : aller-retour panière de pain -----
  41: {
    image: "41.png",
    zones: [
      {
        id: "paniere",
        left: 5, top: 68, width: 24, height: 24,
        action: { replace: "41b", sound: "Croquer.mp3" },
      },
    ],
  },
  "41b": {
    image: "41b.png",
    zones: [
      {
        id: "paniere-retour",
        left: 5, top: 68, width: 24, height: 24,
        action: { replace: "41", sound: "Croquer.mp3" },
      },
    ],
  },

  // ----- Image 42 : portrait derrière à droite -----
  42: {
    image: "42.png",
    zones: [
      {
        id: "portrait",
        left: 59, top: 10, width: 9, height: 12,
        action: { open: "42b" },
      },
    ],
  },
  "42b": { image: "42b.png", openSound: "photo.mp3" },

  // ----- Image 43 : aller-retour bol de cacahuètes / noix -----
  43: {
    image: "43.png",
    zones: [
      {
        id: "bol",
        left: 5, top: 70, width: 24, height: 22,
        action: { replace: "43b", sound: "Croquer.mp3" },
      },
    ],
  },
  "43b": {
    image: "43b.png",
    zones: [
      {
        id: "bol-retour",
        left: 5, top: 70, width: 24, height: 22,
        action: { replace: "43", sound: "Croquer.mp3" },
      },
    ],
  },

  // ----- Image 44 : portrait derrière à droite -----
  44: {
    image: "44.png",
    zones: [
      {
        id: "portrait",
        left: 62, top: 40, width: 10, height: 12,
        action: { open: "44b" },
      },
    ],
  },
  "44b": { image: "44b.png", openSound: "photo.mp3" },
};

// ============================================================
// ZONES DE SURVOL de la Page 1 (bulles bleues de la maquette)
// Survoler la zone N joue N.mp3 (pas besoin de cliquer)
// ============================================================
export const hoverZones = [
  { id: 1,  sound: "1.mp3",  left: 11,   top: 60, width: 6,  height: 6 },
  { id: 2,  sound: "2.mp3",  left: 17,   top: 61, width: 6,  height: 6 },
  { id: 3,  sound: "3.mp3",  left: 22,   top: 60, width: 5,  height: 6 },
  { id: 4,  sound: "4.mp3",  left: 26,   top: 59, width: 7,  height: 6 },
  { id: 5,  sound: "5.mp3",  left: 55,   top: 32, width: 17, height: 15 },
  { id: 6,  sound: "6.mp3",  left: 9,    top: 68, width: 15, height: 12 },
  { id: 7,  sound: "7.mp3",  left: 28,   top: 74, width: 9,  height: 7 },
  { id: 8,  sound: "8.mp3",  left: 48.5, top: 57, width: 6,  height: 15 },
  { id: 9,  sound: "9.mp3",  left: 61,   top: 55, width: 10, height: 9 },
  { id: 10, sound: "10.mp3", left: 54,   top: 71, width: 6,  height: 12 },
];

// ============================================================
// ZONES DE CLIC de la Page 1 (bulles rouges de la maquette)
// Cliquer sur la zone N ouvre l'overlay N (image N.png)
// Les zones sans overlay défini plus haut ouvrent simplement
// l'image N.png (clic pour fermer), comme la Lightbox.
// ============================================================
export const clickZones = [
  { id: 2,  left: 11.5, top: 34,   width: 4,  height: 6 },
  { id: 3,  left: 23,   top: 33,   width: 15, height: 6 },
  { id: 4,  left: 58.5, top: 34,   width: 5,  height: 7 },
  { id: 5,  left: 63.5, top: 33.5, width: 4,  height: 6 },
  { id: 6,  left: 66.5, top: 30,   width: 8,  height: 11 },
  { id: 7,  left: 74.5, top: 29.5, width: 2.5,height: 5 },
  { id: 8,  left: 77,   top: 29.5, width: 2.5,height: 5 },
  { id: 9,  left: 79.5, top: 27,   width: 3.5,height: 6 },
  { id: 10, left: 10,   top: 55.5, width: 4.5,height: 6 },
  { id: 11, left: 15.5, top: 58,   width: 5,  height: 6 },
  { id: 12, left: 20,   top: 57.5, width: 4.5,height: 6 },
  { id: 13, left: 25,   top: 62,   width: 4.5,height: 6 },
  { id: 14, left: 31.5, top: 54,   width: 5,  height: 10 },
  { id: 15, left: 40.5, top: 59,   width: 4,  height: 7 },
  { id: 16, left: 47,   top: 54,   width: 6,  height: 16 },
  { id: 17, left: 53.5, top: 62.5, width: 4,  height: 4 },
  { id: 18, left: 55,   top: 66,   width: 6,  height: 7 },
  { id: 19, left: 59.5, top: 57.5, width: 4,  height: 10 },
  { id: 20, left: 60.5, top: 47.5, width: 6,  height: 4.5 },
  { id: 21, left: 62.5, top: 53,   width: 5,  height: 5 },
  { id: 22, left: 62.5, top: 59.5, width: 5,  height: 5 },
  { id: 23, left: 65.5, top: 56,   width: 4.5,height: 5 },
  { id: 24, left: 68.5, top: 48,   width: 9,  height: 20 },
  { id: 25, left: 76.5, top: 68,   width: 6,  height: 8 },
  { id: 26, left: 14,   top: 77,   width: 6,  height: 7 },
  { id: 27, left: 16.5, top: 85.5, width: 3,  height: 9 },
  { id: 28, left: 19.5, top: 85.5, width: 3,  height: 9 },
  { id: 29, left: 24,   top: 84.5, width: 3,  height: 9 },
  { id: 30, left: 27,   top: 84,   width: 3,  height: 9 },
  { id: 40, left: 35,   top: 66,   width: 7,  height: 13 },
  { id: 41, left: 39,   top: 84.5, width: 8,  height: 11 },
  { id: 42, left: 46.5, top: 76.5, width: 9,  height: 7 },
  { id: 43, left: 64,   top: 76.5, width: 9,  height: 7 },
  { id: 44, left: 77.5, top: 84.5, width: 6,  height: 11 },
  { id: 45, left: 52,   top: 34.5, width: 4,  height: 6.5 },
  { id: 46, left: 11,   top: 71.5, width: 12, height: 5 },
];

// Sur la page du CABINET : zone de la porte (ellipse verte de la
// maquette) qui ouvre l'overlay "porte". À intégrer dans hotspots.js
// ou à poser comme zone supplémentaire (voir INTEGRATION.md).
export const cabinetDoorZone = { left: 38.5, top: 44, width: 7, height: 14 };
