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
  const nameEl = document.querySelector(".name");
  if (nameEl && usuario.nombre) {
    nameEl.textContent = usuario.nombre;
  }

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

// ── Controlar visibilidad del menú según tipo de cuenta ────────
function aplicarMenuPorTipo() {
  const tipo = usuario.tipo || "";

  // Items solo para promotor
  const soloPromotor = document.querySelectorAll(
    '[data-page="/dashboard/inicio-promotor.html"], [data-page="/dashboard/crear-evento.html"]',
  );

  // Items solo para artista/oyente
  const soloArtista = document.querySelectorAll(
    '[data-page="/dashboard/inicio.html"]',
  );

  if (tipo === "promotor") {
    soloPromotor.forEach((el) => (el.style.display = ""));
    soloArtista.forEach((el) => (el.style.display = "none"));
  } else {
    soloPromotor.forEach((el) => (el.style.display = "none"));
    soloArtista.forEach((el) => (el.style.display = ""));
  }
}

aplicarMenuPorTipo();
