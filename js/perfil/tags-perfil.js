/* ═══════════════════════════════════════════════════
   RF-01 – Sistema de Etiquetas Musicales
   tags-perfil.js — Perfil de artista
   Comparte la misma clave de localStorage que el dashboard
   para que las etiquetas sean consistentes entre páginas.
═══════════════════════════════════════════════════ */

const TagsState = {
  profileTags: [],
  STORAGE_KEY: "dimusal_profile_tags",
};

// ── Inicialización ───────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  loadProfileTags();
  renderProfileTagsBar();
  syncModalChips();
});

// ── Persistencia ─────────────────────────────────
function loadProfileTags() {
  try {
    const stored = localStorage.getItem(TagsState.STORAGE_KEY);
    if (stored) TagsState.profileTags = JSON.parse(stored);
  } catch (e) {
    TagsState.profileTags = [];
  }
}

function saveToStorage() {
  try {
    localStorage.setItem(
      TagsState.STORAGE_KEY,
      JSON.stringify(TagsState.profileTags),
    );
  } catch (e) {
    /* fallback silencioso */
  }
}

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
  renderCustomChipsInModal();
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
  const raw = input.value.trim();
  if (!raw) return;
  const tag = raw.charAt(0).toUpperCase() + raw.slice(1);
  if (TagsState.profileTags.includes(tag)) {
    showToast("Esa etiqueta ya fue agregada", "warn");
    input.value = "";
    return;
  }
  if (TagsState.profileTags.length >= 20) {
    showToast("Máximo 20 etiquetas por perfil");
    return;
  }
  TagsState.profileTags.push(tag);
  input.value = "";
  renderCustomChipsInModal();
  updateModalSummary();
}

function renderCustomChipsInModal() {
  const container = document.getElementById("group-custom");
  const predefined = Array.from(
    document.querySelectorAll(
      '.tag-chip[data-group]:not([data-group="custom"])',
    ),
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

// ── Resumen del modal ────────────────────────────
function updateModalSummary() {
  document.getElementById("tagCount").textContent =
    TagsState.profileTags.length;
  document.getElementById("tagsSummaryChips").innerHTML = TagsState.profileTags
    .map((t) => `<span class="summary-chip">${t}</span>`)
    .join("");
}

// ── Guardar ──────────────────────────────────────
function saveProfileTags() {
  saveToStorage();
  _doCloseModal();
  renderProfileTagsBar();
  showToast("Etiquetas guardadas correctamente ✓");
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

// ── Toast ────────────────────────────────────────
function showToast(message) {
  const existing = document.querySelector(".tags-toast");
  if (existing) existing.remove();
  const toast = document.createElement("div");
  toast.className = "tags-toast";
  toast.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
    ${message}`;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.classList.add("out");
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}
