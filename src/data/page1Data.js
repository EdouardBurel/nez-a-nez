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

// ---------- Touches placées à partir de centres MESURÉS ----------
// cols = [[x,x,x] par rangée] en % , rows = [y,y,y,y] en %
// Utile quand le pavé est incliné et qu'une grille régulière ne colle pas.
function touchesMesurees(cols, rows, kw, kh) {
  const symbols = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["*", "0", "#"],
  ];
  const keys = [];
  rows.forEach((cy, r) => {
    cols[r].forEach((cx, c) => {
      keys.push({
        symbol: symbols[r][c],
        left: cx - kw / 2,
        top: cy - kh / 2,
        width: kw,
        height: kh,
      });
    });
  });
  return keys;
}

// ---------- Grille de l'image 16 : 30 encarts MESURÉS ----------
// Chaque tuile a été détectée sur 16.png (1536 × 1024) : la grille
// n'est pas parfaitement régulière, d'où les positions individuelles.
// [left, top, width, height] en % — ordre de lecture, 6 par rangée.
const TUILES_16 = [
  [2.08, 1.95, 14.39, 18.36], [18.23, 1.95, 14.52, 18.36], [34.57, 1.86, 14.32, 18.26],
  [50.65, 1.86, 14.32, 18.36], [66.8, 1.86, 14.45, 18.36], [83.14, 1.86, 14.91, 18.26],
  [1.89, 22.36, 14.58, 17.38], [18.23, 22.36, 14.52, 17.48], [34.51, 22.36, 14.39, 17.38],
  [50.59, 22.36, 14.45, 17.48], [66.8, 22.36, 14.45, 17.48], [83.14, 22.36, 14.97, 17.38],
  [2.02, 41.99, 14.45, 17.09], [18.29, 41.99, 14.45, 17.09], [34.51, 41.99, 14.39, 17.09],
  [50.59, 41.99, 14.45, 17.09], [66.73, 41.99, 14.52, 16.99], [83.14, 41.99, 14.91, 17.19],
  [2.02, 61.13, 14.45, 16.99], [18.23, 61.13, 14.52, 16.99], [34.57, 61.13, 14.32, 16.8],
  [50.65, 61.13, 14.39, 16.89], [66.8, 61.13, 14.52, 16.89], [83.14, 61.13, 14.97, 16.89],
  [2.08, 80.18, 14.39, 16.99], [18.36, 80.18, 14.39, 16.99], [34.57, 80.18, 14.32, 16.99],
  [50.65, 80.18, 14.39, 16.99], [66.73, 80.18, 14.58, 16.99], [83.14, 80.18, 14.91, 16.8],
];

// Index de l'encart gagnant : 4e rangée, 3e colonne (dirigeable,
// hélicoptère, radio, cafetière — les objets de la pièce !).
const TUILE_GAGNANTE = 3 * 6 + 2; // = 20

