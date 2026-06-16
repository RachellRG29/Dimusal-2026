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

// ── Helper: iniciales del nombre ───────────────────────────────
function obtenerIniciales(nombre = "") {
  return nombre
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || "")
    .join("");
}

// ── Helper: aplicar foto a un elemento avatar ──────────────────
function aplicarFotoAvatar(el, fotoUrl) {
  if (!el) return;
  el.innerHTML = "";
  el.style.backgroundImage = `url('${fotoUrl}')`;
  el.style.backgroundSize = "cover";
  el.style.backgroundPosition = "center";
  el.style.fontSize = "0";
  el.style.color = "transparent";
}

// ── Mostrar nombre del usuario ─────────────────────────────────
function mostrarNombreUsuario() {
  const iniciales = obtenerIniciales(usuario.nombre);
  const tipo = usuario.tipo || "";
  const tipoCapitalizado = tipo.charAt(0).toUpperCase() + tipo.slice(1);
  // ── Dashboard: topbar "Hola, [tipo]" ──
  const topbarTipo = document.getElementById("topbarTipo");
  if (topbarTipo && tipo) topbarTipo.textContent = tipoCapitalizado;
  // Sidebar – nombre
  const nameEl = document.querySelector(".sidebar-bottom .name");
  if (nameEl && usuario.nombre) nameEl.textContent = usuario.nombre;

  // Sidebar – rol
  const roleEl = document.querySelector(".sidebar-bottom .role");
  if (roleEl && tipo) roleEl.textContent = tipoCapitalizado;

  // Perfil – nombre en header
  const perfilNameEl = document.querySelector(".pa-profile-header__name");
  if (perfilNameEl && usuario.nombre) perfilNameEl.textContent = usuario.nombre;

  // ── Eventos: chip flotante del hero ──
  const evChipAva = document.querySelector(
    ".ev-promotor-chip .ev-promotor-avatar",
  );
  if (evChipAva) evChipAva.textContent = iniciales;

  const evChipNombre = document.querySelector(
    ".ev-promotor-chip .ev-promotor-name",
  );
  if (evChipNombre && usuario.nombre) evChipNombre.textContent = usuario.nombre;

  // ── Eventos: tarjeta promotor en sidebar ──
  const evPromoAva = document.querySelector(".ev-promotor-ava");
  if (evPromoAva) evPromoAva.textContent = iniciales;

  const evPromoNombre = document.querySelector(".ev-promotor-info-name");
  if (evPromoNombre && usuario.nombre)
    evPromoNombre.textContent = usuario.nombre;

  const evPromoRol = document.querySelector(".ev-promotor-info-role");
  if (evPromoRol) {
    evPromoRol.textContent =
      tipo === "promotor" ? "⚡ Promotor verificado" : `🎵 ${tipoCapitalizado}`;
  }

  // ── Oportunidades: sección "Publicado por" ──
  const oppPromoAva = document.getElementById("oppDetPromoAva");
  if (oppPromoAva) oppPromoAva.textContent = iniciales;

  const oppPromoNombre = document.getElementById("oppDetPromoNombre");
  if (oppPromoNombre && usuario.nombre)
    oppPromoNombre.textContent = usuario.nombre;

  // ── Cargar foto real desde BD (aplica a todos los avatares) ──
  cargarAvatarSidebar();
}

// ── Cargar foto de perfil real desde la BD ─────────────────────
async function cargarAvatarSidebar() {
  if (!usuario.id) return;

  try {
    const res = await fetch(`/api/usuario/${usuario.id}`);
    const data = await res.json();

    if (!data.success || !data.usuario.foto_logo) return;

    const fotoUrl = data.usuario.foto_logo;

    // Sidebar
    aplicarFotoAvatar(
      document.querySelector(".sidebar-bottom .avatar"),
      fotoUrl,
    );

    // Eventos – chip hero
    aplicarFotoAvatar(
      document.querySelector(".ev-promotor-chip .ev-promotor-avatar"),
      fotoUrl,
    );

    // Eventos – tarjeta promotor sidebar
    aplicarFotoAvatar(document.querySelector(".ev-promotor-ava"), fotoUrl);

    // Oportunidades – sección promotor
    aplicarFotoAvatar(document.getElementById("oppDetPromoAva"), fotoUrl);
  } catch (err) {
    console.error("Error al cargar avatar:", err);
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
// ── Topbar dropdown ─────────────────────────────────────────────
function toggleTopbarMenu() {
  const user = document.getElementById("topbarUser");
  const dropdown = document.getElementById("topbarDropdown");
  if (!user || !dropdown) return;
  const abierto = dropdown.classList.toggle("open");
  user.classList.toggle("open", abierto);
}

document.addEventListener("click", (e) => {
  const user = document.getElementById("topbarUser");
  const dropdown = document.getElementById("topbarDropdown");
  if (user && dropdown && !user.contains(e.target)) {
    dropdown.classList.remove("open");
    user.classList.remove("open");
  }
});

// ── Controlar visibilidad del menú según tipo de cuenta ────────
function aplicarMenuPorTipo() {
  const tipo = usuario.tipo || "";

  const soloPromotor = document.querySelectorAll(
    '[data-page="/dashboard/inicio-promotor.html"], [data-page="/dashboard/crear-evento.html"]',
  );
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
