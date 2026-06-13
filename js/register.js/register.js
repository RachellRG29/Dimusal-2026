// ═══════════════════════════════════════════════════════════════
//  DIMUSAL – register.js   (flujo 3 pasos + modal verificación)
// ═══════════════════════════════════════════════════════════════

window._reg_foto_logo = null;
window._reg_portada = null;

// ════════════════════════════════════════════════════════════════
//  FORZAR SWEETALERT2 SIEMPRE ENCIMA DEL MODAL
// ════════════════════════════════════════════════════════════════
(function () {
  const style = document.createElement("style");
  style.textContent = `.swal2-container { z-index: 99999 !important; }`;
  document.head.appendChild(style);
})();

// ════════════════════════════════════════════════════════════════
//  HELPERS DE VALIDACIÓN EN TIEMPO REAL
// ════════════════════════════════════════════════════════════════
function mostrarError(id, mensaje) {
  const input = document.getElementById(id);
  if (!input) return;
  input.style.borderColor = "#ef4444";
  let err = input.parentElement.querySelector(".reg-error-msg");
  if (!err) {
    err = document.createElement("span");
    err.className = "reg-error-msg";
    err.style.cssText =
      "color:#ef4444;font-size:12px;margin-top:4px;display:block;";
    input.parentElement.appendChild(err);
  }
  err.textContent = mensaje;
}

function limpiarError(id) {
  const input = document.getElementById(id);
  if (!input) return;
  input.style.borderColor = "";
  const err = input.parentElement.querySelector(".reg-error-msg");
  if (err) err.textContent = "";
}

function marcarValido(id) {
  const input = document.getElementById(id);
  if (!input) return;
  input.style.borderColor = "#22c55e";
  const err = input.parentElement.querySelector(".reg-error-msg");
  if (err) err.textContent = "";
}
// ── Específicas para portafolio ───────────────────────────────
function mostrarErrorPortafolio(mensaje) {
  const input = document.getElementById("portafolio");
  input.style.borderColor = "#ef4444";
  const campo = input.closest(".reg-field");
  let err = campo.querySelector(".reg-error-msg");
  if (!err) {
    err = document.createElement("span");
    err.className = "reg-error-msg";
    err.style.cssText =
      "color:#ef4444;font-size:12px;margin-top:4px;display:block;";
    campo.appendChild(err);
  }
  err.textContent = mensaje;
}

function limpiarErrorPortafolio() {
  const input = document.getElementById("portafolio");
  input.style.borderColor = "";
  const campo = input.closest(".reg-field");
  const err = campo.querySelector(".reg-error-msg");
  if (err) err.textContent = "";
}

function marcarValidoPortafolio() {
  const input = document.getElementById("portafolio");
  input.style.borderColor = "#22c55e";
  const campo = input.closest(".reg-field");
  const err = campo.querySelector(".reg-error-msg");
  if (err) err.textContent = "";
}
// ════════════════════════════════════════════════════════════════
//  VALIDACIONES EN TIEMPO REAL — PASO 1
// ════════════════════════════════════════════════════════════════

// Nombre
document.getElementById("nombre").addEventListener("input", function () {
  if (this.value.trim().length < 3)
    mostrarError("nombre", "Ingresa tu nombre completo.");
  else marcarValido("nombre");
});

// Teléfono
document.getElementById("telefono").addEventListener("input", function () {
  // Solo números y guión, sin espacios
  this.value = this.value.replace(/[^0-9-]/g, "");

  // Auto-insertar guión al llegar al 4to dígito
  const soloNumeros = this.value.replace(/-/g, "");
  if (soloNumeros.length > 4) {
    this.value = soloNumeros.slice(0, 4) + "-" + soloNumeros.slice(4, 8);
  }

  // Límite máximo 9 caracteres (0000-0000)
  if (this.value.length > 9) this.value = this.value.slice(0, 9);

  const val = this.value.trim();
  if (!/^\d{4}-\d{4}$/.test(val))
    mostrarError("telefono", "Formato: 7123-4567");
  else marcarValido("telefono");
});

