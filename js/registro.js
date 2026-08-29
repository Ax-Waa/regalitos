import { db } from "./firebase-config.js";
import {
  doc,
  getDocFromServer,
  setDoc,
  collection,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import { keyPairFromPassword } from "./sorteo.js";
import { encodeBase64 } from "./codec.js";
import { iniciarNieve } from "./nieve.js";
import { NOMBRES } from "./nombres.js";

iniciarNieve();

import { continuarMusicaSiActiva, alternarMute } from "./musica.js";

continuarMusicaSiActiva();

const btnSonido = document.getElementById("btn-sonido");
btnSonido.addEventListener("click", () => alternarMute(btnSonido));

const quienSoy = sessionStorage.getItem("quienSoy");

if (!quienSoy) {
  window.location.href = "index.html";
}

document.getElementById("titulo").textContent = `Hola, ${quienSoy}`;

const form = document.getElementById("form-registro");
const clave = document.getElementById("clave");
const claveConfirmar = document.getElementById("clave-confirmar");
const mensaje = document.getElementById("mensaje");
const btnRegistrar = document.getElementById("btn-registrar");

const esperando = document.getElementById("esperando");
const spinnerEspera = document.getElementById("spinner-espera");
const contadorEspera = document.getElementById("contador-espera");
const detalleEspera = document.getElementById("detalle-espera");
const enlaceSorteo = document.getElementById("enlace-sorteo");

function mostrarMensaje(texto, tipo) {
  mensaje.textContent = texto;
  mensaje.className = `mensaje ${tipo}`;
}

form.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  if (clave.value !== claveConfirmar.value) {
    mostrarMensaje("Las contraseñas no son las mismas", "error");
    return;
  }

  btnRegistrar.disabled = true;
  btnRegistrar.textContent = "Registrando...";

  try {
    const referencia = doc(db, "registros", quienSoy);
    const existente = await getDocFromServer(referencia);

    if (existente.exists()) {
      mostrarMensaje(
        "Ese nombre ya se registró antes. Algún payaso usplantó tu identidad, avisame altoque",
        "error",
      );
      btnRegistrar.disabled = false;
      btnRegistrar.textContent = "Registrarme";
      return;
    }

    const llaves = keyPairFromPassword(clave.value);
    const llavePublica = encodeBase64(llaves.publicKey);

    await setDoc(referencia, { publicKey: llavePublica });

    sessionStorage.removeItem("quienSoy");
    form.classList.add("oculto");
    esperando.classList.remove("oculto");
    escucharRegistros();
  } catch (error) {
    console.error(error);
    mostrarMensaje(
      "Algo falló al guardar tu registro. Intenta de nuevo.",
      "error",
    );
    btnRegistrar.disabled = false;
    btnRegistrar.textContent = "Registrarme";
  }
});

function escucharRegistros() {
  onSnapshot(collection(db, "registros"), (snap) => {
    const registrados = snap.docs.map((d) => d.id);
    const faltantes = NOMBRES.filter((n) => !registrados.includes(n));

    if (faltantes.length === 0) {
      spinnerEspera.classList.add("oculto");
      contadorEspera.textContent = "YA ESTAAAAAA";
      detalleEspera.textContent = "Cualquiera puede entrar a hacer el sorteo";
      enlaceSorteo.classList.remove("oculto");
    } else {
      contadorEspera.textContent = `${registrados.length}/${NOMBRES.length} registrados`;
      detalleEspera.textContent = `Faltan: ${faltantes.join(", ")}`;
    }
  });
}
