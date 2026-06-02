// ── Toggle eye icons ──────────────────────────────────────────
document.querySelectorAll(".reg-field__eye").forEach((eye) => {
  eye.addEventListener("click", () => {
    const targetId = eye.dataset.target;
    const input = document.getElementById(targetId);
    const isPass = input.type === "password";
    input.type = isPass ? "text" : "password";
    eye.querySelector("svg").style.opacity = isPass ? "0.5" : "1";
  });
});

// ── Upload areas ──────────────────────────────────────────────
document.querySelectorAll(".reg-upload").forEach((area) => {
  const input = area.querySelector("input[type=file]");
  area.addEventListener("click", () => input.click());
  input.addEventListener("change", () => {
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        area.style.backgroundImage = `url(${e.target.result})`;
        area.style.backgroundSize = "cover";
        area.style.backgroundPosition = "center";
        area.querySelector(".reg-upload__placeholder").style.opacity = "0";
      };
      reader.readAsDataURL(input.files[0]);
    }
  });
});

// ── Paso 1 → Paso 2 (con validación) ─────────────────────────
document.getElementById("btn-continuar").addEventListener("click", () => {
  const nombre = document.getElementById("nombre").value.trim();
  const telefono = document.getElementById("telefono").value.trim();
  const dui = document.getElementById("dui").value.trim();
  const correo = document.getElementById("correo").value.trim();
  const password = document.getElementById("password").value;
  const confirm = document.getElementById("confirm-password").value;
  const departamento = document.getElementById("departamento").value.trim();
  const municipio = document.getElementById("municipio").value.trim();

  if (
    !nombre ||
    !telefono ||
    !dui ||
    !correo ||
    !password ||
    !departamento ||
    !municipio
  ) {
    Swal.fire({
      icon: "warning",
      title: "Campos incompletos",
      text: "Por favor completa todos los campos obligatorios.",
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

  // Guardar paso 1 temporalmente
  localStorage.setItem(
    "reg_step1",
    JSON.stringify({
      nombre_completo: nombre,
      telefono,
      dui,
      correo,
      password,
      departamento,
      municipio,
    }),
  );

  // Animación paso 1 → paso 2
  const step1 = document.getElementById("step-1");
  const step2 = document.getElementById("step-2");
  step1.classList.add("slide-out");
  setTimeout(() => {
    step1.classList.add("hidden");
    step1.classList.remove("slide-out");
    step2.classList.remove("hidden");
    step2.classList.add("slide-in");
    setTimeout(() => step2.classList.remove("slide-in"), 400);
  }, 300);
});

// ── Botón Back ────────────────────────────────────────────────
document.querySelector(".btn-back-reg").addEventListener("click", (e) => {
  e.preventDefault();
  const step1 = document.getElementById("step-1");
  const step2 = document.getElementById("step-2");
  step2.classList.add("slide-out");
  setTimeout(() => {
    step2.classList.add("hidden");
    step2.classList.remove("slide-out");
    step1.classList.remove("hidden");
    step1.classList.add("slide-in");
    setTimeout(() => step1.classList.remove("slide-in"), 400);
  }, 300);
});

// ── Registrarme (enviar a PostgreSQL) ────────────────────────
document
  .querySelector("#step-2 .btn-register")
  .addEventListener("click", async () => {
    const step1 = JSON.parse(localStorage.getItem("reg_step1"));

    if (!step1) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Vuelve al paso 1 e ingresa tus datos.",
        confirmButtonColor: "#f97316",
      });
      return;
    }

    const tipo = [];
    if (document.getElementById("check-artista").checked) tipo.push("artista");
    if (document.getElementById("check-oyente").checked) tipo.push("oyente");

    if (tipo.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Tipo de cuenta",
        text: "Selecciona al menos un tipo de cuenta.",
        confirmButtonColor: "#f97316",
      });
      return;
    }

    const objetivo = document.getElementById("objetivo").value;
    if (!objetivo) {
      Swal.fire({
        icon: "warning",
        title: "¿Qué buscas?",
        text: "Por favor selecciona qué buscas en DIMUSAL.",
        confirmButtonColor: "#f97316",
      });
      return;
    }

    const datos = {
      ...step1,
      tipo: tipo.join(","),
      nombre_artistico: document
        .getElementById("nombre-artistico")
        .value.trim(),
      portafolio: document.getElementById("portafolio").value.trim(),
      objetivo,
      spotify: document.querySelector('[name="spotify"]').value.trim(),
      instagram: document.querySelector('[name="instagram"]').value.trim(),
      youtube: document.querySelector('[name="youtube"]').value.trim(),
      tiktok: document.querySelector('[name="tiktok"]').value.trim(),
    };

    // Loading mientras registra
    Swal.fire({
      title: "Creando tu cuenta...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const res = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.removeItem("reg_step1");

        await Swal.fire({
          icon: "success",
          title: "¡Cuenta creada exitosamente!",
          text: "Tu cuenta fue creada correctamente. Ahora inicia sesión.",
          confirmButtonColor: "#f97316",
          timer: 2500,
          timerProgressBar: true,
          showConfirmButton: false,
          allowOutsideClick: false,
        });

        window.location.href = "login.html";
      } else {
        Swal.fire({
          icon: "error",
          title: "Error al registrar",
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

// ── Validación DUI ────────────────────────────────────────────
const duiInput = document.getElementById("dui");

duiInput.addEventListener("input", (e) => {
  let val = e.target.value.replace(/[^0-9-]/g, ""); // solo números y guión

  // Solo permitir un guión y que esté en la posición 8
  const partes = val.split("-");
  if (partes.length > 2) {
    val = partes[0] + "-" + partes.slice(1).join("");
  }

  // Limitar a 8 dígitos antes del guión
  if (partes[0].length > 8) {
    partes[0] = partes[0].slice(0, 8);
    val = partes.join("-");
  }

  // Limitar a 1 dígito después del guión
  if (partes[1] !== undefined && partes[1].length > 1) {
    partes[1] = partes[1].slice(0, 1);
    val = partes.join("-");
  }

  // Máximo 10 caracteres
  if (val.length > 10) val = val.slice(0, 10);

  e.target.value = val;
});

duiInput.addEventListener("keydown", (e) => {
  // Insertar guión automáticamente al llegar al dígito 9
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
