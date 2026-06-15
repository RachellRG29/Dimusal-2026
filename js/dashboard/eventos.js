let EVENTOS = [];

/* ── Inicializar página de eventos ── */
function initEventosPage() {
  const grid = document.getElementById("elGrid");
  if (!grid) return;

  cargarEventos();
}

/* ── Cargar eventos desde BD ── */
async function cargarEventos() {
  try {
    const res = await fetch("/api/eventos");
    const data = await res.json();

    if (!data.success || data.eventos.length === 0) {
      document.getElementById("elGrid").innerHTML =
        '<p style="color:#aaa;padding:2rem;grid-column:1/-1;">No hay eventos publicados aún.</p>';
      const badge = document.querySelector(".el-count-badge");
      if (badge) badge.textContent = "0 eventos";
      return;
    }

    EVENTOS = data.eventos;
    const badge = document.querySelector(".el-count-badge");
    if (badge)
      badge.textContent = `${EVENTOS.length} evento${EVENTOS.length !== 1 ? "s" : ""}`;

    renderEventos(EVENTOS);
  } catch (err) {
    console.error(err);
  }
}

/* ── Renderizar cards ── */
function renderEventos(eventos) {
  const grid = document.getElementById("elGrid");
  const emojiTipo = {
    Festival: "🎪",
    Tocata: "🔊",
    Concierto: "🎤",
    Corporativo: "🏢",
    Cultural: "🎭",
    Otro: "🎵",
  };

  grid.innerHTML = eventos
    .map((e, idx) => {
      const emoji = emojiTipo[e.tipo_evento] || "🎵";
      const fechaSolo = e.fecha_inicio ? e.fecha_inicio.split("T")[0] : null;
      const fecha = fechaSolo
        ? new Date(fechaSolo + "T12:00:00").toLocaleDateString("es-SV", {
            weekday: "short",
            day: "numeric",
            month: "short",
          })
        : "—";
      const hora = e.hora ? e.hora.slice(0, 5) : "";
      const fechaStr = hora ? `${fecha} · ${hora}` : fecha;
      const lugar = [e.lugar, e.departamento].filter(Boolean).join(", ");
      const generos = e.generos ? JSON.parse(e.generos) : [];
      const img =
        e.imagen_url ||
        "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=900&q=80";
      const featured = idx === 0 ? "el-card--featured" : "";

      return `
      <div class="el-card ${featured}" data-tipo="${e.tipo_evento || ""}" onclick="abrirEvento(${idx})">
        <div class="el-card__img">
          <div class="el-card__img-inner" style="background-image: url('${img}')"></div>
          <div class="el-card__img-overlay"></div>
          <span class="el-card__tipo">${emoji} ${e.tipo_evento || "Evento"}</span>
          ${e.abre_convocatoria ? '<span class="el-card__conv">✦ Conv. abierta</span>' : ""}
        </div>
        <div class="el-card__body">
          <div class="el-card__date">${fechaStr}</div>
          <div class="el-card__title">${e.nombre}</div>
          <div class="el-card__meta">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            ${lugar || "—"}
          </div>
          <div class="el-card__tags">
            ${generos
              .slice(0, 3)
              .map((t) => `<span class="el-tag">${t}</span>`)
              .join("")}
          </div>
          <div class="el-card__footer">
            <div class="el-card__price">${e.precio || "—"}</div>
            <button class="el-card__btn" onclick="event.stopPropagation(); abrirEvento(${idx})">
              Ver evento →
            </button>
          </div>
        </div>
      </div>
    `;
    })
    .join("");
}

/* ── Filtrar tarjetas ── */
function filterEvents(btn) {
  document
    .querySelectorAll(".el-tab")
    .forEach((t) => t.classList.remove("active"));
  btn.classList.add("active");
  const f = btn.dataset.filter;
  document.querySelectorAll(".el-card").forEach((card) => {
    const show = f === "all" || card.dataset.tipo === f;
    card.style.display = show ? "" : "none";
  });
}