// Correo
document.getElementById("correo").addEventListener("input", function () {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.value.trim()))
    mostrarError("correo", "Ingresa un correo válido.");
  else marcarValido("correo");
});

// Nombre artístico (en tiempo real)
document
  .getElementById("nombre-artistico")
  .addEventListener("input", function () {
    const esArtista = document.getElementById("check-artista").checked;
    if (!esArtista) return;
    if (this.value.trim().length >= 3) marcarValido("nombre-artistico");
    else if (this.value.trim().length > 0)
      mostrarError("nombre-artistico", "Mínimo 3 caracteres.");
    else limpiarError("nombre-artistico");
  });

// Contraseña
document.getElementById("password").addEventListener("input", function () {
  this.value = this.value.replace(/\s/g, "");
  const val = this.value;

  // Mostrar requisitos al empezar a escribir
  const reqBox = document.getElementById("password-requisitos");
  reqBox.style.display = val.length > 0 ? "flex" : "none";

  // Validar cada requisito
  const checks = {
    "req-length": val.length >= 8,
    "req-upper": /[A-Z]/.test(val),
    "req-lower": /[a-z]/.test(val),
    "req-number": /[0-9]/.test(val),
    "req-sign": /[^A-Za-z0-9]/.test(val),
  };

  let todoValido = true;
  Object.entries(checks).forEach(([id, valido]) => {
    const el = document.getElementById(id);
    el.textContent = (valido ? "✓ " : "✗ ") + el.textContent.slice(2);
    el.style.color = valido ? "#22c55e" : "#aaa";
    if (!valido) todoValido = false;
  });

  if (todoValido) marcarValido("password");
  else if (val.length > 0)
    document.getElementById("password").style.borderColor = "#ef4444";

  // Revalidar confirmar
  const confirm = document.getElementById("confirm-password");
  if (confirm.value) {
    if (confirm.value !== val)
      mostrarError("confirm-password", "Las contraseñas no coinciden.");
    else marcarValido("confirm-password");
  }
});

// Confirmar contraseña
document
  .getElementById("confirm-password")
  .addEventListener("input", function () {
    // No permitir espacios
    this.value = this.value.replace(/\s/g, "");

    const pass = document.getElementById("password").value;
    if (this.value !== pass) {
      mostrarError("confirm-password", "Las contraseñas no coinciden.");
    } else {
      marcarValido("confirm-password");
      // Mostrar mensaje de éxito
      const input = document.getElementById("confirm-password");
      let msg = input.parentElement.querySelector(".reg-error-msg");
      if (!msg) {
        msg = document.createElement("span");
        msg.className = "reg-error-msg";
        msg.style.cssText = "font-size:12px;margin-top:4px;display:block;";
        input.parentElement.appendChild(msg);
      }
      msg.style.color = "#22c55e";
      msg.textContent = "✓ Las contraseñas coinciden.";
    }
  });
// Portafolio (en tiempo real)
document.getElementById("portafolio").addEventListener("input", function () {
  const esArtista = document.getElementById("check-artista").checked;
  if (!esArtista) return;
  const val = this.value.trim();
  if (!val) {
    limpiarErrorPortafolio();
    return;
  }
  if (!val.startsWith("http"))
    mostrarError(
      "portafolio",
      "Debe ser una URL válida (ej: https://mipagina.com).",
    );
  else marcarValidoPortafolio();
});

["departamento", "distrito", "municipio"].forEach((id) => {
  document.getElementById(id).addEventListener("change", function () {
    if (this.value) limpiarErrorSelect(id);
  });
});
// ════════════════════════════════════════════════════════════════
//  TOGGLE VISIBILIDAD CONTRASEÑA
// ════════════════════════════════════════════════════════════════
document.querySelectorAll(".reg-field__eye").forEach((eye) => {
  eye.addEventListener("click", () => {
    const input = document.getElementById(eye.dataset.target);
    const isPass = input.type === "password";
    input.type = isPass ? "text" : "password";
    eye.querySelector("svg").style.opacity = isPass ? "0.5" : "1";
  });
});

