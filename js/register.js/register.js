// ═══════════════════════════════════════════════════════════════
//  DIMUSAL – register.js   (flujo 3 pasos + modal verificación)
// ═══════════════════════════════════════════════════════════════

// Variables globales para guardar los archivos de imagen
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
//  TOGGLE VISIBILIDAD CONTRASEÑA (ojo)
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
//  UPLOAD AREAS (preview de imagen + guardar archivo en memoria)
// ════════════════════════════════════════════════════════════════
document.querySelectorAll(".reg-upload").forEach((area) => {
  const input = area.querySelector("input[type=file]");

  area.addEventListener("click", () => input.click());

  input.addEventListener("change", () => {
    if (!input.files || !input.files[0]) return;

    const file = input.files[0];

    if (input.id === "foto-logo") window._reg_foto_logo = file;
    if (input.id === "portada") window._reg_portada = file;

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
//  VALIDACIÓN DUI (input en tiempo real + blur)
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
});

duiInput.addEventListener("keydown", (e) => {
  if (duiInput.value.length === 8 && e.key !== "Backspace" && e.key !== "-") {
    duiInput.value = duiInput.value + "-";
  }
});

duiInput.addEventListener("blur", () => {
  const duiRegex = /^\d{8}-\d{1}$/;
  if (duiInput.value && !duiRegex.test(duiInput.value)) {
    Swal.fire({
      icon: "warning",
      title: "DUI inválido",
      text: "El DUI debe tener el formato 00000000-0",
      confirmButtonColor: "#f97316",
    });
    duiInput.value = "";
    duiInput.focus();
  }
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
  const distrito = document.getElementById("distrito").value.trim(); // ← agregar
  const municipio = document.getElementById("municipio").value.trim();

  if (
    !nombre ||
    !telefono ||
    !dui ||
    !correo ||
    !password ||
    !departamento ||
    !distrito ||
    !municipio
  ) {
    alertaRequerido("Por favor completa todos los campos obligatorios.");
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    Swal.fire({
      icon: "error",
      title: "Correo inválido",
      text: "Ingresa un correo electrónico válido.",
      confirmButtonColor: "#f97316",
    });
    return;
  }
  if (!/^\d{4}-?\d{4}$/.test(telefono)) {
    Swal.fire({
      icon: "error",
      title: "Teléfono inválido",
      text: "El teléfono debe tener 8 dígitos (ej: 7123-4567).",
      confirmButtonColor: "#f97316",
    });
    return;
  }
  if (!/^\d{8}-\d{1}$/.test(dui)) {
    Swal.fire({
      icon: "error",
      title: "DUI inválido",
      text: "El DUI debe tener el formato 00000000-0.",
      confirmButtonColor: "#f97316",
    });
    return;
  }
  if (password.length < 8) {
    Swal.fire({
      icon: "error",
      title: "Contraseña muy corta",
      text: "La contraseña debe tener al menos 8 caracteres.",
      confirmButtonColor: "#f97316",
    });
    return;
  }
  if (password !== confirm) {
    Swal.fire({
      icon: "error",
      title: "Contraseñas no coinciden",
      text: "Verifica que ambas contraseñas sean iguales.",
      confirmButtonColor: "#f97316",
    });
    return;
  }

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

// ════════════════════════════════════════════════════════════════
//  PASO 2 → PASO 3
// ════════════════════════════════════════════════════════════════
document.getElementById("btn-continuar-2").addEventListener("click", () => {
  const esArtista = document.getElementById("check-artista").checked;
  const esOyente = document.getElementById("check-oyente").checked;
  const esPromotor = document.getElementById("check-promotor").checked;

  if (!esArtista && !esOyente && !esPromotor) {
    alertaRequerido("Selecciona al menos un tipo de cuenta.");
    return;
  }

  const tipo = [];
  if (esArtista) tipo.push("artista");
  if (esOyente) tipo.push("oyente");
  if (esPromotor) tipo.push("promotor");

  const portafolio = document.getElementById("portafolio").value.trim();
  if (portafolio && !portafolio.startsWith("http")) {
    Swal.fire({
      icon: "warning",
      title: "URL inválida",
      text: "El portafolio debe ser una URL válida (ej: https://mipagina.com).",
      confirmButtonColor: "#f97316",
    });
    return;
  }

  sessionStorage.setItem(
    "reg_step2",
    JSON.stringify({
      tipo: tipo.join(","),
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
//  PASO 3 → REGISTRARME → envía código y abre modal
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
      JSON.stringify({
        ...step1,
        ...step2,
        objetivo,
        etiquetas,
      }),
    );
    sessionStorage.removeItem("reg_step1");
    sessionStorage.removeItem("reg_step2");

    // 1️⃣ Loading
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
        // 2️⃣ Éxito — esperar que termine el Swal antes de abrir modal
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
        // 3️⃣ Modal solo cuando el Swal terminó
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
        text: "No se pudo conectar con el servidor. ¿Está corriendo node server.js?",
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

  // Resetear intentos y timer
  sessionStorage.setItem("reg_intentos_envio", "0");
  sessionStorage.removeItem("reg_timer_fin");
  if (_timerInterval) clearInterval(_timerInterval);

  // Estado inicial del botón reenviar
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

// ── Contador de 2 minutos (solo arranca al reenviar) ──────────
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

// ── Mostrar intentos restantes ────────────────────────────────
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

// ── Auto-focus entre inputs del modal ────────────────────────
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

    // Loading verificando
    Swal.fire({
      title: "Verificando...",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      // 1️⃣ Verificar código
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

      // 2️⃣ Código correcto → registrar
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
        // Limpiar todo
        sessionStorage.removeItem("reg_pendiente");
        sessionStorage.removeItem("reg_intentos_envio");
        sessionStorage.removeItem("reg_timer_fin");
        window._reg_foto_logo = null;
        window._reg_portada = null;
        if (_timerInterval) clearInterval(_timerInterval);
        document.removeEventListener("keydown", bloquearEscape);

        // 3️⃣ Cerrar loading, esperar que cierre
        Swal.close();
        await new Promise((resolve) => setTimeout(resolve, 300));

        // 4️⃣ Mostrar éxito 2.5 segundos y redirigir solo
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

        // 5️⃣ Redirigir después de que el timer termina
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
