
import { db } from "./firebase-config.js";
import {
  collection,
  getDocsFromServer,
  doc,
  getDocFromServer,
  runTransaction,
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import { generarDerangement, cifrarParaRegalador } from "./sorteo.js";
import { decodeBase64 } from "./codec.js";
import { iniciarNieve } from "./nieve.js";
import { NOMBRES } from "./nombres.js";

iniciarNieve();

import { continuarMusicaSiActiva, alternarMute } from "./musica.js";

continuarMusicaSiActiva();

const btnSonido = document.getElementById("btn-sonido");
btnSonido.addEventListener("click", () => alternarMute(btnSonido)); 

const estadoTexto = document.getElementById("estado-texto");
const mensaje = document.getElementById("mensaje");
const btnSortear = document.getElementById("btn-sortear");

function mostrarMensaje(texto, tipo) {
  mensaje.textContent = texto;
  mensaje.className = `mensaje ${tipo}`;
}

async function revisarEstadoInicial() {
  const estadoDoc = await getDocFromServer(doc(db, "estado", "sorteo"));
  if (estadoDoc.exists()) {
    estadoTexto.textContent =
      "El sorteo ya se hizo. Cada quien puede ir a ver su resultado.";
    btnSortear.remove();
    return;
  }

  const snap = await getDocsFromServer(collection(db, "registros"));
  const registrados = snap.docs.map((d) => d.id);
  const faltantes = NOMBRES.filter((n) => !registrados.includes(n));

  if (faltantes.length > 0) {
    estadoTexto.textContent = `Faltan por registrarse: ${faltantes.join(", ")}.`;
    btnSortear.disabled = true;
  } else {
    estadoTexto.textContent =
      "TODOS REGISTRADOS, TOCÓ SORTEO xd dale a sortear ";
    btnSortear.disabled = false;
  }
}

btnSortear.addEventListener("click", async () => {
  btnSortear.disabled = true;
  btnSortear.textContent = "Sorteando...";

  try {
    const snap = await getDocsFromServer(collection(db, "registros"));
    const llavesPublicas = {};
    snap.forEach((d) => {
      llavesPublicas[d.id] = decodeBase64(d.data().publicKey);
    });

    const asignacion = generarDerangement(NOMBRES);

    const paquetes = {};
    for (const regala of NOMBRES) {
      const receptor = asignacion[regala];
      paquetes[regala] = cifrarParaRegalador(receptor, llavesPublicas[regala]);
    }

    await runTransaction(db, async (transaccion) => {
      const estadoRef = doc(db, "estado", "sorteo");
      const estadoActual = await transaccion.get(estadoRef);
      if (estadoActual.exists()) {
        throw new Error("YA_HECHO");
      }

      for (const regala of NOMBRES) {
        transaccion.set(doc(db, "resultados", regala), paquetes[regala]);
      }
      transaccion.set(estadoRef, {
        hecho: true,
        fecha: new Date().toISOString(),
      });
    });

    mostrarMensaje(
      "Sorteo terminaod Cada quien ya puede ir a ver su resultado xd",
      "ok",
    );
    btnSortear.textContent = "Sorteado";
  } catch (error) {
    if (error.message === "YA_HECHO") {
      mostrarMensaje(
        "Alguien más ya hizo el sorteo. checa la pantalla de resultados",
        "ok",
      );
      btnSortear.remove();
    } else {
      console.error(error);
      mostrarMensaje("Algo falló al sortear. Intenta de nuevo.", "error");
      btnSortear.disabled = false;
      btnSortear.textContent = "Sortear ahora";
    }
  }
});

revisarEstadoInicial();
