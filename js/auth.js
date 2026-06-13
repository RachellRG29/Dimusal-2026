// ═══════════════════════════════════════════════════════════════
//  DIMUSAL – auth.js
//  Maneja datos del usuario logueado y cierre de sesión
// ═══════════════════════════════════════════════════════════════

// ── Proteger ruta: si no hay sesión, redirigir a login ────────
const usuarioGuardado = localStorage.getItem("usuario");
if (!usuarioGuardado) {
  window.location.href = "/login.html";
}

const usuario = JSON.parse(usuarioGuardado || "{}");

// ── Mostrar nombre del usuario ─────────────────────────────────
function mostrarNombreUsuario() {
  // Para dashboard.html (clase .name)
  const nameEl = document.querySelector(".name");
  if (nameEl && usuario.nombre) {
    nameEl.textContent = usuario.nombre;
  }

  // Para perfil.html (clase .pa-profile-header__name)
  const perfilNameEl = document.querySelector(".pa-profile-header__name");
  if (perfilNameEl && usuario.nombre) {
    perfilNameEl.textContent = usuario.nombre;
  }
}

mostrarNombreUsuario();

// ── Logout ──────────────────────────────────────────────────────
document.querySelectorAll(".logout").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("usuario");
    window.location.href = "/login.html";
  });
});
