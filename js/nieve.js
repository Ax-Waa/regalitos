export function iniciarNieve() {
  const canvas = document.getElementById("nieve");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  function ajustarTamano() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  ajustarTamano();
  window.addEventListener("resize", ajustarTamano);

  const copos = Array.from({ length: 60 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    radio: Math.random() * 2 + 0.5,
    velocidad: Math.random() * 0.6 + 0.2,
    deriva: Math.random() * 0.4 - 0.2,
  }));

  function dibujar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(242, 240, 234, 0.55)";
    for (const copo of copos) {
      ctx.beginPath();
      ctx.arc(copo.x, copo.y, copo.radio, 0, Math.PI * 2);
      ctx.fill();
      copo.y += copo.velocidad;
      copo.x += copo.deriva;
      if (copo.y > window.innerHeight) {
        copo.y = -5;
        copo.x = Math.random() * window.innerWidth;
      }
    }
    requestAnimationFrame(dibujar);
  }

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    dibujar();
  }
}
