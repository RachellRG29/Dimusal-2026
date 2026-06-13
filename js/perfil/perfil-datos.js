// ═══════════════════════════════════════════════════════════════
//  DIMUSAL – perfil-datos.js
//  Carga los datos del usuario logueado desde la BD y los muestra
// ═══════════════════════════════════════════════════════════════

// ── Listas de referencia para clasificar etiquetas ─────────────
const TAGS_GENEROS = [
  "Rock",
  "Pop",
  "Jazz",
  "Clásica",
  "Folk",
  "Cumbia",
  "Reggaeton",
  "Hip-Hop",
  "Electrónica",
  "Metal",
  "Blues",
  "Salsa",
  "Tropical",
  "Indie",
  "Alternativo",
  "R&B",
];
const TAGS_INSTRUMENTOS = [
  "Guitarra",
  "Piano",
  "Batería",
  "Bajo",
  "Voz",
  "Violín",
  "Saxofón",
  "Trompeta",
  "Teclado",
  "Percusión",
  "DJ / Producción",
  "Flauta",
];
const TAGS_ESTILOS = [
  "Acústico",
  "En vivo",
  "Solo",
  "Banda",
  "Dúo",
  "Orquesta",
  "Experimental",
  "Electrónico en vivo",
];
const TAGS_EVENTOS = [
  "Festival",
  "Tocata",
  "Boda",
  "Corporativo",
  "Bar / Venue",
  "Cultural",
  "Grabación",
  "Colaboración",
  "Streaming",
];

async function cargarPerfil() {
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
  if (!usuario.id) return;

  try {
    const res = await fetch(`/api/usuario/${usuario.id}`);
    const data = await res.json();

    if (!data.success) {
      console.error("No se pudo cargar el perfil:", data.mensaje);
      return;
    }

    pintarPerfil(data.usuario);
  } catch (err) {
    console.error("Error al cargar perfil:", err);
  }
}

function pintarPerfil(u) {
  // ── Nombre ──────────────────────────────────────────────────
  const nombreMostrar = u.nombre_artistico || u.nombre_completo;
  const nameEl = document.querySelector(".pa-profile-header__name");
  if (nameEl) nameEl.textContent = nombreMostrar;

  // ── Badge tipo de cuenta ────────────────────────────────────
  const badgeEl = document.querySelector(".pa-badge");
  if (badgeEl && u.tipo) {
    const tipoCapitalizado = u.tipo.charAt(0).toUpperCase() + u.tipo.slice(1);
    badgeEl.textContent = tipoCapitalizado;
  }

  // ── Ubicación ───────────────────────────────────────────────
  const metaEl = document.querySelector(".pa-profile-header__meta");
  if (metaEl) {
    const ubicacion = u.distrito
      ? `${u.municipio}, ${u.distrito}, ${u.departamento}`
      : `${u.municipio}, ${u.departamento}`;
    metaEl.innerHTML = `${ubicacion} &nbsp;·&nbsp; Disponible para <span class="pa-meta-dash">________</span>`;
  }

  // ── Imágenes: foto/logo y portada ───────────────────────────
  const avatarImg = document.getElementById("avatarImg");
  if (avatarImg && u.foto_logo) {
    avatarImg.src = `/${u.foto_logo}`;
  }

  const coverImg = document.getElementById("coverImg");
  if (coverImg && u.portada) {
    coverImg.src = `/${u.portada}`;
  }

  // ── Información de contacto ─────────────────────────────────
  const infoItems = document.querySelectorAll(".pa-info-list .pa-info-item");
  if (infoItems.length >= 4) {
    // Item 1: Municipio / Departamento
    infoItems[0].querySelector(".pa-info-item__main").textContent = u.municipio;
    infoItems[0].querySelector(".pa-info-item__sub").textContent =
      u.departamento;

    // Item 2: Edad/Activo desde (usamos fecha de creación)
    const fecha = new Date(u.created_at);
    const año = fecha.getFullYear();
    infoItems[1].querySelector(".pa-info-item__main").textContent = "";
    infoItems[1].querySelector(".pa-info-item__sub").textContent =
      `Activo desde ${año}`;

    // Item 3: Correo
    infoItems[2].querySelector(".pa-info-item__main").textContent = u.correo;

    // Item 4: Teléfono
    infoItems[3].querySelector(".pa-info-item__main").textContent =
      `+503 ${u.telefono}`;
  }

  // ── Redes sociales ───────────────────────────────────────────
  const socialsGrid = document.querySelector(".pa-socials-grid");
  if (socialsGrid) {
    socialsGrid.innerHTML = "";

    const redes = [
      { nombre: "Spotify", url: u.spotify },
      {
        nombre: "Instagram",
        url: u.instagram ? `https://instagram.com/${u.instagram}` : null,
      },
      { nombre: "YouTube", url: u.youtube },
      {
        nombre: "TikTok",
        url: u.tiktok ? `https://tiktok.com/@${u.tiktok}` : null,
      },
    ];

    redes.forEach((red) => {
      if (red.url) {
        const a = document.createElement("a");
        a.href = red.url;
        a.target = "_blank";
        a.className = "pa-social-tag";
        a.textContent = red.nombre;
        socialsGrid.appendChild(a);
      }
    });

    if (socialsGrid.children.length === 0) {
      socialsGrid.innerHTML =
        '<span style="color:#aaa;font-size:13px;">Sin redes sociales agregadas</span>';
    }
  }

  // ── Portafolio ───────────────────────────────────────────────
  const tabPortafolio = document.getElementById("tab-portafolio");
  if (tabPortafolio) {
    if (u.portafolio) {
      tabPortafolio.innerHTML = `
        <div class="pa-card">
          <h2 class="pa-card__title">Portafolio</h2>
          <p class="pa-card__text">
            <a href="${u.portafolio}" target="_blank" style="color:var(--orange);">${u.portafolio}</a>
          </p>
        </div>
      `;
    }
  }

  // ── Etiquetas ────────────────────────────────────────────────
  let etiquetas = [];
  try {
    etiquetas = JSON.parse(u.etiquetas || "[]");
  } catch (e) {
    etiquetas = [];
  }

  pintarEtiquetas(etiquetas);
}

