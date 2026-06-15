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

  // ── Biografía ────────────────────────────────────────────────
  const bio1 = document.getElementById("bio-p1");
  const bio2 = document.getElementById("bio-p2");

  if (bio1) {
    if (u.biografia) {
      const parrafos = u.biografia.split("\n").filter((p) => p.trim());
      bio1.textContent = parrafos[0] || "";
      if (bio2) bio2.textContent = parrafos[1] || "";

      // Guardar original y traducir si el idioma activo es inglés
      if (typeof bioOriginal !== "undefined") {
        bioOriginal = u.biografia;
        const idiomaActivo = localStorage.getItem("idioma") || "es";
        if (idiomaActivo === "en" && typeof traducirBiografia === "function") {
          traducirBiografia(u.biografia, "en");
        }
      }
    } else {
      bio1.textContent = "Aún no has agregado una biografía.";
      if (bio2) bio2.textContent = "";
    }
  }

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
    avatarImg.src = u.foto_logo
      ? u.foto_logo.startsWith("http")
        ? u.foto_logo
        : `/${u.foto_logo}`
      : "/images/homepage/piano-girl-inicio.png";
  }

  // ── Disponibilidad ───────────────────────────────────────────
  const disponibleEl = document.querySelector(".pa-disponible");
  if (disponibleEl) {
    const disponible = u.disponible !== false;
    disponibleEl.innerHTML = `
    <span class="pa-disponible__dot" style="background:${disponible ? "#22c55e" : "#ef4444"}"></span>
    ${disponible ? "Disponible para contratación" : "No disponible"}
  `;
  }
  const coverImg = document.getElementById("coverImg");
  if (coverImg && u.portada) {
    coverImg.src = u.portada
      ? u.portada.startsWith("http")
        ? u.portada
        : `/${u.portada}`
      : "/images/homepage/banner-piano.png";
  }

  // ── Información de contacto ─────────────────────────────────
  const infoItems = document.querySelectorAll(".pa-info-list .pa-info-item");
  if (infoItems.length >= 4) {
    infoItems[0].querySelector(".pa-info-item__main").textContent = u.municipio;
    infoItems[0].querySelector(".pa-info-item__sub").textContent =
      u.departamento;

    const fecha = new Date(u.created_at);
    const año = fecha.getFullYear();
    infoItems[1].querySelector(".pa-info-item__main").textContent = "";
    infoItems[1].querySelector(".pa-info-item__sub").textContent =
      `Activo desde ${año}`;

    infoItems[2].querySelector(".pa-info-item__main").textContent = u.correo;
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
  if (tabPortafolio && u.portafolio) {
    tabPortafolio.innerHTML = `
      <div class="pa-card">
        <h2 class="pa-card__title">Portafolio</h2>
        <p class="pa-card__text">
          <a href="${u.portafolio}" target="_blank" style="color:var(--orange);">${u.portafolio}</a>
        </p>
      </div>
    `;
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
  // ── Sincronizar estado global para tags-perfil.js ───────────
  if (typeof TagsState !== "undefined") {
    TagsState.profileTags = [...etiquetas];
  }

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
    tagsContainer.innerHTML =
      generos.length > 0
        ? generos
            .map((tag) => `<span class="pa-tag pa-tag--orange">${tag}</span>`)
            .join("")
        : '<span style="color:#aaa;font-size:13px;">Sin géneros agregados</span>';
  }

  // ── Disponibilidad (estilos + eventos) ──────────────────────
  const disponibilidadTags = document.querySelector(".pa-card .pa-tags[style]");
  if (disponibilidadTags) {
    const combinados = [...estilos, ...eventos];
    disponibilidadTags.innerHTML =
      combinados.length > 0
        ? combinados
            .map((tag) => `<span class="pa-tag pa-tag--orange">${tag}</span>`)
            .join("")
        : '<span style="color:#aaa;font-size:13px;">Sin preferencias agregadas</span>';
  }
  // ── Instrumentos ────────────────────────────────────────────
  const instrumentsGrid = document.querySelector(".pa-instruments-grid");
  if (instrumentsGrid) {
    if (instrumentos.length > 0) {
      const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
      fetch(`/api/usuario/${usuario.id}`)
        .then((r) => r.json())
        .then((d) => {
          let niveles = {};
          try {
            niveles = JSON.parse(d.usuario.instrumentos_niveles || "{}");
          } catch (e) {}

          const nivelAncho = {
            Básico: "30%",
            Intermedio: "55%",
            Avanzado: "85%",
          };

          instrumentsGrid.innerHTML = instrumentos
            .map((instr) => {
              const nivel = niveles[instr] || "";
              const ancho = nivelAncho[nivel] || "100%";
              return `
              <div class="pa-instrument">
                <div class="pa-instrument__header">
                  <span class="pa-instrument__name">${instr}</span>
                  ${nivel ? `<span class="pa-instrument__level">${nivel}</span>` : ""}
                </div>
                <div class="pa-progress">
                  <div class="pa-progress__bar" style="width: ${ancho}"></div>
                </div>
              </div>
            `;
            })
            .join("");
        });
    } else {
      instrumentsGrid.innerHTML =
        '<p style="color:#aaa;font-size:13px;">Sin instrumentos agregados</p>';
    }
  }
}

// ── Cargar al iniciar ─────────────────────────────────────────
document.addEventListener("DOMContentLoaded", cargarPerfil);
