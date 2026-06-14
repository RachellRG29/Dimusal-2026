/* ═══════════════════════════════════════════════════
   RF-01 – Sistema de Etiquetas Musicales
   tags-perfil.js — Perfil de artista
   Conectado a la BD vía /api/usuario/:id/etiquetas
═══════════════════════════════════════════════════ */

const TagsState = {
  profileTags: [],
};

// ── Modal: abrir / cerrar ────────────────────────
function openTagsModal() {
  document.getElementById("tagsModalBackdrop").classList.add("open");
  document.body.style.overflow = "hidden";
  syncModalChips();
  updateModalSummary();
}

function closeTagsModal(event) {
  if (event && event.target !== document.getElementById("tagsModalBackdrop"))
    return;
  _doCloseModal();
}

function _doCloseModal() {
  document.getElementById("tagsModalBackdrop").classList.remove("open");
  document.body.style.overflow = "";
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") _doCloseModal();
});

// ── Toggle chip predefinido ──────────────────────
function toggleTag(chipEl) {
  const tag = chipEl.dataset.tag;
  const idx = TagsState.profileTags.indexOf(tag);
  if (idx === -1) {
    TagsState.profileTags.push(tag);
    chipEl.classList.add("selected");
  } else {
    TagsState.profileTags.splice(idx, 1);
    chipEl.classList.remove("selected");
  }
  updateModalSummary();
}

function syncModalChips() {
  document.querySelectorAll(".tag-chip[data-tag]").forEach((chip) => {
    chip.classList.toggle(
      "selected",
      TagsState.profileTags.includes(chip.dataset.tag),
    );
  });
}

// ── Resumen del modal ────────────────────────────
function updateModalSummary() {
  const countEl = document.getElementById("tagCount");
  const summaryEl = document.getElementById("tagsSummaryChips");
  if (countEl) countEl.textContent = TagsState.profileTags.length;
  if (summaryEl)
    summaryEl.innerHTML = TagsState.profileTags
      .map((t) => `<span class="summary-chip">${t}</span>`)
      .join("");
}

// ── Etiquetas personalizadas ─────────────────────
function handleCustomTagKey(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    addCustomTag();
  }
}

function addCustomTag() {
  const input = document.getElementById("customTagInput");
  if (!input) return;
  const raw = input.value.trim();
  if (!raw) return;
  const tag = raw.charAt(0).toUpperCase() + raw.slice(1);

  if (TagsState.profileTags.includes(tag)) {
    Swal.fire({
      icon: "warning",
      text: "Esa etiqueta ya fue agregada",
      toast: true,
      position: "bottom-end",
      showConfirmButton: false,
      timer: 2000,
    });
    input.value = "";
    return;
  }

  if (TagsState.profileTags.length >= 20) {
    Swal.fire({
      icon: "warning",
      text: "Máximo 20 etiquetas por perfil",
      toast: true,
      position: "bottom-end",
      showConfirmButton: false,
      timer: 2000,
    });
    return;
  }

  TagsState.profileTags.push(tag);
  input.value = "";
  renderCustomChipsInModal();
  updateModalSummary();
}

function renderCustomChipsInModal() {
  const container = document.getElementById("group-custom");
  if (!container) return;

  const predefined = Array.from(
    document.querySelectorAll('.tag-chip[data-tag]:not([data-group="custom"])'),
  ).map((c) => c.dataset.tag);

  const customTags = TagsState.profileTags.filter(
    (t) => !predefined.includes(t),
  );

  container.innerHTML = "";
  customTags.forEach((tag) => {
    const btn = document.createElement("button");
    btn.className = "tag-chip custom selected";
    btn.innerHTML = `${tag}<button class="remove-custom" onclick="removeCustomTag('${tag}', event)" aria-label="Quitar ${tag}">×</button>`;
    container.appendChild(btn);
  });
}

function removeCustomTag(tag, event) {
  event.stopPropagation();
  const idx = TagsState.profileTags.indexOf(tag);
  if (idx !== -1) TagsState.profileTags.splice(idx, 1);
  renderCustomChipsInModal();
  updateModalSummary();
}

// ── Guardar en BD ────────────────────────────────
async function saveProfileTags() {
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
  if (!usuario.id) return;

  try {
    const res = await fetch(`/api/usuario/${usuario.id}/etiquetas`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ etiquetas: TagsState.profileTags }),
    });
    const data = await res.json();

    if (data.success) {
      _doCloseModal();
      cargarPerfil();
      Swal.fire({
        icon: "success",
        title: "¡Actualizado!",
        text: "Etiquetas guardadas correctamente.",
        toast: true,
        position: "bottom-end",
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron guardar las etiquetas.",
        confirmButtonColor: "#f97316",
      });
    }
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Sin conexión",
      text: "No se pudo conectar con el servidor.",
      confirmButtonColor: "#f97316",
    });
  }
}

// ── Barra de etiquetas del perfil ────────────────
function renderProfileTagsBar() {
  const display = document.getElementById("profileTagsDisplay");
  if (!display) return;

  if (TagsState.profileTags.length === 0) {
    display.innerHTML = `<span class="profile-tags-empty">Sin etiquetas — <button class="link-tags-btn" onclick="openTagsModal()">agregar ahora</button></span>`;
    return;
  }

  const max = 8;
  const visible = TagsState.profileTags.slice(0, max);
  const extra = TagsState.profileTags.length - max;

  display.innerHTML =
    visible.map((t) => `<span class="profile-tag-pill">${t}</span>`).join("") +
    (extra > 0
      ? `<span class="profile-tag-pill" style="background:#f5f3f0;color:#888;border-color:#e0ddd8">+${extra} más</span>`
      : "");
}
