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

  fetch(`/api/usuario/${usuario.id}`)
    .then((res) => res.json())
    .then((data) => {
      if (!data.success) return;
      const u = data.usuario;

      document.getElementById("infoCorreo").value = u.correo || "";
      document.getElementById("infoTelefono").value = u.telefono || "";

      const selDepto = document.getElementById("departamento");
      if (selDepto.options.length <= 1) initUbicacionSelects();

      selDepto.value = u.departamento || "";
      selDepto.dispatchEvent(new Event("change"));

      setTimeout(() => {
        const selDistrito = document.getElementById("distrito");
        if (u.distrito) {
          selDistrito.value = u.distrito;
          selDistrito.dispatchEvent(new Event("change"));
        }
        setTimeout(() => {
          document.getElementById("municipio").value = u.municipio || "";
        }, 100);
      }, 100);
    });

  document.getElementById("infoModalBackdrop").classList.add("open");
}

function closeInfoModal(e) {
  if (e && e.target.id !== "infoModalBackdrop") return;
  document.getElementById("infoModalBackdrop").classList.remove("open");
}

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
      closeInfoModal();
      cargarPerfil();
      Swal.fire({
        icon: "success",
        title: "¡Actualizado!",
        text: "Tu información fue guardada correctamente.",
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
      closeBioModal();
      cargarPerfil();
      Swal.fire({
        icon: "success",
        title: "¡Actualizado!",
        text: "Tu biografía fue guardada correctamente.",
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

// ── Modal Instrumentos ──────────────────────────────────────────
function abrirInstrModal() {
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
  if (!usuario.id) return;

  fetch(`/api/usuario/${usuario.id}`)
    .then((res) => res.json())
    .then((data) => {
      if (!data.success) return;
      const u = data.usuario;

      let etiquetas = [];
      try {
        etiquetas = JSON.parse(u.etiquetas || "[]");
      } catch (e) {}

      let niveles = {};
      try {
        niveles = JSON.parse(u.instrumentos_niveles || "{}");
      } catch (e) {}

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

      const instrumentos = etiquetas.filter((t) =>
        TAGS_INSTRUMENTOS.includes(t),
      );
      const body = document.getElementById("instrModalBody");

      if (instrumentos.length === 0) {
        body.innerHTML = `<p style="color:#aaa;font-size:13px;">
          No tienes instrumentos en tus etiquetas.
          Agrégalos desde "Editar etiquetas" primero.
        </p>`;
      } else {
        body.innerHTML = instrumentos
          .map(
            (instr) => `
          <div class="reg-field">
            <label>${instr}</label>
            <div class="reg-select-wrap">
              <select id="nivel-${instr.replace(/\s|\//g, "_")}">
                <option value="">Sin nivel</option>
                <option value="Básico"     ${niveles[instr] === "Básico" ? "selected" : ""}>Básico</option>
                <option value="Intermedio" ${niveles[instr] === "Intermedio" ? "selected" : ""}>Intermedio</option>
                <option value="Avanzado"   ${niveles[instr] === "Avanzado" ? "selected" : ""}>Avanzado</option>
              </select>
            </div>
          </div>
        `,
          )
          .join("");
      }
    });

  document.getElementById("instrModalBackdrop").classList.add("open");
}

function closeInstrModal(e) {
  if (e && e.target.id !== "instrModalBackdrop") return;
  document.getElementById("instrModalBackdrop").classList.remove("open");
}

async function guardarNivelesInstrumentos() {
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
  if (!usuario.id) return;

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

  const niveles = {};
  TAGS_INSTRUMENTOS.forEach((instr) => {
    const sel = document.getElementById(
      `nivel-${instr.replace(/\s|\//g, "_")}`,
    );
    if (sel && sel.value) niveles[instr] = sel.value;
  });

  try {
    const res = await fetch(`/api/usuario/${usuario.id}/instrumentos-niveles`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ instrumentos_niveles: niveles }),
    });
    const data = await res.json();

    if (data.success) {
      closeInstrModal();
      cargarPerfil();
      Swal.fire({
        icon: "success",
        title: "¡Actualizado!",
        text: "Niveles guardados correctamente.",
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

// ── Modal Redes Sociales ────────────────────────────────────────
function abrirRedesModal() {
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
  if (!usuario.id) return;

  fetch(`/api/usuario/${usuario.id}`)
    .then((res) => res.json())
    .then((data) => {
      if (!data.success) return;
      const u = data.usuario;
      document.getElementById("redesSpotify").value = u.spotify || "";
      document.getElementById("redesInstagram").value = u.instagram || "";
      document.getElementById("redesYoutube").value = u.youtube || "";
      document.getElementById("redesTiktok").value = u.tiktok || "";
    });

  document.getElementById("redesModalBackdrop").classList.add("open");
}

function closeRedesModal(e) {
  if (e && e.target.id !== "redesModalBackdrop") return;
  document.getElementById("redesModalBackdrop").classList.remove("open");
}

async function guardarRedes() {
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
  if (!usuario.id) return;

  const spotify = document.getElementById("redesSpotify").value.trim();
  const instagram = document.getElementById("redesInstagram").value.trim();
  const youtube = document.getElementById("redesYoutube").value.trim();
  const tiktok = document.getElementById("redesTiktok").value.trim();

  try {
    const res = await fetch(`/api/usuario/${usuario.id}/redes`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ spotify, instagram, youtube, tiktok }),
    });
    const data = await res.json();

    if (data.success) {
      closeRedesModal();
      cargarPerfil();
      Swal.fire({
        icon: "success",
        title: "¡Actualizado!",
        text: "Redes sociales guardadas correctamente.",
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

// ── Toggle Disponibilidad ───────────────────────────────────────
async function toggleDisponibilidad() {
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
  if (!usuario.id) return;

  const res = await fetch(`/api/usuario/${usuario.id}`);
  const data = await res.json();
  if (!data.success) return;

  const actualDisponible = data.usuario.disponible !== false;
  const nuevoEstado = !actualDisponible;
  const textoEstado = nuevoEstado
    ? "Disponible para contratación"
    : "No disponible";

  const confirm = await Swal.fire({
    icon: "question",
    title: "Cambiar disponibilidad",
    text: `¿Cambiar a "${textoEstado}"?`,
    showCancelButton: true,
    confirmButtonText: "Sí, cambiar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#f97316",
  });

  if (!confirm.isConfirmed) return;

  try {
    const putRes = await fetch(`/api/usuario/${usuario.id}/disponibilidad`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ disponible: nuevoEstado }),
    });
    const putData = await putRes.json();

    if (putData.success) {
      cargarPerfil();
      Swal.fire({
        icon: "success",
        title: "¡Actualizado!",
        text: `Ahora apareces como "${textoEstado}"`,
        toast: true,
        position: "bottom-end",
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
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

// ── Traducir biografía ──────────────────────────────────────────
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

// ── Imágenes: portada y avatar ──────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  // Contador biografía
  const textarea = document.getElementById("bioBiografia");
  if (textarea) {
    textarea.addEventListener("input", () => {
      document.getElementById("bioCharCount").textContent =
        textarea.value.length;
    });
  }

  // Portada
  const editCover = document.getElementById("editCover");
  const coverInput = document.getElementById("coverInput");
  const coverImg = document.getElementById("coverImg");

  if (editCover) editCover.addEventListener("click", () => coverInput.click());

  if (coverInput) {
    coverInput.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
      if (!usuario.id) return;

      coverImg.src = URL.createObjectURL(file);

      const formData = new FormData();
      formData.append("portada", file);

      try {
        const res = await fetch(`/api/usuario/${usuario.id}/portada`, {
          method: "PUT",
          body: formData,
        });
        const data = await res.json();

        if (data.success) {
          Swal.fire({
            icon: "success",
            title: "¡Actualizado!",
            text: "Portada actualizada correctamente.",
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

      coverInput.value = "";
    });
  }

  // Avatar
  const editAvatar = document.getElementById("editAvatar");
  const avatarInput = document.getElementById("avatarInput");
  const avatarImg = document.getElementById("avatarImg");

  if (editAvatar)
    editAvatar.addEventListener("click", () => avatarInput.click());

  if (avatarInput) {
    avatarInput.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
      if (!usuario.id) return;

      avatarImg.src = URL.createObjectURL(file);

      const formData = new FormData();
      formData.append("foto_logo", file);

      try {
        const res = await fetch(`/api/usuario/${usuario.id}/foto-logo`, {
          method: "PUT",
          body: formData,
        });
        const data = await res.json();

        if (data.success) {
          Swal.fire({
            icon: "success",
            title: "¡Actualizado!",
            text: "Foto de perfil actualizada correctamente.",
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

      avatarInput.value = "";
    });
  }
});
