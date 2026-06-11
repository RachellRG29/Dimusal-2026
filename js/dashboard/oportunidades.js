let currentCategory = "all";
let currentTag = "all";

function initOppPage() {
  const STORAGE_KEY = "dimusal_profile_tags";

  let userTags = [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored) {
      userTags = JSON.parse(stored);
    }
  } catch (err) {
    console.error(err);
  }

  const chipsContainer = document.getElementById("oppTagFilterChips");

  if (!chipsContainer) return;

  const allChip = `
    <button
      class="filter-tag-chip active"
      data-filter="all"
      onclick="filterByTag(this,'all')">
      Todos
    </button>
  `;

  const defaultTags = [
    "Rock",
    "Jazz",
    "Clásica",
    "Indie",
    "Alternativo",
    "Popular",
  ];

  const tags = userTags.length > 0 ? userTags : defaultTags;

  chipsContainer.innerHTML =
    allChip +
    tags
      .map(
        (tag) => `
        <button
          class="filter-tag-chip"
          data-filter="${tag}"
          onclick="filterByTag(this,'${tag}')">
          ${tag}
        </button>
      `,
      )
      .join("");

  updateOppCount();
}

function filterByTag(btn, tag) {
  document
    .querySelectorAll("#oppTagFilterChips .filter-tag-chip")
    .forEach((chip) => chip.classList.remove("active"));

  btn.classList.add("active");

  currentTag = tag;

  applyFilters();
}

function filterOpps() {
  const activeTab = document.querySelector("#filterTabs .tab.active");

  currentCategory = activeTab ? activeTab.dataset.category : "all";

  applyFilters();
}

function applyFilters() {
  const cards = document.querySelectorAll("#oppList .opp-card");

  let visible = 0;

  cards.forEach((card) => {
    const category = card.dataset.category || "";

    const tags = (card.dataset.tags || "").split(",").map((tag) => tag.trim());

    const matchCategory =
      currentCategory === "all" || category === currentCategory;

    const matchTag = currentTag === "all" || tags.includes(currentTag);

    const show = matchCategory && matchTag;

    card.style.display = show ? "" : "none";

    if (show) visible++;
  });

  const empty = document.getElementById("oppEmpty");

  if (empty) {
    empty.style.display = visible === 0 ? "flex" : "none";
  }

  updateOppCount(visible);
}

function updateOppCount(count) {
  const badge = document.getElementById("oppCountBadge");

  if (!badge) return;

  const total =
    count !== undefined
      ? count
      : document.querySelectorAll("#oppList .opp-card").length;

  badge.textContent = `${total} disponibles`;
}

function resetFiltros() {
  currentCategory = "all";
  currentTag = "all";

  document
    .querySelectorAll("#filterTabs .tab")
    .forEach((tab) => tab.classList.remove("active"));

  document
    .querySelector('#filterTabs .tab[data-category="all"]')
    ?.classList.add("active");

  document
    .querySelectorAll("#oppTagFilterChips .filter-tag-chip")
    .forEach((chip) => chip.classList.remove("active"));

  document
    .querySelector('#oppTagFilterChips [data-filter="all"]')
    ?.classList.add("active");

  applyFilters();
}
