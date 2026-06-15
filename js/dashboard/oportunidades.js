let currentCategory = "all";
let currentTag = "all";
let OPORTUNIDADES = [];

function initOppPage() {
  const STORAGE_KEY = "dimusal_profile_tags";
  let userTags = [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) userTags = JSON.parse(stored);
  } catch (err) {
    console.error(err);
  }

  const chipsContainer = document.getElementById("oppTagFilterChips");
  if (!chipsContainer) return;

  const defaultTags = [
    "Rock",
    "Jazz",
    "Clásica",
    "Indie",
    "Alternativo",
    "Popular",
  ];
  const tags = userTags.length > 0 ? userTags : defaultTags;

  chipsContainer.innerHTML =
    `<button class="filter-tag-chip active" data-filter="all" onclick="filterByTag(this,'all')">Todos</button>` +
    tags
      .map(
        (tag) =>
          `<button class="filter-tag-chip" data-filter="${tag}" onclick="filterByTag(this,'${tag}')">${tag}</button>`,
      )
      .join("");

  cargarOportunidades().then(() => applyFilters());
}

// ── Cargar desde BD ──────────────────────────────────────────
async function cargarOportunidades() {
  const list = document.getElementById("oppList");
  if (!list) return;
  try {
    const res = await fetch("/api/oportunidades");
    const data = await res.json();
    if (!data.success || data.oportunidades.length === 0) {
      list.innerHTML = "";
      const empty = document.getElementById("oppEmpty");
      if (empty) {
        empty.style.display = "flex";
        empty.querySelector("p").textContent =
          "No hay oportunidades publicadas aún.";
      }
      updateOppCount(0);
      return;
    }
    OPORTUNIDADES = data.oportunidades;
    renderOportunidades(OPORTUNIDADES);
  } catch (err) {
    console.error(err);
  }
}

// ── Renderizar cards ─────────────────────────────────────────
function renderOportunidades(oportunidades) {
  const list = document.getElementById("oppList");
  const colorPorTipo = {
    Festival: "var(--orange)",
    Convocatoria: "#7c9ef5",
    Tocata: "#f5a623",
    Grabación: "#22c55e",
    Colaboración: "#a855f7",
    Difusión: "#0ea5e9",
    Taller: "#a855f7",
    Residencia: "#0ea5e9",
    Audición: "#ef4444",
  };

  list.innerHTML = oportunidades
    .map((o, idx) => {
      const categoria = o.tipo_evento || "Convocatoria";
      const color = colorPorTipo[categoria] || "var(--orange)";
      let generos = [];
      try {
        generos = o.generos ? JSON.parse(o.generos) : [];
      } catch (e) {}
      const tagsData = [categoria, ...generos].join(",");
      const lugar = [o.lugar, o.departamento].filter(Boolean).join(", ");
      const fechaCierre = o.fecha_postulacion
        ? new Date(
            o.fecha_postulacion.split("T")[0] + "T12:00:00",
          ).toLocaleDateString("es-SV", { day: "numeric", month: "short" })
        : null;

      return `
      <div class="opp-card" data-category="${categoria}" data-tags="${tagsData}"
           onclick="abrirOportunidad(${idx})" style="cursor:pointer">
        <div class="opp-card__type-dot" style="background:${color}"></div>
        <div class="opp-left">
          <div class="opp-title">${o.nombre}</div>
          <div class="opp-meta">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            ${lugar || "—"}
            ${fechaCierre ? `<span class="opp-deadline">Cierra: ${fechaCierre}</span>` : ""}
          </div>
          <div class="opp-tags">
            <span class="tag orange">${categoria}</span>
            ${generos.map((g) => `<span class="tag" style="background:#f0f0f0">${g}</span>`).join("")}
          </div>
        </div>
        <div class="opp-right">
          <button class="btn-primary" style="padding:8px 18px;font-size:0.78rem"
            onclick="event.stopPropagation();abrirOportunidad(${idx})">
            Ver más →
          </button>
        </div>
      </div>`;
    })
    .join("");
}