// ════════════════════════════════════════════════════════════════
//  UPLOAD AREAS
// ════════════════════════════════════════════════════════════════
document.querySelectorAll(".reg-upload").forEach((area) => {
  const input = area.querySelector("input[type=file]");
  area.addEventListener("click", () => input.click());

  input.addEventListener("change", () => {
    if (!input.files || !input.files[0]) return;
    const file = input.files[0];

    if (input.id === "foto-logo") {
      window._reg_foto_logo = file;
      // Limpiar error de foto si existía
      const err = area.parentElement.querySelector(".reg-error-msg");
      if (err) err.textContent = "";
      area.style.borderColor = "";
    }

    if (input.id === "portada") {
      window._reg_portada = file;
      // Limpiar error de portada si existía
      const err = area.parentElement.querySelector(".reg-error-msg");
      if (err) err.textContent = "";
      area.style.borderColor = "";
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      area.style.backgroundImage = `url(${e.target.result})`;
      area.style.backgroundSize = "cover";
      area.style.backgroundPosition = "center";
      area.querySelector(".reg-upload__placeholder").style.opacity = "0";
    };
    reader.readAsDataURL(file);
  });
});
// ════════════════════════════════════════════════════════════════
//  UTILIDADES
// ════════════════════════════════════════════════════════════════
function irAPaso(desde, hacia) {
  const elDesde = document.getElementById(desde);
  const elHacia = document.getElementById(hacia);
  elDesde.classList.add("slide-out");
  setTimeout(() => {
    elDesde.classList.add("hidden");
    elDesde.classList.remove("slide-out");
    elHacia.classList.remove("hidden");
    elHacia.classList.add("slide-in");
    setTimeout(() => elHacia.classList.remove("slide-in"), 400);
  }, 300);
}

function volverAPaso(desde, hacia) {
  const elDesde = document.getElementById(desde);
  const elHacia = document.getElementById(hacia);
  elDesde.classList.add("slide-out");
  setTimeout(() => {
    elDesde.classList.add("hidden");
    elDesde.classList.remove("slide-out");
    elHacia.classList.remove("hidden");
    elHacia.classList.add("slide-in");
    setTimeout(() => elHacia.classList.remove("slide-in"), 400);
  }, 300);
}

function alertaRequerido(texto) {
  return Swal.fire({
    icon: "warning",
    title: "Campos incompletos",
    text: texto,
    confirmButtonColor: "#f97316",
  });
}

// ════════════════════════════════════════════════════════════════
//  VALIDACIÓN DUI
// ════════════════════════════════════════════════════════════════
const duiInput = document.getElementById("dui");

duiInput.addEventListener("input", (e) => {
  let val = e.target.value.replace(/[^0-9-]/g, "");
  const partes = val.split("-");
  if (partes.length > 2) val = partes[0] + "-" + partes.slice(1).join("");
  if (partes[0].length > 8) {
    partes[0] = partes[0].slice(0, 8);
    val = partes.join("-");
  }
  if (partes[1] !== undefined && partes[1].length > 1) {
    partes[1] = partes[1].slice(0, 1);
    val = partes.join("-");
  }
  if (val.length > 10) val = val.slice(0, 10);
  e.target.value = val;

  // Validación en tiempo real
  if (val && !/^\d{8}-\d{1}$/.test(val))
    mostrarError("dui", "Formato: 00000000-0");
  else if (/^\d{8}-\d{1}$/.test(val)) marcarValido("dui");
  else limpiarError("dui");
});

duiInput.addEventListener("keydown", (e) => {
  if (duiInput.value.length === 8 && e.key !== "Backspace" && e.key !== "-") {
    duiInput.value = duiInput.value + "-";
  }
});

// ════════════════════════════════════════════════════════════════
//  SELECCIÓN ÚNICA + MOSTRAR/OCULTAR CAMPOS SEGÚN TIPO
// ════════════════════════════════════════════════════════════════
const checkboxesTipo = ["check-artista", "check-oyente", "check-promotor"];

