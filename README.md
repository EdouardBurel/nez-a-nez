# Cabinet NEZ à NEZ

Site immersif « point & click » : une grande scène qui défile horizontalement,
une musique d'ambiance en boucle, des curiosités cliquables qui ouvrent une
image en fondu, et une enseigne « NEZ à NEZ » qui s'allume comme un néon.

## Lancer le projet

Prérequis : [Node.js](https://nodejs.org) (version 18 ou plus).

```bash
npm install
npm run dev
```

Puis ouvrez l'adresse affichée (en général `http://localhost:5173`).

Pour produire la version finale à mettre en ligne :

```bash
npm run build     # génère le dossier dist/
npm run preview   # pour vérifier le résultat localement
```

## Comment ça marche

| Élément | Fichier |
|---|---|
| Scène, défilement, zones cliquables | `src/components/Scene.jsx` |
| Coordonnées des zones (en % de l'image) | `src/hotspots.js` |
| Pop-up d'image (fondu, bouton ×, clic extérieur, Échap) | `src/components/Lightbox.jsx` |
| Enseigne néon (clic pour allumer / éteindre) | `src/components/NeonSign.jsx` |
| Musique en boucle + bouton muet | `src/components/AudioPlayer.jsx` |
| Styles (néon, fondu, lueurs) | `src/styles.css` |
| Images et son | `public/assets/` et `public/audio/` |

Remarque sur la musique : les navigateurs bloquent la lecture automatique.
Elle démarre donc au premier clic, défilement ou appui sur une touche.

## Ajuster ou ajouter des zones cliquables

1. Lancez le site avec `?debug` à la fin de l'URL :
   `http://localhost:5173/?debug`
2. Les zones deviennent visibles (cercles rouges numérotés).
3. Chaque clic sur la scène affiche ses coordonnées en pourcentage dans la
   console du navigateur (F12 → Console), par exemple `cx: 42.10, cy: 37.50`.
4. Recopiez ces valeurs dans `src/hotspots.js` (et ajustez `w` / `h`).

Pour ajouter une nouvelle curiosité (17, 18, …) : déposez l'image dans
`public/assets/details/`, puis ajoutez une ligne dans `src/hotspots.js`.

## Publier sur GitHub

```bash
git init
git add .
git commit -m "Cabinet NEZ à NEZ — première version"
git branch -M main
git remote add origin https://github.com/<votre-compte>/<votre-repo>.git
git push -u origin main
```

Pour GitHub Pages : dans `vite.config.js`, remplacez `base: './'` par
`base: '/<nom-du-repo>/'`, lancez `npm run build`, puis publiez le dossier
`dist/` (par exemple avec l'action « Deploy static content to Pages »).
