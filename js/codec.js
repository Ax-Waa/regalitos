
export function encodeUTF8(texto) {
  return new TextEncoder().encode(texto);
}

export function decodeUTF8(bytes) {
  return new TextDecoder().decode(bytes);
}

export function encodeBase64(bytes) {
  let binario = "";
  bytes.forEach((byte) => {
    binario += String.fromCharCode(byte);
  });
  return btoa(binario);
}

export function decodeBase64(base64) {
  const binario = atob(base64);
  const bytes = new Uint8Array(binario.length);
  for (let i = 0; i < binario.length; i++) {
    bytes[i] = binario.charCodeAt(i);
  }
  return bytes;
}