function aplicarCamposPorTipo(tipo) {
  const campoNombreArtistico = document.getElementById("nombre-artistico");
  const campoPortafolio = document.getElementById("portafolio");
  const uploadFoto = document
    .getElementById("upload-foto")
    .closest(".reg-field");
  const uploadPortada = document
    .getElementById("upload-portada")
    .closest(".reg-field");
  const seccionRedes = document
    .querySelector(".reg-socials")
    .closest(".reg-field");

  // Resetear todo primero
  [campoNombreArtistico, campoPortafolio].forEach((el) => {
    el.disabled = false;
    el.required = false;
    el.closest(".reg-field").style.opacity = "1";
    el.closest(".reg-field").style.pointerEvents = "auto";
  });
  [uploadFoto, uploadPortada, seccionRedes].forEach((el) => {
    el.style.opacity = "1";
    el.style.pointerEvents = "auto";
  });

  if (tipo === "artista") {
    // Todo obligatorio
    campoNombreArtistico.required = true;
    campoPortafolio.required = false; // portafolio opcional pero visible
    uploadFoto.style.opacity = "1";
    uploadPortada.style.opacity = "1";
    seccionRedes.style.opacity = "1";
  } else if (tipo === "oyente") {
    // Todo deshabilitado
    [campoNombreArtistico, campoPortafolio].forEach((el) => {
      el.disabled = true;
      el.value = "";
      el.closest(".reg-field").style.opacity = "0.35";
      el.closest(".reg-field").style.pointerEvents = "none";
    });
    uploadFoto.style.opacity = "0.35";
    uploadFoto.style.pointerEvents = "none";
    uploadPortada.style.opacity = "0.35";
    uploadPortada.style.pointerEvents = "none";
    seccionRedes.style.opacity = "0.35";
    seccionRedes.style.pointerEvents = "none";
    // Limpiar imágenes
    window._reg_foto_logo = null;
    window._reg_portada = null;
  } else if (tipo === "promotor") {
    // Solo foto/logo habilitada, lo demás deshabilitado
    [campoNombreArtistico, campoPortafolio].forEach((el) => {
      el.disabled = true;
      el.value = "";
      el.closest(".reg-field").style.opacity = "0.35";
      el.closest(".reg-field").style.pointerEvents = "none";
    });
    uploadFoto.style.opacity = "1";
    uploadFoto.style.pointerEvents = "auto";
    uploadPortada.style.opacity = "0.35";
    uploadPortada.style.pointerEvents = "none";
    seccionRedes.style.opacity = "0.35";
    seccionRedes.style.pointerEvents = "none";
    window._reg_portada = null;
  }
}

checkboxesTipo.forEach((id) => {
  document.getElementById(id).addEventListener("change", function () {
    if (this.checked) {
      checkboxesTipo.forEach((otherId) => {
        if (otherId !== id) document.getElementById(otherId).checked = false;
      });
      const tipo = id.replace("check-", "");
      aplicarCamposPorTipo(tipo);
    }
  });
});
// ════════════════════════════════════════════════════════════════
//  PASO 1 → PASO 2
// ════════════════════════════════════════════════════════════════
document.getElementById("btn-continuar-1").addEventListener("click", () => {
  const nombre = document.getElementById("nombre").value.trim();
  const telefono = document.getElementById("telefono").value.trim();
  const dui = document.getElementById("dui").value.trim();
  const correo = document.getElementById("correo").value.trim();
  const password = document.getElementById("password").value;
  const confirm = document.getElementById("confirm-password").value;
  const departamento = document.getElementById("departamento").value.trim();
  const distrito = document.getElementById("distrito").value.trim();
  const municipio = document.getElementById("municipio").value.trim();

  let hayError = false;

  if (!nombre || nombre.length < 3) {
    mostrarError("nombre", "Ingresa tu nombre completo.");
    hayError = true;
  }
  if (!/^\d{4}-\d{4}$/.test(telefono)) {
    mostrarError("telefono", "Formato: 7123-4567");
    hayError = true;
  }
  if (!/^\d{8}-\d{1}$/.test(dui)) {
    mostrarError("dui", "Formato: 00000000-0");
    hayError = true;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    mostrarError("correo", "Ingresa un correo válido.");
    hayError = true;
  }

  const tienePasswordValida =
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password);

  if (!tienePasswordValida) {
    mostrarError(
      "password",
      "Mínimo 8 caracteres, una mayúscula, una minúscula, un número y un signo.",
    );
    hayError = true;
  }
  if (password !== confirm) {
    mostrarError("confirm-password", "Las contraseñas no coinciden.");
    hayError = true;
  }
  if (!departamento) {
    mostrarErrorSelect("departamento", "Selecciona tu departamento.");
    hayError = true;
  } else {
    limpiarErrorSelect("departamento");
  }
  if (!distrito) {
    mostrarErrorSelect("distrito", "Selecciona tu distrito.");
    hayError = true;
  } else {
    limpiarErrorSelect("distrito");
  }
  if (!municipio) {
    mostrarErrorSelect("municipio", "Selecciona tu municipio.");
    hayError = true;
  } else {
    limpiarErrorSelect("municipio");
  }

  if (hayError) return;

  sessionStorage.setItem(
    "reg_step1",
    JSON.stringify({
      nombre_completo: nombre,
      telefono,
      dui,
      correo,
      password,
      departamento,
      distrito,
      municipio,
    }),
  );

  irAPaso("step-1", "step-2");
});

