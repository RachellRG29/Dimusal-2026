const btn = document.getElementById("btnIdioma");

let idioma = localStorage.getItem("idioma") || "es";

function aplicarIdioma() {
  document.documentElement.lang = idioma;

  const textoIdioma = btn.querySelector(".texto-idioma");

  if (textoIdioma) {
    textoIdioma.textContent = idioma.toUpperCase();
  }

  document.querySelectorAll("[data-es]").forEach((el) => {
    const texto = el.getAttribute(`data-${idioma}`);

    if (texto) {
      el.innerHTML = texto;
    }
  });
}

window.addEventListener("DOMContentLoaded", () => {
  aplicarIdioma();
});

if (btn) {
  btn.addEventListener("click", () => {
    idioma = idioma === "es" ? "en" : "es";
    localStorage.setItem("idioma", idioma);
    aplicarIdioma();
  });
}
