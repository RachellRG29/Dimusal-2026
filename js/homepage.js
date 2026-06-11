const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  mobileMenu.classList.toggle("open");
});

mobileMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("open");
    mobileMenu.classList.remove("open");
  });
});

document.addEventListener("click", (e) => {
  if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
    hamburger.classList.remove("open");
    mobileMenu.classList.remove("open");
  }
});

// al redimensionar a desktop, cerrar el menú y limpiar clases
window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    hamburger.classList.remove("open");
    mobileMenu.classList.remove("open");
  }
});

(function () {
  const hero = document.querySelector(".hero");
  if (!hero) return;

  const TRIGGER_END = 220; // px de scroll hasta expansión total

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }
  function ease(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  // Lee el margen inicial del CSS (ej: "1rem 1.25rem" → 20px)
  const styleMargin = parseFloat(getComputedStyle(hero).marginLeft); // en px

  window.addEventListener(
    "scroll",
    () => {
      const t = Math.min(1, Math.max(0, window.scrollY / TRIGGER_END));
      const e = ease(t);

      const margin = lerp(styleMargin, 0, e);
      const radius = lerp(20, 0, e);

      hero.style.margin = `${lerp(parseFloat(getComputedStyle(hero).marginTop), 0, e)}px ${margin}px`;
      hero.style.borderRadius = `${radius}px`;
    },
    { passive: true },
  );
})();