// ── Helpers selects ───────────────────────────────────────────
function mostrarErrorSelect(id, mensaje) {
  const select = document.getElementById(id);
  if (!select) return;
  select.style.borderColor = "#ef4444";
  const wrap = select.closest(".reg-select-wrap");
  let err = wrap.parentElement.querySelector(".reg-error-msg");
  if (!err) {
    err = document.createElement("span");
    err.className = "reg-error-msg";
    err.style.cssText =
      "color:#ef4444;font-size:12px;margin-top:4px;display:block;";
    wrap.parentElement.appendChild(err);
  }
  err.textContent = mensaje;
}

function limpiarErrorSelect(id) {
  const select = document.getElementById(id);
  if (!select) return;
  select.style.borderColor = "";
  const wrap = select.closest(".reg-select-wrap");
  const err = wrap.parentElement.querySelector(".reg-error-msg");
  if (err) err.textContent = "";
}
// ════════════════════════════════════════════════════════════════
//  PASO 2 → PASO 3
// ════════════════════════════════════════════════════════════════
document.getElementById("btn-continuar-2").addEventListener("click", () => {
  const esArtista = document.getElementById("check-artista").checked;
  const esOyente = document.getElementById("check-oyente").checked;
  const esPromotor = document.getElementById("check-promotor").checked;

  if (!esArtista && !esOyente && !esPromotor) {
    // Este sí puede ser Swal porque no hay campo específico donde mostrar el error
    alertaRequerido("Selecciona un tipo de cuenta.");
    return;
  }

  let tipo = "";
  if (esArtista) tipo = "artista";
  if (esOyente) tipo = "oyente";
  if (esPromotor) tipo = "promotor";

  let hayError = false;

  if (tipo === "artista") {
    const nombreArtistico = document
      .getElementById("nombre-artistico")
      .value.trim();
    if (!nombreArtistico) {
      mostrarError("nombre-artistico", "El nombre artístico es obligatorio.");
      hayError = true;
    } else {
      marcarValido("nombre-artistico");
    }

    if (!window._reg_foto_logo) {
      // Mostrar error debajo del área de foto
      const areaFoto = document.getElementById("upload-foto");
      let err = areaFoto.parentElement.querySelector(".reg-error-msg");
      if (!err) {
        err = document.createElement("span");
        err.className = "reg-error-msg";
        err.style.cssText =
          "color:#ef4444;font-size:12px;margin-top:4px;display:block;";
        areaFoto.parentElement.appendChild(err);
      }
      err.textContent = "Debes subir tu foto/logo.";
      areaFoto.style.borderColor = "#ef4444";
      hayError = true;
    }

    if (!window._reg_portada) {
      const areaPortada = document.getElementById("upload-portada");
      let err = areaPortada.parentElement.querySelector(".reg-error-msg");
      if (!err) {
        err = document.createElement("span");
        err.className = "reg-error-msg";
        err.style.cssText =
          "color:#ef4444;font-size:12px;margin-top:4px;display:block;";
        areaPortada.parentElement.appendChild(err);
      }
      err.textContent = "Debes subir tu portada de perfil.";
      areaPortada.style.borderColor = "#ef4444";
      hayError = true;
    }
  }

  if (tipo === "promotor") {
    if (!window._reg_foto_logo) {
      const areaFoto = document.getElementById("upload-foto");
      let err = areaFoto.parentElement.querySelector(".reg-error-msg");
      if (!err) {
        err = document.createElement("span");
        err.className = "reg-error-msg";
        err.style.cssText =
          "color:#ef4444;font-size:12px;margin-top:4px;display:block;";
        areaFoto.parentElement.appendChild(err);
      }
      err.textContent = "Debes subir tu foto/logo.";
      areaFoto.style.borderColor = "#ef4444";
      hayError = true;
    }
  }
  const portafolio = document.getElementById("portafolio").value.trim();

  if (tipo === "artista") {
    if (!portafolio) {
      mostrarErrorPortafolio("El portafolio es obligatorio para artistas.");
      hayError = true;
    } else if (!portafolio.startsWith("http")) {
      mostrarErrorPortafolio(
        "Debe ser una URL válida (ej: https://mipagina.com).",
      );
      hayError = true;
    } else {
      marcarValidoPortafolio();
    }
  } else {
    if (portafolio && !portafolio.startsWith("http")) {
      mostrarErrorPortafolio(
        "Debe ser una URL válida (ej: https://mipagina.com).",
      );
      hayError = true;
    } else {
      limpiarErrorPortafolio();
    }
  }

  if (hayError) return;

  sessionStorage.setItem(
    "reg_step2",
    JSON.stringify({
      tipo,
      nombre_artistico: document
        .getElementById("nombre-artistico")
        .value.trim(),
      portafolio,
      spotify: document.querySelector('[name="spotify"]').value.trim(),
      instagram: document.querySelector('[name="instagram"]').value.trim(),
      youtube: document.querySelector('[name="youtube"]').value.trim(),
      tiktok: document.querySelector('[name="tiktok"]').value.trim(),
    }),
  );

  irAPaso("step-2", "step-3");
});
// ════════════════════════════════════════════════════════════════
//  PASO 3 → REGISTRARME
// ════════════════════════════════════════════════════════════════
document
  .getElementById("btn-registrarme")
  .addEventListener("click", async () => {
    const step1 = JSON.parse(sessionStorage.getItem("reg_step1"));
    const step2 = JSON.parse(sessionStorage.getItem("reg_step2"));

    if (!step1 || !step2) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Faltan datos. Por favor vuelve al inicio del registro.",
        confirmButtonColor: "#f97316",
      });
      return;
    }

    const objetivo = document.getElementById("objetivo").value;
    if (!objetivo) {
      alertaRequerido("Selecciona qué buscas en DIMUSAL.");
      return;
    }

    const etiquetas = Array.from(
      document.querySelectorAll(".reg-tag-chip.selected"),
    ).map((btn) => btn.dataset.tag);

    sessionStorage.setItem(
      "reg_pendiente",
      JSON.stringify({ ...step1, ...step2, objetivo, etiquetas }),
    );
    sessionStorage.removeItem("reg_step1");
    sessionStorage.removeItem("reg_step2");

    Swal.fire({
      title: "Enviando código de verificación...",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const res = await fetch("http://localhost:3000/api/enviar-codigo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          correo: step1.correo,
          nombre: step1.nombre_completo,
        }),
      });
      const data = await res.json();

      if (data.success) {
        await Swal.fire({
          icon: "success",
          title: "¡Código enviado!",
          text: `Revisa tu correo ${step1.correo} e ingresa el código de 4 dígitos.`,
          confirmButtonColor: "#f97316",
          timer: 2500,
          timerProgressBar: true,
          showConfirmButton: false,
          allowOutsideClick: false,
        });
        abrirModalVerificacion(step1.correo);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error al enviar código",
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
  });

