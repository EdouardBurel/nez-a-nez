/**
 * Zones de la PAGE 1 (la pièce derrière la porte).
 * Même format que hotspots.js : coordonnées en POURCENTAGE de l'image,
 * cx/cy = centre, w/h = taille. Mesurées sur les maquettes annotées.
 *
 * Mode réglage : ?debug (rouge = images, bleu = sons).
 *
 * Rappel de la leçon du cabinet : un hotspot posé au-dessus d'une
 * soundZone bloque le survol. Les sons des bulles bleues qui tombent
 * sous une bulle rouge sont donc attachés DIRECTEMENT au hotspot,
 * et la soundZone reste pour déborder autour (même fichier -> le son
 * continue sans coupure).
 */
const page1Hotspots = [
  // ---- Étage / plafond ----
  { id: "2", cx: 16.32, cy: 21.18, w: 2.2, h: 5.76, image: "assets/page1/2.png", title: "L'affiche du Cyclope" },
  { id: "3", cx: 29.72, cy: 20.6, w: 11.49, h: 4.8, image: "assets/page1/3.png", title: "Le dirigeable" },
  { id: "45", cx: 61.32, cy: 21.61, w: 2.86, h: 4.91, image: "assets/page1/45.png", title: "Curiosité 45" },
  { id: "4", cx: 70.55, cy: 21.5, w: 4.29, h: 11.53, image: "assets/page1/4.png", title: "Curiosité 4", sound: "audio/page1/5.mp3" },
  { id: "5", cx: 76.5, cy: 20.54, w: 2.14, h: 5.76, image: "assets/page1/5.png", title: "Curiosité 5", sound: "audio/page1/5.mp3" },
  { id: "6", cx: 82.46, cy: 20.01, w: 8.22, h: 15.37, image: "assets/page1/6.png", title: "L'hélicoptère", sound: "audio/page1/5.mp3" },
  { id: "7", cx: 90.38, cy: 16.28, w: 2.5, h: 7.9, image: "assets/page1/7.png", title: "Curiosité 7" },
  { id: "8", cx: 92.82, cy: 15.64, w: 1.79, h: 7.47, image: "assets/page1/8.png", title: "Curiosité 8" },
  { id: "9", cx: 96.16, cy: 14.03, w: 3.22, h: 10.46, image: "assets/page1/9.png", title: "Léon Magicien" },

  // ---- Cuisine (gauche) ----
  { id: "10", cx: 5.63, cy: 49.79, w: 3.22, h: 5.55, image: "assets/page1/10.png", title: "Curiosité 10", sound: "audio/page1/1.mp3" },
  { id: "11", cx: 12.69, cy: 52.83, w: 3.04, h: 5.66, image: "assets/page1/11.png", title: "Curiosité 11", sound: "audio/page1/2.mp3" },
  { id: "12", cx: 17.63, cy: 52.67, w: 3.16, h: 5.98, image: "assets/page1/12.png", title: "A venir", sound: "audio/page1/3.mp3" },
  { id: "13", cx: 24.66, cy: 58.43, w: 3.28, h: 6.83, image: "assets/page1/13.png", title: "Curiosité 13", sound: "audio/page1/4.mp3" },
  { id: "14", cx: 34.63, cy: 50.0, w: 3.34, h: 11.74, image: "assets/page1/14.png", title: "La plante" },

  // ---- Centre ----
  { id: "15", cx: 45.71, cy: 53.58, w: 1.67, h: 2.88, image: "assets/page1/15.png", title: "Le digicode" },
  { id: "16", cx: 56.34, cy: 53.84, w: 3.63, h: 24.97, image: "assets/page1/16.png", title: "Le mur d'énigmes", sound: "audio/page1/8.mp3" },
  { id: "17", cx: 62.84, cy: 57.15, w: 3.16, h: 2.99, image: "assets/page1/17.png", title: "L'enveloppe" },
  { id: "18", cx: 65.9, cy: 63.5, w: 4.65, h: 10.35, image: "assets/page1/18.png", title: "Curiosité 18" },
  { id: "19", cx: 71.8, cy: 54.7, w: 2.14, h: 19.85, image: "assets/page1/19.png", title: "Curiosité 19" },
  { id: "20", cx: 73.67, cy: 40.18, w: 4.47, h: 3.63, image: "assets/page1/20.png", title: "La femme à l'échelle" },
  { id: "21", cx: 75.82, cy: 46.96, w: 3.51, h: 7.15, image: "assets/page1/21.png", title: "Curiosité 21", sound: "audio/page1/9.mp3" },
  { id: "22", cx: 76.03, cy: 55.12, w: 3.45, h: 6.19, image: "assets/page1/22.png", title: "Curiosité 22", sound: "audio/page1/9.mp3" },
  { id: "23", cx: 79.3, cy: 50.59, w: 3.45, h: 7.36, image: "assets/page1/23.png", title: "Curiosité 23", sound: "audio/page1/9.mp3" },
  { id: "24", cx: 86.93, cy: 49.63, w: 7.15, h: 23.59, image: "assets/page1/24.png", title: "L'alambic" },
  { id: "25", cx: 95.32, cy: 67.29, w: 4.53, h: 8.96, image: "assets/page1/25.png", title: "Curiosité 25" },

  // ---- Bas gauche : chaîne hi-fi et vinyles ----
  { id: "46", cx: 10.87, cy: 70.65, w: 13.34, h: 5.02, image: "assets/page1/46.png", title: "Curiosité 46", sound: "audio/page1/6.mp3" },
  { id: "26", cx: 11.76, cy: 78.66, w: 4.65, h: 8.22, image: "assets/page1/26.png", title: "Le ghetto blaster", sound: "audio/page1/6.mp3" },
  { id: "27", cx: 12.36, cy: 91.68, w: 1.79, h: 10.99, image: "assets/page1/27.png", title: "Vinyles 27" },
  { id: "28", cx: 15.93, cy: 90.72, w: 1.79, h: 10.99, image: "assets/page1/28.png", title: "Vinyles 28" },
  { id: "29", cx: 22.96, cy: 89.65, w: 1.79, h: 10.99, image: "assets/page1/29.png", title: "Keyhole Vision" },
  { id: "30", cx: 27.07, cy: 88.58, w: 1.79, h: 10.99, image: "assets/page1/30.png", title: "Vinyles 30" },

  // ---- Bas centre / droite ----
  { id: "40", cx: 39.9, cy: 68.2, w: 3.63, h: 17.4, image: "assets/page1/40.png", title: "La platine" },
  { id: "41", cx: 47.32, cy: 91.04, w: 7.39, h: 17.18, image: "assets/page1/41.png", title: "Curiosité 41" },
  { id: "42", cx: 57.5, cy: 77.91, w: 7.03, h: 7.15, image: "assets/page1/42.png", title: "La cafetière" },
  { id: "43", cx: 80.41, cy: 77.91, w: 7.33, h: 5.02, image: "assets/page1/43.png", title: "Curiosité 43" },
  { id: "44", cx: 96.96, cy: 91.62, w: 5.18, h: 16.65, image: "assets/page1/44.png", title: "Curiosité 44" },

  // ---- NOUVEAU : curiosités 47 à 52 (positions des pastilles de la
  // maquette, mesurées en % de page1.png). À ajuster avec ?debug pour
  // coller au plus près de chaque objet. Chaque zone ouvre son image
  // assets/page1/NN.png dans la Lightbox. ----
  { id: "47", cx: 39.5, cy: 18.0, w: 3.5, h: 7.0,  image: "assets/page1/47.png", title: "Curiosité 47" },
  { id: "51", cx: 47.5, cy: 21.0, w: 3.5, h: 6.0,  image: "assets/page1/51.png", title: "Curiosité 51" },
  { id: "49", cx: 22.5, cy: 50.0, w: 4.0, h: 7.0,  image: "assets/page1/49.png", title: "Curiosité 49" },
  { id: "50", cx: 51.0, cy: 45.0, w: 2.5, h: 5.0,  image: "assets/page1/50.png", title: "Curiosité 50" },
  { id: "52", cx: 65.0, cy: 45.0, w: 4.5, h: 9.0,  image: "assets/page1/52.png", title: "Curiosité 52" },
  { id: "48", cx: 80.0, cy: 40.0, w: 4.0, h: 7.0,  image: "assets/page1/48.png", title: "Curiosité 48" },
];

