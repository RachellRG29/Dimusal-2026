// ═══════════════════════════════════════════════════════════════
//  DIMUSAL – perfil-editar.js
//  Modales de edición del perfil
// ═══════════════════════════════════════════════════════════════
// ── Variable global para traducción de biografía ──
let bioOriginal = "";
// ── Abrir modal de información ──────────────────────────────────
function abrirInfoModal() {
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
  if (!usuario.id) return;

  // Traer datos actuales del usuario
  fetch(`/api/usuario/${usuario.id}`)
    .then((res) => res.json())
    .then((data) => {
      if (!data.success) return;
      const u = data.usuario;

      document.getElementById("infoCorreo").value = u.correo || "";
      document.getElementById("infoTelefono").value = u.telefono || "";

      // Inicializar selects de ubicación si no se han llenado
      const selDepto = document.getElementById("departamento");
      if (selDepto.options.length <= 1) {
        initUbicacionSelects();
      }

      // Preseleccionar departamento, distrito y municipio
      selDepto.value = u.departamento || "";
      selDepto.dispatchEvent(new Event("change"));

      setTimeout(() => {
        const selDistrito = document.getElementById("distrito");
        if (u.distrito) {
          selDistrito.value = u.distrito;
          selDistrito.dispatchEvent(new Event("change"));
        }

        setTimeout(() => {
          const selMunicipio = document.getElementById("municipio");
          selMunicipio.value = u.municipio || "";
        }, 100);
      }, 100);
    });

  document.getElementById("infoModalBackdrop").classList.add("open");
}

function closeInfoModal(e) {
  if (e && e.target.id !== "infoModalBackdrop") return;
  document.getElementById("infoModalBackdrop").classList.remove("open");
}

// ── Guardar información ──────────────────────────────────────────
async function guardarInformacion() {
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
  if (!usuario.id) return;

  const correo = document.getElementById("infoCorreo").value.trim();
  const telefono = document.getElementById("infoTelefono").value.trim();
  const departamento = document.getElementById("departamento").value;
  const distrito = document.getElementById("distrito").value;
  const municipio = document.getElementById("municipio").value;

  if (!correo || !telefono || !departamento || !municipio) {
    Swal.fire({
      icon: "warning",
      title: "Campos incompletos",
      text: "Completa todos los campos obligatorios.",
      confirmButtonColor: "#f97316",
    });
    return;
  }

  try {
    const res = await fetch(`/api/usuario/${usuario.id}/informacion`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        telefono,
        correo,
        departamento,
        distrito,
        municipio,
      }),
    });
    const data = await res.json();

    if (data.success) {
      await Swal.fire({
        icon: "success",
        title: "¡Actualizado!",
        text: "Tu información fue guardada correctamente.",
        confirmButtonColor: "#f97316",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      closeInfoModal();
      cargarPerfil(); // recargar datos del perfil
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: data.mensaje,
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

// ── Abrir modal Sobre mí ────────────────────────────────────────
function abrirBioModal() {
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
  if (!usuario.id) return;

  fetch(`/api/usuario/${usuario.id}`)
    .then((res) => res.json())
    .then((data) => {
      if (!data.success) return;
      const bio = data.usuario.biografia || "";
      const textarea = document.getElementById("bioBiografia");
      textarea.value = bio;
      document.getElementById("bioCharCount").textContent = bio.length;
    });

  document.getElementById("bioModalBackdrop").classList.add("open");
}

function closeBioModal(e) {
  if (e && e.target.id !== "bioModalBackdrop") return;
  document.getElementById("bioModalBackdrop").classList.remove("open");
}

// Contador de caracteres
document.addEventListener("DOMContentLoaded", () => {
  const textarea = document.getElementById("bioBiografia");
  if (textarea) {
    textarea.addEventListener("input", () => {
      document.getElementById("bioCharCount").textContent =
        textarea.value.length;
    });
  }
});

// ── Guardar biografía ───────────────────────────────────────────
async function guardarBiografia() {
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
  if (!usuario.id) return;

  const biografia = document.getElementById("bioBiografia").value.trim();

  try {
    const res = await fetch(`/api/usuario/${usuario.id}/biografia`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ biografia }),
    });
    const data = await res.json();

    if (data.success) {
      await Swal.fire({
        icon: "success",
        title: "¡Actualizado!",
        text: "Tu biografía fue guardada correctamente.",
        confirmButtonColor: "#f97316",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      closeBioModal();
      cargarPerfil();
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: data.mensaje,
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

async function traducirBiografia(texto, idiomaDestino) {
  const bio1 = document.getElementById("bio-p1");
  const bio2 = document.getElementById("bio-p2");

  if (!texto) return;

  if (idiomaDestino === "es") {
    const parrafos = bioOriginal.split("\n").filter((p) => p.trim());
    if (bio1) bio1.textContent = parrafos[0] || "";
    if (bio2) bio2.textContent = parrafos[1] || "";
    return;
  }

  try {
    const res = await fetch("/api/traducir", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texto, idioma: idiomaDestino }),
    });
    const data = await res.json();
    const parrafos = data.traduccion.split("\n").filter((p) => p.trim());
    if (bio1) bio1.textContent = parrafos[0] || "";
    if (bio2) bio2.textContent = parrafos[1] || "";
  } catch (err) {
    console.error("Error al traducir:", err);
  }
}
