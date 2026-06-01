const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  mobileMenu.classList.toggle("open");
});

mobileMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("open");
    mobileMenu.classList.remove("open");
  });
});

document.addEventListener("click", (e) => {
  if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
    hamburger.classList.remove("open");
    mobileMenu.classList.remove("open");
  }
});

// al redimensionar a desktop, cerrar el menú y limpiar clases
window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    hamburger.classList.remove("open");
    mobileMenu.classList.remove("open");
  }
});