/** Zones sonores libres de la page 1 (survol uniquement, pas de pop-up). */
export const page1SoundZones = [
  { id: "1", cx: 6.4, cy: 52.29, w: 5.12, h: 7.58, sound: "audio/page1/1.mp3" },
  { id: "2s", cx: 13.19, cy: 53.9, w: 6.43, h: 5.23, sound: "audio/page1/2.mp3" },
  { id: "3s", cx: 18.31, cy: 52.77, w: 3.34, h: 5.98, sound: "audio/page1/3.mp3" },
  { id: "4s", cx: 24.12, cy: 52.4, w: 6.61, h: 4.59, sound: "audio/page1/4.mp3" },
  { id: "5s", cx: 73.79, cy: 17.56, w: 20.55, h: 24.12, sound: "audio/page1/5.mp3" },
  { id: "6s", cx: 10.57, cy: 73.69, w: 15.49, h: 15.58, sound: "audio/page1/6.mp3" },
  { id: "7s", cx: 30.97, cy: 78.5, w: 9.47, h: 6.62, sound: "audio/page1/7.mp3" },
  { id: "8s", cx: 56.43, cy: 54.96, w: 4.17, h: 21.88, sound: "audio/page1/8.mp3" },
  { id: "9s", cx: 77.19, cy: 49.04, w: 10.66, h: 13.87, sound: "audio/page1/9.mp3" },
  { id: "10s", cx: 64.62, cy: 78.23, w: 3.87, h: 16.54, sound: "audio/page1/10.mp3" },
];

export default page1Hotspots.map((spot) => ({
  clickSound: "audio/clicks/photoClick.mp3",
  ...spot,
}));