// ════════════════════════════════════════════════════════════════
//  BOTONES BACK
// ════════════════════════════════════════════════════════════════
document.getElementById("btn-back-2").addEventListener("click", (e) => {
  e.preventDefault();
  volverAPaso("step-2", "step-1");
});

document.getElementById("btn-back-3").addEventListener("click", (e) => {
  e.preventDefault();
  volverAPaso("step-3", "step-2");
});

// ════════════════════════════════════════════════════════════════
//  MODAL DE VERIFICACIÓN
// ════════════════════════════════════════════════════════════════
let _timerInterval = null;

function abrirModalVerificacion(correo) {
  document.getElementById("modal-correo-display").textContent = correo;
  const modal = document.getElementById("modal-verificacion");
  modal.style.display = "flex";
  document.addEventListener("keydown", bloquearEscape);

  ["md1", "md2", "md3", "md4"].forEach((id) => {
    document.getElementById(id).value = "";
  });
  document.getElementById("md1").focus();

  sessionStorage.setItem("reg_intentos_envio", "0");
  sessionStorage.removeItem("reg_timer_fin");
  if (_timerInterval) clearInterval(_timerInterval);

  const btnReenviar = document.getElementById("btn-modal-reenviar");
  btnReenviar.style.pointerEvents = "auto";
  btnReenviar.style.opacity = "1";
  btnReenviar.style.display = "inline";

  document.getElementById("modal-timer").textContent = "";
  actualizarIntentos();
}

