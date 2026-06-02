// ── Toggle mostrar/ocultar contraseña ────────────────────────
const toggle = document.getElementById("togglePassword");
const passInput = document.getElementById("password");

toggle.addEventListener("click", () => {
  const isPassword = passInput.type === "password";
  passInput.type = isPassword ? "text" : "password";
  toggle.querySelector("svg").style.opacity = isPassword ? "0.5" : "1";
});

// ── Login ─────────────────────────────────────────────────────
document.querySelector(".login-btn").addEventListener("click", async () => {
  const correo = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!correo || !password) {
    Swal.fire({
      icon: "warning",
      title: "Campos vacíos",
      text: "Por favor ingresa tu correo y contraseña.",
      confirmButtonColor: "#f97316",
    });
    return;
  }

  // Mostrar loading mientras espera respuesta
  Swal.fire({
    title: "Iniciando sesión...",
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading(),
  });

  try {
    const res = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo, password }),
    });

    const data = await res.json();

    if (data.success) {
      localStorage.setItem("usuario", JSON.stringify(data.usuario));

      await Swal.fire({
        icon: "success",
        title: "¡Bienvenido!",
        text: data.usuario.nombre,
        confirmButtonColor: "#f97316",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });

      window.location.href = "../../index.html";
    } else {
      Swal.fire({
        icon: "error",
        title: "Error al iniciar sesión",
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
