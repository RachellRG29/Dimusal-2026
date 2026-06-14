const btn = document.getElementById("btnIdioma");

let idioma = localStorage.getItem("idioma") || "es";

function aplicarIdioma() {
  document.documentElement.lang = idioma;

  const textoIdioma = btn ? btn.querySelector(".texto-idioma") : null;

  if (textoIdioma) {
    textoIdioma.textContent = idioma.toUpperCase();
  }

  document.querySelectorAll("[data-es]").forEach((el) => {
    const texto = el.getAttribute(`data-${idioma}`);
    if (texto) {
      el.innerHTML = texto;
    }
  });

  // Traducir biografía dinámica si existe y ya fue cargada
  if (
    typeof traducirBiografia === "function" &&
    typeof bioOriginal !== "undefined" &&
    bioOriginal !== ""
  ) {
    traducirBiografia(bioOriginal, idioma);
  }
}

// Se llama al cargar en páginas normales (index, login, register, etc.)
// En dashboard lo llama loadPage() después de insertar el contenido
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
