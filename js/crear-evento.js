/* ── Estado global ── */
let actividadSeleccionada = "evento"; // "evento" | "oportunidad"
let ceCurrentStep = 1;
let ceTipoSelected = "";

/* ══ PASO 0: Selección de actividad ══ */
function selectActividad(el) {
  document
    .querySelectorAll(".ce-actividad-card")
    .forEach((c) => c.classList.remove("selected"));
  el.classList.add("selected");
  actividadSeleccionada = el.dataset.actividad;
}

function iniciarFlujo() {
  // Ocultar selector y botón inicial
  document.getElementById("ceActividadSelector").style.display = "none";
  document.getElementById("ceActividadNav").style.display = "none";

  // Actualizar título y subtítulo según actividad
  const titulo = document.getElementById("ceTitulo");
  const subtitulo = document.getElementById("ceSubtitulo");

  if (actividadSeleccionada === "evento") {
    titulo.textContent = "Crear evento";
    subtitulo.textContent = "Completa los datos de tu evento confirmado.";
    // Paso 3 label
    document.getElementById("ceStep3Label").textContent = "Convocatoria";
    // Mostrar sección tipo evento
    document.getElementById("ceTipoSection").style.display = "block";
    document.getElementById("ceDatosTitle").textContent = "Datos del evento";
    document.getElementById("ce-fecha-inicio-label").innerHTML =
      'Fecha de inicio <span class="req">*</span>';
    document.getElementById("ce-fecha-fin-wrap").style.display = "block";
    document.getElementById("ce-hora-wrap").style.display = "block";
  } else {
    titulo.textContent = "Crear oportunidad";
    subtitulo.textContent = "Publica una convocatoria para encontrar artistas.";
    document.getElementById("ceStep3Label").textContent = "Requisitos";
    // Ocultar tipo (no aplica para oportunidad)
    document.getElementById("ceTipoSection").style.display = "none";
    document.getElementById("ceDatosTitle").textContent =
      "Datos de la oportunidad";
    document.getElementById("ce-fecha-inicio-label").innerHTML =
      'Fecha límite de postulación <span class="req">*</span>';
    document.getElementById("ce-fecha-fin-wrap").style.display = "none";
    document.getElementById("ce-hora-wrap").style.display = "none";
    // En oportunidad la convocatoria siempre está activa
    document.getElementById("ceConvocatoriaFields").style.display = "block";
  }

  // Mostrar steps y card
  document.getElementById("ceSteps").style.display = "flex";
  document.getElementById("ceMainCard").style.display = "block";

  setStep(1);
}

/* ══ Tipo de evento ══ */
function selectTipo(el) {
  document
    .querySelectorAll(".ce-tipo-chip")
    .forEach((c) => c.classList.remove("selected"));
  el.classList.add("selected");
  ceTipoSelected = el.dataset.tipo;
  document.getElementById("err-tipo").style.display = "none";
}

/* ══ Toggle convocatoria (solo para evento) ══ */
function toggleConvocatoria(el) {
  document.getElementById("ceConvocatoriaFields").style.display = el.checked
    ? "block"
    : "none";
}

/* ══ Preview imagen ══ */
function previewImagen(input, previewId, wrapperId) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = document.getElementById(previewId);
      preview.style.backgroundImage = `url(${e.target.result})`;
      preview.style.display = "block";
      document
        .getElementById(wrapperId)
        .querySelectorAll(
          ".ce-upload__icon, .ce-upload__label, .ce-upload__sublabel",
        )
        .forEach((el) => (el.style.display = "none"));
    };
    reader.readAsDataURL(input.files[0]);
  }
}

