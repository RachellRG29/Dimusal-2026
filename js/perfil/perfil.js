/* ══ perfil-artista.js ══ */

/* ── Tabs ── */
const tabs = document.querySelectorAll(".pa-tab");
const contents = document.querySelectorAll(".pa-tab-content");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    contents.forEach((c) => c.classList.remove("active"));
    tab.classList.add("active");
    const target = document.getElementById("tab-" + tab.dataset.tab);
    if (target) target.classList.add("active");
  });
});

/* ── User dropdown ── */
const userMenu = document.getElementById("userMenu");
const userDropdown = document.getElementById("userDropdown");

userMenu.addEventListener("click", (e) => {
  e.stopPropagation();
  userDropdown.classList.toggle("open");
});
document.addEventListener("click", () => userDropdown.classList.remove("open"));

/* ── Botón regresar ── */
document
  .getElementById("btnBack")
  .addEventListener("click", () => history.back());

/* ── Cambiar portada ── */
const editCover = document.getElementById("editCover");
const coverInput = document.getElementById("coverInput");
const coverImg = document.getElementById("coverImg");

editCover.addEventListener("click", () => coverInput.click());
coverInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  coverImg.src = url;
});

/* ── Cambiar avatar ── */
const editAvatar = document.getElementById("editAvatar");
const avatarInput = document.getElementById("avatarInput");
const avatarImg = document.getElementById("avatarImg");

editAvatar.addEventListener("click", () => avatarInput.click());
avatarInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  avatarImg.src = url;
});

/* ── Animar barras de progreso al cargar ── */
function animateBars() {
  document.querySelectorAll(".pa-progress__bar").forEach((bar) => {
    const target = bar.style.width;
    bar.style.width = "0";
    requestAnimationFrame(() => {
      setTimeout(() => {
        bar.style.width = target;
      }, 100);
    });
  });
}
animateBars();

/* ── Botones editar en cards (placeholder) ── */
document.querySelectorAll(".pa-card__edit-btn").forEach((btn) => {
  // Si ya tiene un onclick definido en el HTML, no agregar el placeholder
  if (btn.hasAttribute("onclick")) return;

  btn.addEventListener("click", () => {
    const card = btn.closest(".pa-card");
    const title =
      card.querySelector(".pa-card__title")?.textContent || "sección";
    alert(`Editar: ${title}\n(Conecta aquí tu modal o formulario de edición)`);
  });
});
