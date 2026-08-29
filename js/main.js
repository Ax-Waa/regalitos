// main.js — interacción de la pantalla "¿Quién eres?"

import { db } from "./firebase-config.js";
import {
  collection,
  getDocsFromServer,
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import { iniciarNieve } from "./nieve.js";

iniciarNieve();

const select = document.getElementById("quien-soy");
const btnContinuar = document.getElementById("btn-continuar");

async function marcarNombresRegistrados() {
  try {
    const snap = await getDocsFromServer(collection(db, "registros"));
    snap.forEach((docSnap) => {
      const opcion = select.querySelector(`option[value="${docSnap.id}"]`);
      if (opcion) {
        opcion.textContent += " — ya registrado";
        opcion.disabled = true;
      }
    });
  } catch (error) {
    console.warn("No se pudo consultar Firestore todavía:", error.message);
  }
}
marcarNombresRegistrados();

select.addEventListener("change", () => {
  btnContinuar.disabled = !select.value;
});

btnContinuar.addEventListener("click", () => {
  const quienSoy = select.value;
  if (!quienSoy) return;

  sessionStorage.setItem("quienSoy", quienSoy);
  window.location.href = "registro.html";
});

import { iniciarMusicaConFade, continuarMusicaSiActiva, alternarMute } from './musica.js';

const intro = document.getElementById('intro');
const btnComenzar = document.getElementById('btn-comenzar');

if (sessionStorage.getItem('musicaActiva') === '1') {
  intro.classList.add('oculto');
  continuarMusicaSiActiva();
} else {
  btnComenzar.addEventListener('click', () => {
    intro.classList.add('cerrando');
    setTimeout(() => intro.classList.add('oculto'), 500);
    iniciarMusicaConFade();
  });
}

const btnSonido = document.getElementById('btn-sonido');
btnSonido.addEventListener('click', () => alternarMute(btnSonido));