
const musica = new Audio("assets/musica.mp3");
musica.loop = true;

const VOLUMEN_OBJETIVO = 0.4;

export function iniciarMusicaConFade() {
  musica.volume = 0;
  musica.play().catch(() => {});
  sessionStorage.setItem("musicaActiva", "1");

  let volumenActual = 0;
  const fade = setInterval(() => {
    volumenActual += 0.02;
    if (volumenActual >= VOLUMEN_OBJETIVO) {
      musica.volume = VOLUMEN_OBJETIVO;
      clearInterval(fade);
    } else {
      musica.volume = volumenActual;
    }
  }, 200);
}
export function continuarMusicaSiActiva() {
  if (sessionStorage.getItem("musicaActiva") === "1") {
    musica.volume = VOLUMEN_OBJETIVO;
    musica.play().catch(() => {});
  }
}

export function alternarMute(boton) {
  musica.muted = !musica.muted;
  boton.textContent = musica.muted ? "🔇" : "🔊";
}
