
import { db } from "./firebase-config.js";
import {
  doc,
  getDocFromServer,
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import { keyPairFromPassword, descifrar } from "./sorteo.js";
import { iniciarNieve } from "./nieve.js";

iniciarNieve();

import { continuarMusicaSiActiva, alternarMute } from "./musica.js";

continuarMusicaSiActiva();

const btnSonido = document.getElementById("btn-sonido");
btnSonido.addEventListener("click", () => alternarMute(btnSonido));

const form = document.getElementById("form-revelar");
const select = document.getElementById("quien-soy");
const clave = document.getElementById("clave");
const mensaje = document.getElementById("mensaje");
const btnRevelar = document.getElementById("btn-revelar");
const resultadoDiv = document.getElementById("resultado");
const nombreReceptor = document.getElementById("nombre-receptor");

function mostrarMensaje(texto, tipo) {
  mensaje.textContent = texto;
  mensaje.className = `mensaje ${tipo}`;
}

form.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  mostrarMensaje("", "");

  const nombre = select.value;
  btnRevelar.disabled = true;
  btnRevelar.textContent = "Checando...";

  try {
    const referencia = doc(db, "resultados", nombre);
const snap = await getDocFromServer(referencia);

    if (!snap.exists()) {
      mostrarMensaje(
        "El sorteo todavía no se ha hecho. perate un toque.",
        "error",
      );
      return;
    }

    const llaves = keyPairFromPassword(clave.value);
    const receptor = descifrar(snap.data(), llaves.secretKey);

    form.classList.add("oculto");
    resultadoDiv.classList.remove("oculto");
    nombreReceptor.textContent = receptor;
  } catch (error) {
    if (error.message.includes("descifrar")) {
      mostrarMensaje("Contraseña incorrecta. Intenta de nuevo.", "error");
    } else {
      console.error(error);
      mostrarMensaje("Algo falló. Intenta de nuevo.", "error");
    }
  } finally {
    btnRevelar.disabled = false;
    btnRevelar.textContent = "Revelar";
  }
});
