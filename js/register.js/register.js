// ── Toggle eye icons ──
document.querySelectorAll(".reg-field__eye").forEach((eye) => {
  eye.addEventListener("click", () => {
    const targetId = eye.dataset.target;
    const input = document.getElementById(targetId);
    const isPass = input.type === "password";
    input.type = isPass ? "text" : "password";
    eye.querySelector("svg").style.opacity = isPass ? "0.5" : "1";
  });
});

// ── Paso 1 → Paso 2 ──
document.getElementById("btn-continuar").addEventListener("click", () => {
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

// ── Upload areas ──
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
