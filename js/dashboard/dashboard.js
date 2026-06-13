/* ────────────────────────────────────────────── */
/* Router */
/* ────────────────────────────────────────────── */

const mainContent = document.getElementById("main-content");

async function loadPage(url) {
  try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`No se pudo cargar ${url}`);
    }

    mainContent.innerHTML = await res.text();

    initPageScripts();

    // ── Aplicar idioma después de cargar el contenido ──
    if (typeof aplicarIdioma === "function") {
      aplicarIdioma();
    }

    // ── Mostrar nombre del usuario después de cargar el contenido ──
    if (typeof mostrarNombreUsuario === "function") {
      mostrarNombreUsuario();
    }
  } catch (error) {
    mainContent.innerHTML =
      '<p style="padding:2rem;color:red">Error cargando la página.</p>';

    console.error(error);
  }
}

/* ────────────────────────────────────────────── */
/* Scripts de cada página */
/* ────────────────────────────────────────────── */

function initPageScripts() {
  const fill = document.getElementById("progressFill");

  if (fill) {
    fill.style.width = "0%";

    setTimeout(() => {
      fill.style.width = "30%";
    }, 400);
  }

  if (typeof renderProfileTags === "function") {
    renderProfileTags();
  }

  if (document.getElementById("oppList") && typeof initOppPage === "function") {
    initOppPage();
  }
}

/* ────────────────────────────────────────────── */
/* Sidebar Desktop */
/* ────────────────────────────────────────────── */

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");

  if (sidebar) sidebar.classList.toggle("open");
  if (overlay) overlay.classList.toggle("visible");
}

function setTab(btn) {
  document.querySelectorAll(".filter-tabs .tab").forEach((tab) => {
    tab.classList.remove("active");
  });

  btn.classList.add("active");
}

/* ────────────────────────────────────────────── */
/* Activar menú actual */
/* ────────────────────────────────────────────── */

function setActiveNav(page) {
  document.querySelectorAll(".nav-item[data-page]").forEach((item) => {
    item.classList.toggle("active", item.dataset.page === page);
  });

  document.querySelectorAll(".mobile-menu-item[data-page]").forEach((item) => {
    item.classList.toggle("active", item.dataset.page === page);
  });
}

/* ────────────────────────────────────────────── */
/* Delegación de eventos */
/* Funciona para sidebar y móvil */
/* ────────────────────────────────────────────── */

document.addEventListener("click", (e) => {
  const item = e.target.closest("[data-page]");

  if (!item) return;

  e.preventDefault();

  const page = item.dataset.page;

  if (!page) return;

  setActiveNav(page);

  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");

  if (sidebar) sidebar.classList.remove("open");
  if (overlay) overlay.classList.remove("visible");

  const mobileMenu = document.getElementById("mobileMenu");

  if (mobileMenu) {
    mobileMenu.classList.remove("open");
  }

  loadPage(page);
});

/* ────────────────────────────────────────────── */
/* Carga inicial */
/* ────────────────────────────────────────────── */

window.addEventListener("DOMContentLoaded", () => {
  const inicio = "/dashboard/inicio.html";

  setActiveNav(inicio);

  loadPage(inicio);

  // ── Mostrar nombre del usuario en el dashboard principal ──
  if (typeof mostrarNombreUsuario === "function") {
    mostrarNombreUsuario();
  }
});