function grille16() {
  return TUILES_16.map(([left, top, width, height], i) => ({
    id: `tile-${Math.floor(i / 6)}-${i % 6}`,
    left,
    top,
    width,
    height,
    action: i === TUILE_GAGNANTE ? { open: "16b" } : { close: true },
  }));
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
    image: "porte.png",
    zones: [
      {
        id: "digicode-mural",
        title: "Le digicode",
        // Boîtier complet (auvent + pavé) mesuré sur porte.png
        left: 22.45, top: 36.75, width: 9.5, height: 15.5,
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
    // Mesuré sur l'asset réel (1086 × 1448) :
    // colonnes à 37.9 / 48.0 / 58.3 %, lignes à 52.9 / 60.1 / 67.2 / 74.5 %
    keys: grilleDigicode({ left: 32.8, top: 49.34, width: 30.6, height: 28.7 }),
    // Rangée unique de 7 LEDs, centres de 33.21 % à 64.16 %, à 45.78 %.
    // Sur la photo elles sont DÉJÀ allumées : on peint une pastille
    // sombre par-dessus, retirée au fur et à mesure de la saisie.
    dots: { cy: 45.78, left: 33.21, right: 64.16, size: 2.3 },
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
      {
        // NOUVEAU : le nom « KAEL DRAVEN » dans les crédits (bas de
        // l'affiche). Un clic ouvre 2b.jpg (pleurs.mp3 est joué par
        // l'openSound de 2b, pour pouvoir être coupé à la sortie).
        // Zone mesurée sur 2.png ; ajustez avec ?debug si besoin.
        id: "kael-draven",
        title: "Kael Draven",
        left: 42, top: 94.5, width: 17, height: 4,
        action: { open: "2b" },
      },
    ],
  },
  // ----- Image 2b : révélée en cliquant sur KAEL DRAVEN -----
  // pleurs.mp3 démarre à l'ouverture ; stopOnClose:true le coupe dès
  // qu'on ouvre 2c OU qu'on quitte 2b (voir OverlayStack.jsx).
  // Un minuscule endroit ouvre 2c.jpg et lance ambiance.mp3.
  // (Placement du point à ajuster avec ?debug — zone verte.)
  "2b": {
    image: "2b.jpg",
    openSound: "pleurs.mp3",
    stopOnClose: true,
    zones: [
      {
        id: "point-secret",
        title: "Point secret",
        left: 48, top: 48, width: 4, height: 4,
        action: { sound: "ambiance.mp3", open: "2c" },
      },
    ],
  },
  // ----- Image 2c : une porte. Cliquer sur la porte joue fermé.mp3. -----
  // (Zone de la porte à ajuster avec ?debug — zone verte.)
  "2c": {
    image: "2c.jpg",
    zones: [
      {
        id: "porte",
        title: "La porte",
        left: 30, top: 20, width: 40, height: 65,
        action: { sound: "Fermé.mp3", keepOpen: true },
      },
    ],
  },

  // ----- Image 6 : cockpit + affichettes AF1 / AF2 -----
  6: {
    image: "6.png",
    zones: [
      // Mesurées sur 6.png : AF1 = la photo du haut,
      // AF2 = l'affiche « La Côte d'Azur » en dessous
      {
        id: "af1",
        title: "Affichette 1",
        left: 77.5, top: 8.5, width: 12.0, height: 25.5,
        action: { open: "af1" },
      },
      {
        id: "af2",
        title: "Affichette 2",
        left: 87.3, top: 33.5, width: 10.5, height: 23.5,
        action: { open: "af2" },
      },
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
    validation: "Validation digicode vitrine.mp3",
    // Touches mesurées une par une sur 15.png (le pavé est légèrement
    // incliné par la perspective : une grille régulière tombait à côté).
    keys: touchesMesurees(
      [
        [42.42, 52.99, 63.1], // 1 2 3
        [42.56, 52.8, 63.1], //  4 5 6
        [42.65, 53.12, 63.14], // 7 8 9
        [42.78, 53.12, 63.14], // * 0 #
      ],
      [33.2, 41.9, 50.2, 58.4], // hauteurs des 4 rangées
      8, // largeur de la zone cliquable
      7, // hauteur de la zone cliquable
    ),
    // 8 LEDs alignées dans le bandeau sombre AU-DESSUS des deux lampes
    // (zone entourée en rouge sur la maquette).
    dots: { cy: 18.2, left: 38.5, right: 66.5, size: 2.4 },
    dotStyle: "light", // surface sombre : les pastilles s'allument
    onSuccess: { open: "15b" },
    // Code faux → on referme le digicode, retour à la scène Page 1
    onFail: { closeAll: true },
  },
  "15b": { image: "15b.png", openSound: "Mystère3.mp3" },

  // ----- Image 16 : mur de 30 encarts -----
  16: {
    image: "16.png",
    openSound: "Mystère1.mp3",
    openSoundMaxMs: 3000, // coupe le son en fondu à 3 s
    zones: grille16(),
  },
  "16b": { image: "16b.png", openSound: "Mystère2.mp3", closeToRoom: true },

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
  "17c": {
    image: "17c.png",
    openSound: "photo.mp3",
    // NOUVEAU : re-cliquer sur la photo révèle 17d.png (+ photo.mp3).
    zones: [
      {
        id: "photo-encore",
        title: "La photo",
        left: 8, top: 8, width: 84, height: 84,
        action: { open: "17d" },
      },
    ],
  },
  "17d": { image: "17d.png", openSound: "photo.mp3" },

  // ----- Image 20 : femme à l'échelle + AF3 / AF4 -----
  20: {
    image: "20.png",
    zones: [
      // Mesurées sur 20.png : les deux cadres au mur à gauche.
      // AF4 est coupé par le bord de l'image, la zone s'arrête donc à 0 %.
      {
        id: "af3",
        title: "Affichette 3",
        left: 0.36, top: 20.46, width: 10.13, height: 16.1,
        action: { open: "af3" },
      },
      {
        id: "af4",
        title: "Affichette 4",
        left: 0.36, top: 42.29, width: 6.87, height: 8.05,
        action: { open: "af4" },
      },
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
        left: 50, top: 35, width: 16, height: 13,
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
        left: 0, top: 80, width: 24, height: 24,
        action: { replace: "41b", sound: "Croquer.mp3" },
      },
    ],
  },
  "41b": {
    image: "41b.png",
    zones: [
      {
        id: "paniere-retour",
        left: 0, top: 80, width: 24, height: 24,
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
        left: 65, top: 12, width: 12, height: 12,
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
        left: 2, top: 74, width: 24, height: 22,
        action: { replace: "43b", sound: "Croquer.mp3" },
      },
    ],
  },
  "43b": {
    image: "43b.png",
    zones: [
      {
        id: "bol-retour",
        left: 2, top: 78, width: 24, height: 22,
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
        left: 90, top: 45, width: 12, height: 12,
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
