const inputs = [
  document.getElementById("d1"),
  document.getElementById("d2"),
  document.getElementById("d3"),
  document.getElementById("d4"),
];

// Mostrar correo
const datos = JSON.parse(localStorage.getItem("reg_pendiente"));
if (!datos) window.location.href = "register.html";
document.getElementById("correo-display").textContent = datos.correo;

// Auto-focus entre inputs
inputs.forEach((input, i) => {
  input.addEventListener("input", () => {
    input.value = input.value.replace(/[^0-9]/g, "");
    if (input.value && i < 3) inputs[i + 1].focus();
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Backspace" && !input.value && i > 0) inputs[i - 1].focus();
  });
});

// Verificar código
document.getElementById("btn-verificar").addEventListener("click", async () => {
  const codigo = inputs.map((i) => i.value).join("");

  if (codigo.length < 4) {
    Swal.fire({
      icon: "warning",
      title: "Código incompleto",
      text: "Ingresa los 4 dígitos del código.",
      confirmButtonColor: "#f97316",
    });
    return;
  }

  Swal.fire({
    title: "Verificando...",
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading(),
  });

  // Verificar código
  const resVerif = await fetch("http://localhost:3000/api/verificar-codigo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ correo: datos.correo, codigo }),
  });
  const dataVerif = await resVerif.json();

  if (!dataVerif.success) {
    Swal.fire({
      icon: "error",
      title: "Código incorrecto",
      text: dataVerif.mensaje,
      confirmButtonColor: "#f97316",
    });
    return;
  }

  // Código correcto → registrar usuario
  const resReg = await fetch("http://localhost:3000/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
  const dataReg = await resReg.json();

  if (dataReg.success) {
    localStorage.removeItem("reg_pendiente");
    await Swal.fire({
      icon: "success",
      title: "¡Cuenta creada!",
      text: "Tu correo fue verificado exitosamente.",
      confirmButtonColor: "#f97316",
      timer: 2500,
      timerProgressBar: true,
      showConfirmButton: false,
    });
    window.location.href = "login.html";
  } else {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: dataReg.mensaje,
      confirmButtonColor: "#f97316",
    });
  }
});

// Reenviar código
document.getElementById("btn-reenviar").addEventListener("click", async () => {
  const res = await fetch("http://localhost:3000/api/enviar-codigo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      correo: datos.correo,
      nombre: datos.nombre_completo,
    }),
  });
  const data = await res.json();

  Swal.fire({
    icon: data.success ? "success" : "error",
    title: data.success ? "Código reenviado" : "Error",
    text: data.success ? "Revisa tu correo." : data.mensaje,
    confirmButtonColor: "#f97316",
    timer: 2000,
    timerProgressBar: true,
    showConfirmButton: false,
  });
});
