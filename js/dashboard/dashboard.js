function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");
  sidebar.classList.toggle("open");
  overlay.classList.toggle("visible");
}

function setTab(el) {
  document
    .querySelectorAll(".tab")
    .forEach((t) => t.classList.remove("active"));
  el.classList.add("active");
}

// Animate progress bar on load
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("progressFill").style.width = "30%";
  }, 400);
});
