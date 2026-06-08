/* dashboard.js */

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");
  sidebar.classList.toggle("open");
  overlay.classList.toggle("visible");
}

function setTab(btn) {
  document
    .querySelectorAll(".filter-tabs .tab")
    .forEach((t) => t.classList.remove("active"));
  btn.classList.add("active");
}

// Animación de la barra de progreso al cargar
window.addEventListener("load", () => {
  const fill = document.getElementById("progressFill");
  if (fill) {
    fill.style.width = "0%";
    setTimeout(() => {
      fill.style.width = "30%";
    }, 400);
  }
});