/* ══ Control de steps ══ */
function setStep(n) {
  ceCurrentStep = n;
  document.querySelectorAll(".ce-panel").forEach((p, i) => {
    p.classList.toggle("active", i + 1 === n);
  });
  document.querySelectorAll(".ce-step").forEach((s, i) => {
    s.classList.remove("active", "done");
    if (i + 1 === n) s.classList.add("active");
    if (i + 1 < n) s.classList.add("done");
  });
  const card = document.querySelector(".ce-card");
  if (card) card.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ══ Siguiente paso con validación ══ */
function ceNext(step) {
  if (step === 1) {
    let ok = true;

    // Tipo solo requerido para evento
    if (actividadSeleccionada === "evento" && !ceTipoSelected) {
      document.getElementById("err-tipo").style.display = "block";
      ok = false;
    }

    const nombre = document.getElementById("ce-nombre").value.trim();
    if (!nombre) {
      show("err-nombre");
      highlight("ce-nombre", false);
      ok = false;
    } else {
      hide("err-nombre");
      highlight("ce-nombre", true);
    }

    const fecha = document.getElementById("ce-fecha-inicio").value;
    if (!fecha) {
      show("err-fecha");
      highlight("ce-fecha-inicio", false);
      ok = false;
    } else {
      hide("err-fecha");
      highlight("ce-fecha-inicio", true);
    }

    const modalidad = document.getElementById("ce-modalidad").value;
    if (!modalidad) {
      show("err-modalidad");
      ok = false;
    } else {
      hide("err-modalidad");
      highlight("ce-modalidad", true);
    }

    const desc = document.getElementById("ce-descripcion").value.trim();
    if (!desc || desc.length < 20) {
      show("err-desc");
      highlight("ce-descripcion", false);
      ok = false;
    } else {
      hide("err-desc");
      highlight("ce-descripcion", true);
    }

    if (!ok) return;
  }

  if (step === 2) {
    let ok = true;
    const lugar = document.getElementById("ce-lugar").value.trim();
    if (!lugar) {
      show("err-lugar");
      highlight("ce-lugar", false);
      ok = false;
    } else {
      hide("err-lugar");
      highlight("ce-lugar", true);
    }
    const depto = document.getElementById("ce-departamento").value;
    if (!depto) {
      show("err-depto");
      ok = false;
    } else {
      hide("err-depto");
      highlight("ce-departamento", true);
    }
    if (!ok) return;
  }

  if (step === 3) {
    // Para oportunidad, mostrar siempre el bloque de convocatoria
    if (actividadSeleccionada === "oportunidad") {
      document.getElementById("ceConvocatoriaFields").style.display = "block";
    }
  }

  if (step === 3) buildPreview();

  setStep(step + 1);
}

function ceBack(step) {
  if (step === 1) {
    // Volver al selector de actividad
    document.getElementById("ceSteps").style.display = "none";
    document.getElementById("ceMainCard").style.display = "none";
    document.getElementById("ceActividadSelector").style.display = "block";
    document.getElementById("ceActividadNav").style.display = "flex";
    return;
  }
  setStep(step - 1);
}

/* ══ Helpers de validación visual ══ */
function show(id) {
  document.getElementById(id).style.display = "block";
}
function hide(id) {
  document.getElementById(id).style.display = "none";
}
function highlight(id, ok) {
  const el = document.getElementById(id);
  if (el) el.style.borderColor = ok ? "#22c55e" : "#ef4444";
}

/* ══ Build preview ══ */
function buildPreview() {
  const nombre =
    document.getElementById("ce-nombre").value.trim() || "Sin nombre";
  const fecha = document.getElementById("ce-fecha-inicio").value || "";
  const lugar = document.getElementById("ce-lugar").value.trim() || "—";
  const depto = document.getElementById("ce-departamento").value || "";
  const desc = document.getElementById("ce-descripcion").value.trim() || "—";

  document.getElementById("prev-nombre").textContent = nombre;
  document.getElementById("prev-fecha").textContent = fecha
    ? new Date(fecha + "T12:00:00").toLocaleDateString("es-SV", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";
  document.getElementById("prev-lugar").textContent = [lugar, depto]
    .filter(Boolean)
    .join(", ");
  document.getElementById("prev-tipo-badge").textContent =
    ceTipoSelected || (actividadSeleccionada === "oportunidad" ? "—" : "—");
  document.getElementById("prev-actividad-badge").textContent =
    actividadSeleccionada === "evento" ? "Evento" : "Oportunidad";
  document.getElementById("prev-desc").textContent =
    desc.length > 200 ? desc.slice(0, 200) + "…" : desc;

  if (actividadSeleccionada === "oportunidad") {
    document.getElementById("prev-tipo-badge").style.display = "none";
  } else {
    document.getElementById("prev-tipo-badge").style.display = "";
  }
}

/* ══ Publicar ══ */
function publicarEvento() {
  document
    .querySelectorAll(".ce-panel")
    .forEach((p) => p.classList.remove("active"));
  document.querySelectorAll(".ce-step").forEach((s) => {
    s.classList.remove("active");
    s.classList.add("done");
  });

  const isOportunidad = actividadSeleccionada === "oportunidad";
  document.getElementById("ceSuccessTitle").textContent = isOportunidad
    ? "¡Oportunidad publicada!"
    : "¡Evento publicado!";
  document.getElementById("ceSuccessDesc").textContent = isOportunidad
    ? "Tu convocatoria ya está visible en DIMUSAL. Los artistas podrán encontrarla y postularse."
    : "Tu evento ya está visible en DIMUSAL. Los artistas podrán encontrarlo y postularse.";

  document.getElementById("ceSuccess").classList.add("show");
}

/* ══ Reset ══ */
function resetCrearEvento() {
  document.getElementById("ceSuccess").classList.remove("show");

  // Reiniciar estado
  actividadSeleccionada = "evento";
  ceTipoSelected = "";

  // Restaurar selector de actividad
  document
    .querySelectorAll(".ce-actividad-card")
    .forEach((c) => c.classList.remove("selected"));
  document.querySelector('[data-actividad="evento"]').classList.add("selected");

  // Ocultar steps y card, mostrar selector
  document.getElementById("ceSteps").style.display = "none";
  document.getElementById("ceMainCard").style.display = "none";
  document.getElementById("ceActividadSelector").style.display = "block";
  document.getElementById("ceActividadNav").style.display = "flex";

  // Limpiar campos
  [
    "ce-nombre",
    "ce-fecha-inicio",
    "ce-fecha-fin",
    "ce-hora",
    "ce-descripcion",
    "ce-lugar",
    "ce-municipio",
    "ce-direccion",
    "ce-capacidad",
    "ce-precio",
    "ce-num-artistas",
    "ce-cachet",
    "ce-notas-artistas",
    "ce-fecha-postulacion",
  ].forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.value = "";
      el.style.borderColor = "";
    }
  });

  const modal = document.getElementById("ce-modalidad");
  if (modal) {
    modal.value = "";
    modal.style.borderColor = "";
  }

  document
    .querySelectorAll(".ce-tipo-chip, .ce-tag-chip")
    .forEach((c) => c.classList.remove("selected"));
  document.getElementById("ceAbreConvocatoria").checked = false;
  document.getElementById("ceConvocatoriaFields").style.display = "none";

  const preview = document.getElementById("ceImagenPreview");
  if (preview) {
    preview.style.display = "none";
    preview.style.backgroundImage = "";
  }
  document
    .getElementById("ceUploadFlyer")
    .querySelectorAll(
      ".ce-upload__icon, .ce-upload__label, .ce-upload__sublabel",
    )
    .forEach((el) => (el.style.display = ""));

  // Restaurar header
  document.getElementById("ceTitulo").textContent = "Crear actividad";
  document.getElementById("ceSubtitulo").textContent =
    "Selecciona si deseas crear un evento o una oportunidad.";

  setStep(1);
}

/* ══ Limpiar error al escribir ══ */
document.addEventListener("DOMContentLoaded", () => {
  document
    .querySelectorAll(".ce-card input, .ce-card textarea, .ce-card select")
    .forEach((el) => {
      el.addEventListener("input", () => {
        if (el.value.trim()) el.style.borderColor = "#22c55e";
      });
      el.addEventListener("change", () => {
        if (el.value) el.style.borderColor = "#22c55e";
      });
    });
});
