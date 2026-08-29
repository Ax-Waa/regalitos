
import nacl from "https://esm.sh/tweetnacl@1.0.3";
import { encodeUTF8, decodeUTF8, encodeBase64, decodeBase64 } from "./codec.js";

export function keyPairFromPassword(password) {
  const hash = nacl.hash(encodeUTF8(password));
  const seed = hash.slice(0, 32); 
  return nacl.box.keyPair.fromSecretKey(seed);
}
export function generarDerangement(nombres) {
  let receptores;
  do {
    receptores = [...nombres];
    for (let i = receptores.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [receptores[i], receptores[j]] = [receptores[j], receptores[i]];
    }
  } while (nombres.some((nombre, i) => nombre === receptores[i]));

  const asignacion = {};
  nombres.forEach((regala, i) => (asignacion[regala] = receptores[i]));
  return asignacion;
}

export function cifrarParaRegalador(nombreReceptor, llavePublicaRegalador) {
  const efimero = nacl.box.keyPair();
  const nonce = nacl.randomBytes(nacl.box.nonceLength);
  const mensaje = encodeUTF8(nombreReceptor);
  const cifrado = nacl.box(
    mensaje,
    nonce,
    llavePublicaRegalador,
    efimero.secretKey,
  );

  return {
    cifrado: encodeBase64(cifrado),
    nonce: encodeBase64(nonce),
    llavePublicaEfimera: encodeBase64(efimero.publicKey),
  };
}

export function descifrar(paquete, llavePrivadaPropia) {
  const cifrado = decodeBase64(paquete.cifrado);
  const nonce = decodeBase64(paquete.nonce);
  const llavePublicaEfimera = decodeBase64(paquete.llavePublicaEfimera);

  const abierto = nacl.box.open(
    cifrado,
    nonce,
    llavePublicaEfimera,
    llavePrivadaPropia,
  );
  if (!abierto)
    throw new Error("No se pudo descifrar (¿contraseña equivocada?)");
  return decodeUTF8(abierto);
}
