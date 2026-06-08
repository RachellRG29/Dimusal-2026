/* ═══════════════════════════════════════════════════
   RF-01 – Sistema de Etiquetas Musicales
   tags-register.js — Selector inline en el paso 2
   Guarda en la misma clave localStorage que perfil/dashboard
   para que las etiquetas queden disponibles al entrar al perfil.
═══════════════════════════════════════════════════ */

const RegTags = {
  selected: [],
  STORAGE_KEY: "dimusal_profile_tags",
};

// ── Toggle chip ──────────────────────────────────
function regToggleTag(chipEl) {
  const tag = chipEl.dataset.tag;
  const idx = RegTags.selected.indexOf(tag);
  if (idx === -1) {
    if (RegTags.selected.length >= 20) {
      alert("Máximo 20 etiquetas por perfil");
      return;
    }
    RegTags.selected.push(tag);
    chipEl.classList.add("selected");
  } else {
    RegTags.selected.splice(idx, 1);
    chipEl.classList.remove("selected");
  }
  regUpdateSummary();
}

// ── Etiqueta personalizada ───────────────────────
function regHandleCustomKey(e) {
  if (e.key === "Enter") {
    e.preventDefault();
    regAddCustomTag();
  }
}

function regAddCustomTag() {
  const input = document.getElementById("regCustomTagInput");
  const raw = input.value.trim();
  if (!raw) return;
  const tag = raw.charAt(0).toUpperCase() + raw.slice(1);
  if (RegTags.selected.includes(tag)) {
    input.value = "";
    return;
  }
  if (RegTags.selected.length >= 20) {
    alert("Máximo 20 etiquetas");
    return;
  }

  RegTags.selected.push(tag);
  input.value = "";
  regRenderCustomChips();
  regUpdateSummary();
}

function regRenderCustomChips() {
  const container = document.getElementById("reg-group-custom");
  // etiquetas que no están en chips predefinidos
  const predefined = Array.from(
    document.querySelectorAll(".reg-tag-chip[data-tag]"),
  ).map((c) => c.dataset.tag.trim());

  const customTags = RegTags.selected.filter((t) => !predefined.includes(t));
  container.innerHTML = "";
  customTags.forEach((tag) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "reg-tag-chip custom-chip selected";
    btn.innerHTML = `${tag}<button type="button" class="reg-remove-custom" onclick="regRemoveCustom('${tag}',event)">×</button>`;
    container.appendChild(btn);
  });
}

function regRemoveCustom(tag, e) {
  e.stopPropagation();
  const idx = RegTags.selected.indexOf(tag);
  if (idx !== -1) RegTags.selected.splice(idx, 1);
  regRenderCustomChips();
  regUpdateSummary();
}

// ── Resumen visual ───────────────────────────────
function regUpdateSummary() {
  const summary = document.getElementById("regTagsSummary");
  const countEl = document.getElementById("regTagCount");
  const chipsEl = document.getElementById("regTagsSummaryChips");

  if (RegTags.selected.length === 0) {
    summary.style.display = "none";
    return;
  }
  summary.style.display = "block";
  countEl.textContent = RegTags.selected.length;
  chipsEl.innerHTML = RegTags.selected
    .map((t) => `<span class="reg-summary-chip">${t}</span>`)
    .join("");
}

// ── Guardar al hacer Registrarme ────────────────
// Llama a esta función desde tu register.js antes de enviar.
// También se puede llamar directamente si el botón "Registrarme"
// tiene acceso a este archivo.
function regSaveTags() {
  try {
    localStorage.setItem(RegTags.STORAGE_KEY, JSON.stringify(RegTags.selected));
  } catch (e) {
    /* fallback silencioso */
  }
}

// Hook automático: guarda cuando se hace clic en "Registrarme"
document.addEventListener("DOMContentLoaded", () => {
  // Busca el botón de registrar y adjunta el guardado de tags
  const btnRegistrar = document.querySelector(
    '.btn-register[data-es="Registrarme"]',
  );
  if (btnRegistrar) {
    btnRegistrar.addEventListener("click", () => regSaveTags());
  }
});