/* ── Abrir detalle ── */
function abrirEvento(idx) {
  const e = EVENTOS[idx];
  const emojiTipo = {
    Festival: "🎪",
    Tocata: "🔊",
    Concierto: "🎤",
    Corporativo: "🏢",
    Cultural: "🎭",
    Otro: "🎵",
  };
  const emoji = emojiTipo[e.tipo_evento] || "🎵";
  const generos = e.generos ? JSON.parse(e.generos) : [];
  const requisitos = e.requisitos ? JSON.parse(e.requisitos) : [];
  const img =
    e.imagen_url ||
    "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1400&q=80";

  const fechaSolo = e.fecha_inicio ? e.fecha_inicio.split("T")[0] : null;
  const fechaLarga = fechaSolo
    ? new Date(fechaSolo + "T12:00:00").toLocaleDateString("es-SV", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";
  const hora = e.hora ? e.hora.slice(0, 5) : "—";
  const lugar = [e.lugar, e.departamento].filter(Boolean).join(", ");
  const promotorNombre = e.nombre_artistico || e.nombre_completo || "Promotor";
  const promotorIniciales = promotorNombre
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  document.getElementById("evHeroImg").style.backgroundImage = `url('${img}')`;
  document.getElementById("detTitulo").textContent = e.nombre;
  document.getElementById("detFecha").textContent = `${fechaLarga} · ${hora}`;
  document.getElementById("detLugar").textContent = lugar;
  document.getElementById("detBadgeTipo").textContent =
    `${emoji} ${e.tipo_evento || "Evento"}`;
  document.getElementById("detBadgeConv").style.display = e.abre_convocatoria
    ? ""
    : "none";

  document.getElementById("detDesc").innerHTML = (e.descripcion || "").replace(
    /\n\n/g,
    "<br><br>",
  );
  document.getElementById("detInfoFecha").textContent = fechaLarga;
  document.getElementById("detInfoHora").textContent = hora;
  document.getElementById("detInfoLugar").textContent = e.lugar || "—";
  document.getElementById("detInfoDepto").textContent = e.departamento || "—";
  document.getElementById("detInfoCap").textContent = e.capacidad
    ? `${e.capacidad} personas`
    : "—";
  document.getElementById("detInfoPrecio").textContent = e.precio || "—";

  document.getElementById("detTags").innerHTML =
    generos.map((t) => `<span class="ev-tag">${t}</span>`).join("") ||
    '<span style="color:#aaa;font-size:13px;">Sin géneros especificados</span>';

  document.getElementById("detConvSection").style.display = e.abre_convocatoria
    ? ""
    : "none";

  if (e.abre_convocatoria && requisitos.length > 0) {
    document.querySelector(".ev-requisitos").innerHTML = requisitos
      .map(
        (r) => `
      <div class="ev-req-item">
        <div class="ev-req-check">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"
            stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        ${r}
      </div>
    `,
      )
      .join("");
  }

  document
    .querySelectorAll(".ev-promotor-avatar, .ev-promotor-ava")
    .forEach((el) => (el.textContent = promotorIniciales));
  document
    .querySelectorAll(".ev-promotor-name, .ev-promotor-info-name")
    .forEach((el) => (el.textContent = promotorNombre));

  document.getElementById("detSidebarPrecio").textContent = e.precio || "—";
  document.getElementById("detMapLabel").textContent = e.lugar || "—";
  document.getElementById("detMapNombre").textContent = e.lugar || "—";
  document.getElementById("detMapDir").textContent = e.direccion || "—";
  document.getElementById("btnPostular").style.display = e.abre_convocatoria
    ? ""
    : "none";

  setView(document.querySelector(".ev-view-btn"), "publico");

  document.getElementById("vistaLista").style.display = "none";
  document.getElementById("vistaDetalle").style.display = "block";
  window.scrollTo({ top: 0, behavior: "smooth" });

  setTimeout(() => {
    document.getElementById("capFill").style.width = "62%";
  }, 500);
}

/* ── Volver a lista ── */
function volverLista() {
  document.getElementById("vistaDetalle").style.display = "none";
  document.getElementById("vistaLista").style.display = "block";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ── Vista dual ── */
function setView(btn, view) {
  document
    .querySelectorAll(".ev-view-btn")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  document.getElementById("vpPublico").style.display =
    view === "publico" ? "block" : "none";
  document.getElementById("vpPromotor").style.display =
    view === "promotor" ? "block" : "none";
  if (view === "promotor")
    setTimeout(() => {
      document.getElementById("capFillP").style.width = "62%";
    }, 100);
}

/* ── Tabs promotor ── */
function setDetTab(btn, id) {
  document
    .querySelectorAll(".ev-tab-btn")
    .forEach((t) => t.classList.remove("active"));
  btn.classList.add("active");
  ["dtStats", "dtPostulaciones", "dtConfig"].forEach((t) => {
    document.getElementById(t).style.display = t === id ? "block" : "none";
  });
  if (id === "dtStats")
    setTimeout(() => {
      document.getElementById("capFillP").style.width = "62%";
    }, 100);
}

/* ── Guardar ── */
function toggleGuardar(btn) {
  const icon = document.getElementById("saveIcon");
  const lbl = document.getElementById("saveLabel");
  const saved = lbl.textContent === "Guardado";
  icon.setAttribute("fill", saved ? "none" : "currentColor");
  lbl.textContent = saved ? "Guardar" : "Guardado";
  btn.style.borderColor = saved ? "" : "var(--orange)";
  btn.style.color = saved ? "" : "var(--orange)";
  showEvToast(saved ? "💔 Eliminado de guardados" : "❤️ Evento guardado");
}

/* ── Toast (renombrado para no chocar con otros showToast) ── */
let evToastTimer;
function showEvToast(msg) {
  const t = document.getElementById("evToast");
  if (!t) return;
  document.getElementById("evToastMsg").textContent = msg;
  t.classList.add("show");
  clearTimeout(evToastTimer);
  evToastTimer = setTimeout(() => t.classList.remove("show"), 2200);
}

/* ── Parallax ── */
window.addEventListener(
  "scroll",
  () => {
    const detalle = document.getElementById("vistaDetalle");
    if (detalle && detalle.style.display !== "none") {
      const img = document.getElementById("evHeroImg");
      if (img)
        img.style.transform = `scale(1.12) translateY(${window.scrollY * 0.15}px)`;
    }
  },
  { passive: true },
);