function bloquearEscape(e) {
  if (e.key === "Escape") e.preventDefault();
}

function iniciarContador() {
  const btnReenviar = document.getElementById("btn-modal-reenviar");
  const timerEl = document.getElementById("modal-timer");
  const fin = Date.now() + 2 * 60 * 1000;
  sessionStorage.setItem("reg_timer_fin", fin.toString());
  btnReenviar.style.pointerEvents = "none";
  btnReenviar.style.opacity = "0.4";
  if (_timerInterval) clearInterval(_timerInterval);

  _timerInterval = setInterval(() => {
    const restante = Math.max(
      0,
      parseInt(sessionStorage.getItem("reg_timer_fin")) - Date.now(),
    );
    const min = Math.floor(restante / 60000);
    const seg = Math.floor((restante % 60000) / 1000);
    if (restante <= 0) {
      clearInterval(_timerInterval);
      timerEl.textContent = "";
      btnReenviar.style.pointerEvents = "auto";
      btnReenviar.style.opacity = "1";
      sessionStorage.removeItem("reg_timer_fin");
    } else {
      timerEl.textContent = `Puedes reenviar en ${min}:${seg.toString().padStart(2, "0")}`;
    }
  }, 500);
}

function actualizarIntentos() {
  const MAX = 5;
  const usados = parseInt(sessionStorage.getItem("reg_intentos_envio") || "0");
  const restantes = MAX - usados;
  const el = document.getElementById("modal-intentos");
  if (restantes <= 0) {
    el.textContent = "Has alcanzado el límite de reenvíos.";
    el.style.color = "#ef4444";
    document.getElementById("btn-modal-reenviar").style.display = "none";
    document.getElementById("modal-timer").textContent = "";
    if (_timerInterval) clearInterval(_timerInterval);
  } else {
    el.textContent = `Reenvíos restantes: ${restantes} de ${MAX}`;
    el.style.color = "#ccc";
  }
}

["md1", "md2", "md3", "md4"].forEach((id, i, arr) => {
  const input = document.getElementById(id);
  input.addEventListener("input", () => {
    input.value = input.value.replace(/[^0-9]/g, "");
    if (input.value && i < arr.length - 1) {
      document.getElementById(arr[i + 1]).focus();
    }
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Backspace" && !input.value && i > 0) {
      document.getElementById(arr[i - 1]).focus();
    }
  });
});

