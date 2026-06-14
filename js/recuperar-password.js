// ═══════════════════════════════════════════════════════════════
//  DIMUSAL – recuperar-password.js
// ═══════════════════════════════════════════════════════════════

let _correoRecuperar = "";
let _timerInterval = null;

// ── Enviar código ─────────────────────────────────────────────
document
  .getElementById("btnEnviarCodigo")
  .addEventListener("click", async () => {
    const correo = document.getElementById("correo").value.trim();

    if (!correo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      Swal.fire({
        icon: "warning",
        title: "Correo inválido",
        text: "Ingresa un correo válido.",
        confirmButtonColor: "#f97316",
      });
      return;
    }

    Swal.fire({
      title: "Enviando código...",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const res = await fetch("/api/recuperar-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo }),
      });
      const data = await res.json();

      if (data.success) {
        _correoRecuperar = correo;
        await Swal.fire({
          icon: "success",
          title: "¡Código enviado!",
          text: `Revisa tu correo ${correo}.`,
          confirmButtonColor: "#f97316",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
        abrirModal(correo);
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
  });

// ── Modal ─────────────────────────────────────────────────────
function abrirModal(correo) {
  document.getElementById("modal-correo-display").textContent = correo;
  document.getElementById("modal-recuperar").style.display = "flex";
  ["rc1", "rc2", "rc3", "rc4"].forEach(
    (id) => (document.getElementById(id).value = ""),
  );
  document.getElementById("rc1").focus();
  sessionStorage.setItem("rc_intentos", "0");
  actualizarIntentos();
}

// ── Inputs código ─────────────────────────────────────────────
["rc1", "rc2", "rc3", "rc4"].forEach((id, i, arr) => {
  const input = document.getElementById(id);
  input.addEventListener("input", () => {
    input.value = input.value.replace(/[^0-9]/g, "");
    if (input.value && i < arr.length - 1)
      document.getElementById(arr[i + 1]).focus();
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Backspace" && !input.value && i > 0)
      document.getElementById(arr[i - 1]).focus();
  });
});

// ── Verificar código ──────────────────────────────────────────
document
  .getElementById("btnVerificarCodigo")
  .addEventListener("click", async () => {
    const codigo = ["rc1", "rc2", "rc3", "rc4"]
      .map((id) => document.getElementById(id).value)
      .join("");

    const modalEl = document.getElementById("modal-recuperar");

    if (codigo.length < 4) {
      modalEl.style.zIndex = "100";
      Swal.fire({
        icon: "warning",
        title: "Código incompleto",
        text: "Ingresa los 4 dígitos.",
        confirmButtonColor: "#f97316",
      }).then(() => {
        modalEl.style.zIndex = "9999";
      });
      return;
    }

    // Bajar modal antes de cualquier Swal
    modalEl.style.zIndex = "100";

    Swal.fire({
      title: "Verificando...",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const res = await fetch("/api/verificar-codigo-recovery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: _correoRecuperar, codigo }),
      });
      const data = await res.json();

      if (data.success) {
        sessionStorage.setItem("rc_correo", _correoRecuperar);
        await Swal.fire({
          icon: "success",
          title: "¡Código correcto!",
          text: "Ahora puedes cambiar tu contraseña.",
          confirmButtonColor: "#f97316",
          timer: 1500,
          showConfirmButton: false,
        });
        window.location.href = "/nueva-password.html";
      } else {
        await Swal.fire({
          icon: "error",
          title: "Código incorrecto",
          text: data.mensaje,
          confirmButtonColor: "#f97316",
        });
        // Restaurar modal después de que el usuario cierre el Swal
        modalEl.style.zIndex = "9999";
        ["rc1", "rc2", "rc3", "rc4"].forEach(
          (id) => (document.getElementById(id).value = ""),
        );
        document.getElementById("rc1").focus();
      }
    } catch (err) {
      await Swal.fire({
        icon: "error",
        title: "Sin conexión",
        text: "No se pudo conectar con el servidor.",
        confirmButtonColor: "#f97316",
      });
      modalEl.style.zIndex = "9999";
    }
  });

// ── Reenviar código ───────────────────────────────────────────
document
  .getElementById("btnReenviarCodigo")
  .addEventListener("click", async () => {
    const MAX = 3;
    const usados = parseInt(sessionStorage.getItem("rc_intentos") || "0");

    if (usados >= MAX) {
      Swal.fire({
        icon: "error",
        title: "Límite alcanzado",
        text: "Vuelve a empezar el proceso.",
        confirmButtonColor: "#f97316",
      });
      return;
    }

    // Bajar z-index del modal para que Swal quede encima
    const modalEl = document.getElementById("modal-recuperar");
    modalEl.style.zIndex = "100";

    Swal.fire({
      title: "Reenviando...",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const res = await fetch("/api/recuperar-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: _correoRecuperar }),
      });
      const data = await res.json();

      if (data.success) {
        sessionStorage.setItem("rc_intentos", (usados + 1).toString());
        await Swal.fire({
          icon: "success",
          title: "Código reenviado",
          text: "Revisa tu correo.",
          confirmButtonColor: "#f97316",
          timer: 2000,
          showConfirmButton: false,
        });
        // Restaurar z-index después del Swal
        modalEl.style.zIndex = "9999";
        actualizarIntentos();
        iniciarContador();
      } else {
        modalEl.style.zIndex = "9999";
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.mensaje,
          confirmButtonColor: "#f97316",
        });
      }
    } catch (err) {
      modalEl.style.zIndex = "9999";
      Swal.fire({
        icon: "error",
        title: "Sin conexión",
        text: "No se pudo conectar con el servidor.",
        confirmButtonColor: "#f97316",
      });
    }
  });

function actualizarIntentos() {
  const MAX = 3;
  const usados = parseInt(sessionStorage.getItem("rc_intentos") || "0");
  const restantes = MAX - usados;
  const el = document.getElementById("modal-intentos-rc");
  if (restantes <= 0) {
    el.textContent = "Has alcanzado el límite de reenvíos.";
    el.style.color = "#ef4444";
    document.getElementById("btnReenviarCodigo").style.display = "none";
  } else {
    el.textContent = `Reenvíos restantes: ${restantes} de ${MAX}`;
  }
}

function iniciarContador() {
  const btn = document.getElementById("btnReenviarCodigo");
  const timerEl = document.getElementById("modal-timer-rc");
  const fin = Date.now() + 2 * 60 * 1000;
  btn.style.pointerEvents = "none";
  btn.style.opacity = "0.4";
  if (_timerInterval) clearInterval(_timerInterval);

  _timerInterval = setInterval(() => {
    const restante = Math.max(0, fin - Date.now());
    const min = Math.floor(restante / 60000);
    const seg = Math.floor((restante % 60000) / 1000);
    if (restante <= 0) {
      clearInterval(_timerInterval);
      timerEl.textContent = "";
      btn.style.pointerEvents = "auto";
      btn.style.opacity = "1";
    } else {
      timerEl.textContent = `Puedes reenviar en ${min}:${seg.toString().padStart(2, "0")}`;
    }
  }, 500);
}