// ── Abrir detalle ────────────────────────────────────────────
function abrirOportunidad(idx) {
  const o = OPORTUNIDADES[idx];
  const colorPorTipo = {
    Festival: "var(--orange)",
    Convocatoria: "#7c9ef5",
    Tocata: "#f5a623",
    Grabación: "#22c55e",
    Colaboración: "#a855f7",
    Difusión: "#0ea5e9",
    Taller: "#a855f7",
    Residencia: "#0ea5e9",
    Audición: "#ef4444",
  };

  const categoria = o.tipo_evento || "Convocatoria";
  let generos = [],
    requisitos = [];
  try {
    generos = o.generos ? JSON.parse(o.generos) : [];
  } catch (e) {}
  try {
    requisitos = o.requisitos ? JSON.parse(o.requisitos) : [];
  } catch (e) {}

  const img =
    o.imagen_url ||
    "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1400&q=80";

  const fechaCierre = o.fecha_postulacion
    ? new Date(
        o.fecha_postulacion.split("T")[0] + "T12:00:00",
      ).toLocaleDateString("es-SV", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

  const fechaEvento = o.fecha_inicio
    ? new Date(o.fecha_inicio.split("T")[0] + "T12:00:00").toLocaleDateString(
        "es-SV",
        { weekday: "long", day: "numeric", month: "long", year: "numeric" },
      )
    : "—";

  const lugar = [o.lugar, o.departamento].filter(Boolean).join(", ");
  const promotorNombre = o.nombre_artistico || o.nombre_completo || "Promotor";
  const promotorIniciales = promotorNombre
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // Hero
  document.getElementById("oppHeroImg").style.backgroundImage = `url('${img}')`;
  document.getElementById("oppDetTitulo").textContent = o.nombre;
  document.getElementById("oppDetFecha").textContent = fechaEvento;
  document.getElementById("oppDetLugar").textContent = lugar || "—";

  const badgeTipo = document.getElementById("oppDetBadgeTipo");
  badgeTipo.textContent = categoria;
  badgeTipo.style.background = colorPorTipo[categoria] || "var(--orange)";
  document.getElementById("oppDetBadgeConv").style.display = o.abre_convocatoria
    ? ""
    : "none";

  // Descripción
  document.getElementById("oppDetDesc").innerHTML = (o.descripcion || "")
    .replace(/\n\n/g, "<br><br>")
    .replace(/\n/g, "<br>");

  // Tags
  document.getElementById("oppDetTags").innerHTML =
    generos.map((t) => `<span class="opp-det-tag">${t}</span>`).join("") ||
    '<span style="color:#aaa;font-size:13px;">Sin géneros especificados</span>';

  // Requisitos
  const convSection = document.getElementById("oppDetConvSection");
  convSection.style.display = o.abre_convocatoria ? "" : "none";
  if (o.abre_convocatoria) {
    document.getElementById("oppDetRequisitos").innerHTML =
      requisitos.length > 0
        ? requisitos
            .map(
              (r) => `
          <div class="opp-req-item">
            <div class="opp-req-check">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"
                stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            ${r}
          </div>`,
            )
            .join("")
        : '<p style="color:#aaa;font-size:13px;">Sin requisitos especificados</p>';

    const notasSection = document.getElementById("oppDetNotasSection");
    if (o.notas_artistas) {
      notasSection.style.display = "";
      document.getElementById("oppDetNotas").textContent = o.notas_artistas;
    } else {
      notasSection.style.display = "none";
    }
  }

  // Promotor
  document.getElementById("oppDetPromoAva").textContent = promotorIniciales;
  document.getElementById("oppDetPromoNombre").textContent = promotorNombre;

  // Sidebar
  document.getElementById("oppDetCachet").textContent = o.cachet || "—";
  document.getElementById("oppDetFechaPostulacion").textContent = fechaCierre;
  document.getElementById("oppDetModalidad").textContent = o.modalidad || "—";
  document.getElementById("oppDetNumArtistas").textContent = o.num_artistas
    ? `${o.num_artistas} artista(s)`
    : "—";
  document.getElementById("oppBtnPostular").style.display = o.abre_convocatoria
    ? ""
    : "none";

  // Mapa
  document.getElementById("oppDetMapNombre").textContent = o.lugar || "—";
  document.getElementById("oppDetMapDir").textContent =
    o.direccion || o.municipio || "—";

  // Cambiar vistas
  document.getElementById("oppVistaLista").style.display = "none";
  document.getElementById("oppHeader").style.display = "none";
  document.getElementById("oppVistaDetalle").style.display = "block";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ── Volver a lista ───────────────────────────────────────────
function oppVolverLista() {
  document.getElementById("oppVistaDetalle").style.display = "none";
  document.getElementById("oppVistaLista").style.display = "block";
  document.getElementById("oppHeader").style.display = "";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ── Filtros ──────────────────────────────────────────────────
function filterByTag(btn, tag) {
  document
    .querySelectorAll("#oppTagFilterChips .filter-tag-chip")
    .forEach((chip) => chip.classList.remove("active"));
  btn.classList.add("active");
  currentTag = tag;
  applyFilters();
}

function filterOpps() {
  const activeTab = document.querySelector("#filterTabs .tab.active");
  currentCategory = activeTab ? activeTab.dataset.category : "all";
  applyFilters();
}

function applyFilters() {
  const cards = document.querySelectorAll("#oppList .opp-card");
  let visible = 0;
  cards.forEach((card) => {
    const category = card.dataset.category || "";
    const tags = (card.dataset.tags || "").split(",").map((t) => t.trim());
    const matchCat = currentCategory === "all" || category === currentCategory;
    const matchTag = currentTag === "all" || tags.includes(currentTag);
    const show = matchCat && matchTag;
    card.style.display = show ? "" : "none";
    if (show) visible++;
  });
  const empty = document.getElementById("oppEmpty");
  if (empty) empty.style.display = visible === 0 ? "flex" : "none";
  updateOppCount(visible);
}

function updateOppCount(count) {
  const badge = document.getElementById("oppCountBadge");
  if (!badge) return;
  const total =
    count !== undefined
      ? count
      : document.querySelectorAll("#oppList .opp-card").length;
  badge.textContent = `${total} disponibles`;
}

function resetFiltros() {
  currentCategory = "all";
  currentTag = "all";
  document
    .querySelectorAll("#filterTabs .tab")
    .forEach((t) => t.classList.remove("active"));
  document
    .querySelector('#filterTabs .tab[data-category="all"]')
    ?.classList.add("active");
  document
    .querySelectorAll("#oppTagFilterChips .filter-tag-chip")
    .forEach((c) => c.classList.remove("active"));
  document
    .querySelector('#oppTagFilterChips [data-filter="all"]')
    ?.classList.add("active");
  applyFilters();
}
