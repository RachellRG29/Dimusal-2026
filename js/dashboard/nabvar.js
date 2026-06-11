// navbar.js

document.addEventListener("DOMContentLoaded", () => {
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileMenu = document.getElementById("mobileMenu");

  if (!mobileMenuBtn || !mobileMenu) return;

  // Abrir / cerrar menú
  mobileMenuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    mobileMenu.classList.toggle("open");
  });

  // Cerrar al seleccionar una opción
  mobileMenu.querySelectorAll("a").forEach((item) => {
    item.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
    });
  });

  // Cerrar al hacer click fuera
  document.addEventListener("click", (e) => {
    if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
      mobileMenu.classList.remove("open");
    }
  });
});
