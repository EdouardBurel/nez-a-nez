/**
 * Gestionnaire des sons de survol.
 * - un seul son à la fois (survoler une autre zone remplace le son)
 * - fondu de sortie quand la souris quitte la zone
 * - respecte le bouton muet global (voir AudioPlayer.jsx)
 */
const manager = {
  muted: false,
  current: null,
  currentSrc: null,
  fadeTimer: null,

  play(src) {
    if (this.muted || !src) return;
    // 32/33/34 partagent le même fichier : ne pas redémarrer
    if (this.currentSrc === src && this.current && !this.current.paused) {
      clearInterval(this.fadeTimer);
      this.current.volume = 0.03;
      return;
    }
    this.stop(true); // coupe net l'éventuel son précédent
    const audio = new Audio(src);
    audio.volume = 0.03;
    audio.play().catch(() => {});
    this.current = audio;
    this.currentSrc = src;
  },

  stop(immediate = false) {
    clearInterval(this.fadeTimer);
    const audio = this.current;
    if (!audio) return;
    if (immediate) {
      audio.pause();
      this.current = null;
      this.currentSrc = null;
      return;
    }
    // fondu de sortie (~300 ms)
    this.fadeTimer = setInterval(() => {
      if (audio.volume > 0.08) {
        audio.volume -= 0.08;
      } else {
        clearInterval(this.fadeTimer);
        audio.pause();
        if (this.current === audio) {
          this.current = null;
          this.currentSrc = null;
        }
      }
    }, 30);
  },

  setMuted(m) {
    this.muted = m;
    if (m) this.stop(true);
  },
};

export default manager;