// ── Verificar código ──────────────────────────────────────────
document
  .getElementById("btn-modal-verificar")
  .addEventListener("click", async () => {
    const codigo = ["md1", "md2", "md3", "md4"]
      .map((id) => document.getElementById(id).value)
      .join("");

    if (codigo.length < 4) {
      await Swal.fire({
        icon: "warning",
        title: "Código incompleto",
        text: "Ingresa los 4 dígitos del código.",
        confirmButtonColor: "#f97316",
      });
      return;
    }

    const datos = JSON.parse(sessionStorage.getItem("reg_pendiente"));
    if (!datos) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se encontraron los datos del registro. Vuelve a empezar.",
        confirmButtonColor: "#f97316",
      });
      return;
    }

    Swal.fire({
      title: "Verificando...",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const resVerif = await fetch(
        "http://localhost:3000/api/verificar-codigo",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ correo: datos.correo, codigo }),
        },
      );
      const dataVerif = await resVerif.json();

      if (!dataVerif.success) {
        await Swal.fire({
          icon: "error",
          title: "Código incorrecto",
          text: dataVerif.mensaje,
          confirmButtonColor: "#f97316",
        });
        ["md1", "md2", "md3", "md4"].forEach((id) => {
          document.getElementById(id).value = "";
        });
        document.getElementById("md1").focus();
        return;
      }

      Swal.fire({
        title: "Creando tu cuenta...",
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => Swal.showLoading(),
      });

      const formData = new FormData();
      Object.entries(datos).forEach(([key, value]) => {
        if (key === "etiquetas" && Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

      if (window._reg_foto_logo)
        formData.append("foto_logo", window._reg_foto_logo);
      if (window._reg_portada) formData.append("portada", window._reg_portada);

      const resReg = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        body: formData,
      });
      const dataReg = await resReg.json();

      if (dataReg.success) {
        sessionStorage.removeItem("reg_pendiente");
        sessionStorage.removeItem("reg_intentos_envio");
        sessionStorage.removeItem("reg_timer_fin");
        window._reg_foto_logo = null;
        window._reg_portada = null;
        if (_timerInterval) clearInterval(_timerInterval);
        document.removeEventListener("keydown", bloquearEscape);

        Swal.close();
        await new Promise((resolve) => setTimeout(resolve, 300));

        await Swal.fire({
          icon: "success",
          title: "¡Cuenta creada!",
          text: "Tu correo fue verificado exitosamente.",
          confirmButtonColor: "#f97316",
          timer: 2500,
          timerProgressBar: true,
          showConfirmButton: false,
          allowOutsideClick: false,
          allowEscapeKey: false,
        });

        window.location.href = "/login.html";
      } else {
        await Swal.fire({
          icon: "error",
          title: "Error al registrar",
          text: dataReg.mensaje,
          confirmButtonColor: "#f97316",
        });
      }
    } catch (err) {
      await Swal.fire({
        icon: "error",
        title: "Sin conexión",
        text: "No se pudo conectar con el servidor.",
        confirmButtonColor: "#f97316",
      });
    }
  });

// ── Reenviar código ───────────────────────────────────────────
document
  .getElementById("btn-modal-reenviar")
  .addEventListener("click", async () => {
    const MAX = 5;
    const usados = parseInt(
      sessionStorage.getItem("reg_intentos_envio") || "0",
    );

    if (usados >= MAX) {
      await Swal.fire({
        icon: "error",
        title: "Límite alcanzado",
        text: "Has agotado todos los reenvíos. Por favor vuelve a registrarte.",
        confirmButtonColor: "#f97316",
      });
      document.getElementById("btn-modal-reenviar").style.display = "none";
      return;
    }

    const datos = JSON.parse(sessionStorage.getItem("reg_pendiente"));
    if (!datos) return;

    Swal.fire({
      title: "Reenviando código...",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const res = await fetch("http://localhost:3000/api/enviar-codigo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          correo: datos.correo,
          nombre: datos.nombre_completo,
        }),
      });
      const data = await res.json();

      if (data.success) {
        sessionStorage.setItem("reg_intentos_envio", (usados + 1).toString());

        await Swal.fire({
          icon: "success",
          title: "Código reenviado",
          text: "Revisa tu correo.",
          confirmButtonColor: "#f97316",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
          allowOutsideClick: false,
        });

        actualizarIntentos();
        iniciarContador();
      } else {
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: data.mensaje,
          confirmButtonColor: "#f97316",
        });
      }
    } catch (err) {
      await Swal.fire({
        icon: "error",
        title: "Sin conexión",
        text: "No se pudo conectar con el servidor.",
        confirmButtonColor: "#f97316",
      });
    }
  });