function pintarEtiquetas(etiquetas) {
  // ── Barra superior "Mis etiquetas" ──────────────────────────
  const display = document.getElementById("profileTagsDisplay");
  if (display) {
    if (etiquetas.length > 0) {
      display.innerHTML = etiquetas
        .map((tag) => `<span class="pa-tag pa-tag--orange">${tag}</span>`)
        .join("");
    }
  }

  // ── Clasificar etiquetas por categoría ──────────────────────
  const generos = etiquetas.filter((t) => TAGS_GENEROS.includes(t));
  const instrumentos = etiquetas.filter((t) => TAGS_INSTRUMENTOS.includes(t));
  const estilos = etiquetas.filter((t) => TAGS_ESTILOS.includes(t));
  const eventos = etiquetas.filter((t) => TAGS_EVENTOS.includes(t));

  // ── Géneros musicales (card "Sobre mí") ─────────────────────
  const tagsContainer = document.querySelector(".pa-card .pa-tags");
  if (tagsContainer) {
    if (generos.length > 0) {
      tagsContainer.innerHTML = generos
        .map((tag) => `<span class="pa-tag pa-tag--orange">${tag}</span>`)
        .join("");
    } else {
      tagsContainer.innerHTML =
        '<span style="color:#aaa;font-size:13px;">Sin géneros agregados</span>';
    }
  }

  // ── Disponibilidad (estilos + eventos) ──────────────────────
  const disponibilidadTags = document.querySelector(".pa-card .pa-tags[style]");
  if (disponibilidadTags) {
    const combinados = [...estilos, ...eventos];
    if (combinados.length > 0) {
      disponibilidadTags.innerHTML = combinados
        .map((tag) => `<span class="pa-tag pa-tag--dark">${tag}</span>`)
        .join("");
    } else {
      disponibilidadTags.innerHTML =
        '<span style="color:#aaa;font-size:13px;">Sin preferencias agregadas</span>';
    }
  }

  // ── Instrumentos (si hay, mostrarlos en barra al 100%) ──────
  const instrumentsGrid = document.querySelector(".pa-instruments-grid");
  if (instrumentsGrid && instrumentos.length > 0) {
    instrumentsGrid.innerHTML = instrumentos
      .map(
        (instr) => `
        <div class="pa-instrument">
          <div class="pa-instrument__header">
            <span class="pa-instrument__name">${instr}</span>
          </div>
          <div class="pa-progress">
            <div class="pa-progress__bar" style="width: 100%"></div>
          </div>
        </div>
      `,
      )
      .join("");
  } else if (instrumentsGrid) {
    instrumentsGrid.innerHTML =
      '<p style="color:#aaa;font-size:13px;">Sin instrumentos agregados</p>';
  }
}

// ── Cargar al iniciar ─────────────────────────────────────────
document.addEventListener("DOMContentLoaded", cargarPerfil);
