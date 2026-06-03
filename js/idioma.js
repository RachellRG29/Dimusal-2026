const btn = document.getElementById("btnIdioma");

let idioma = localStorage.getItem("idioma") || "es";

function aplicarIdioma() {
  // Cambia el atributo lang del HTML
  document.documentElement.lang = idioma;

  // Cambia texto del botón de idioma
  if (btn) {
    btn.textContent = idioma.toUpperCase();
  }

  // Traduce todos los elementos con data-es / data-en
  document.querySelectorAll("[data-es]").forEach((el) => {
    const texto = el.getAttribute(`data-${idioma}`);
    if (texto) {
      el.innerHTML = texto;
    }
  });
}

// Ejecutar al cargar
aplicarIdioma();

// Evento click para cambiar idioma
if (btn) {
  btn.addEventListener("click", () => {
    idioma = idioma === "es" ? "en" : "es";
    localStorage.setItem("idioma", idioma);
    aplicarIdioma();
  });
}

/* ===========================
   IDIOMA
=========================== */

function aplicarIdioma() {
  document.documentElement.lang = idioma;

  if (btn) {
    btn.textContent = idioma.toUpperCase();
  }

  document.querySelectorAll("[data-es]").forEach((el) => {
    const texto = el.getAttribute(`data-${idioma}`);

    if (texto) {
      el.innerHTML = texto;
    }
  });
}

/* ===========================
   INICIALIZACION
=========================== */

window.addEventListener("DOMContentLoaded", () => {
  aplicarIdioma();
});
