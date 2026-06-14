// ═══════════════════════════════════════════════════════════════
//  DIMUSAL – nueva-password.js
// ═══════════════════════════════════════════════════════════════

// Verificar que venga del flujo correcto
const correoRecuperar = sessionStorage.getItem("rc_correo");
if (!correoRecuperar) window.location.href = "/recuperar-password.html";

// ── Toggle contraseñas ────────────────────────────────────────
["toggleNueva", "toggleConfirmar"].forEach((id) => {
  const btn = document.getElementById(id);
  const inputId = id === "toggleNueva" ? "nuevaPassword" : "confirmarPassword";
  btn.addEventListener("click", () => {
    const input = document.getElementById(inputId);
    const isPass = input.type === "password";
    input.type = isPass ? "text" : "password";
    btn.querySelector("svg").style.opacity = isPass ? "0.5" : "1";
  });
});

// ── Requisitos contraseña ─────────────────────────────────────
document.getElementById("nuevaPassword").addEventListener("input", function () {
  const val = this.value;
  const reqBox = document.getElementById("password-requisitos");
  reqBox.style.display = val.length > 0 ? "flex" : "none";

  const checks = {
    "req-length": val.length >= 8,
    "req-upper": /[A-Z]/.test(val),
    "req-lower": /[a-z]/.test(val),
    "req-number": /[0-9]/.test(val),
    "req-sign": /[^A-Za-z0-9]/.test(val),
  };

  Object.entries(checks).forEach(([id, valido]) => {
    const el = document.getElementById(id);
    el.textContent = (valido ? "✓ " : "✗ ") + el.textContent.slice(2);
    el.style.color = valido ? "#22c55e" : "#aaa";
  });
});

// ── Cambiar contraseña ────────────────────────────────────────
document
  .getElementById("btnCambiarPassword")
  .addEventListener("click", async () => {
    const nueva = document.getElementById("nuevaPassword").value;
    const confirmar = document.getElementById("confirmarPassword").value;

    const valida =
      nueva.length >= 8 &&
      /[A-Z]/.test(nueva) &&
      /[a-z]/.test(nueva) &&
      /[0-9]/.test(nueva) &&
      /[^A-Za-z0-9]/.test(nueva);

    if (!valida) {
      Swal.fire({
        icon: "warning",
        title: "Contraseña débil",
        text: "Cumple todos los requisitos de seguridad.",
        confirmButtonColor: "#f97316",
      });
      return;
    }

    if (nueva !== confirmar) {
      Swal.fire({
        icon: "warning",
        title: "No coinciden",
        text: "Las contraseñas no coinciden.",
        confirmButtonColor: "#f97316",
      });
      return;
    }

    Swal.fire({
      title: "Actualizando...",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const res = await fetch("/api/cambiar-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: correoRecuperar, nuevaPassword: nueva }),
      });
      const data = await res.json();

      if (data.success) {
        sessionStorage.removeItem("rc_correo");
        sessionStorage.removeItem("rc_intentos");
        await Swal.fire({
          icon: "success",
          title: "¡Contraseña actualizada!",
          text: "Ya puedes iniciar sesión con tu nueva contraseña.",
          confirmButtonColor: "#f97316",
          timer: 2500,
          timerProgressBar: true,
          showConfirmButton: false,
        });
        window.location.href = "/login.html";
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
