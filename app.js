/* ========================================
   DIRTY TAG LINKTREE — APP.JS
   ======================================== */

// ============================================
// DATA MODEL — Modifica qui i tuoi link
// ============================================
const PROFILE = {
  name: "DIRTY TAG",
  bio: "Find it. Love it. Get it Dirty Again.",
  avatar: "images/logo.png"
};

const LINKS = [
  {
    id: "vinted-mannequin",
    label: "Vinted Mannequin",
    url: "https://www.vinted.it/member/212733559",
    categories: ["general", "shop"],
    icon: "tag"
  },
  {
    id: "vinted-worn",
    label: "Vinted Worn Pics",
    url: "https://www.vinted.it/member/249872468",
    categories: ["shop"],
    icon: "tag"
  },
  {
    id: "vestiaire",
    label: "Vestiaire Collective",
    url: "https://www.vestiairecollective.com/profile/14768643",
    categories: ["general", "shop"],
    icon: "shopping-bag"
  },
  {
    id: "catawiki",
    label: "Aste Catawiki",
    url: "https://www.catawiki.com/it/u/25629511-dirty-tag",
    categories: ["shop"],
    icon: "gavel"
  },
  {
    id: "instagram",
    label: "Instagram",
    url: "https://www.instagram.com/dirty_tag/",
    categories: ["general", "social"],
    icon: "instagram"
  },
  {
    id: "tiktok",
    label: "TikTok",
    url: "https://www.tiktok.com/@dirty.tag",
    categories: ["social"],
    icon: "video"
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    url: "https://wa.me/393204719277",
    categories: ["general", "contatti"],
    icon: "message-circle"
  },
  {
    id: "email",
    label: "Email",
    url: "mailto:info.dirtytag@gmail.com",
    categories: ["contatti"],
    icon: "mail"
  }
];

const CATEGORIES = [
  { id: "general", label: "Generale" },
  { id: "shop", label: "Shop" },
  { id: "social", label: "Social" },
  { id: "contatti", label: "Contatti" }
];

// ============================================
// ICONS — SVG inline (no dipendenze esterne)
// ============================================
const ICONS = {
  "shopping-bag": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,
  "tag": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>`,
  "instagram": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`,
  "video": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>`,
  "mail": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
  "link": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
  "arrow-right": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`
};

// ============================================
// STATE
// ============================================
let activeCategory = "general";
let clickCounts = {}; 

// ============================================
// DOM ELEMENTS
// ============================================
const $loading = document.getElementById("loading");
const $content = document.getElementById("content");
const $avatar = document.getElementById("avatar");
const $profileName = document.getElementById("profile-name");
const $profileBio = document.getElementById("profile-bio");
const $categoryFilter = document.getElementById("category-filter");
const $linksContainer = document.getElementById("links-container");
const $emptyState = document.getElementById("empty-state");
const $themeToggle = document.getElementById("theme-toggle");
const $iconSun = document.getElementById("icon-sun");
const $iconMoon = document.getElementById("icon-moon");
const $toast = document.getElementById("toast");
const $toastMessage = document.getElementById("toast-message");

// ============================================
// UTILITIES
// ============================================
function getIcon(name) {
  return ICONS[name] || ICONS["link"];
}

function showToast(message, duration = 3000) {
  $toastMessage.textContent = message;
  $toast.classList.remove("hidden");
  $toast.classList.add("visible");
  
  setTimeout(() => {
    $toast.classList.remove("visible");
    setTimeout(() => $toast.classList.add("hidden"), 300);
  }, duration);
}

function loadClickCounts() {
  try {
    const stored = localStorage.getItem("dirtytag_clicks");
    clickCounts = stored ? JSON.parse(stored) : {};
  } catch {
    clickCounts = {};
  }
}

function saveClickCounts() {
  try {
    localStorage.setItem("dirtytag_clicks", JSON.stringify(clickCounts));
  } catch {
    // localStorage non disponibile, ignora
  }
}

function incrementClick(linkId) {
  clickCounts[linkId] = (clickCounts[linkId] || 0) + 1;
  saveClickCounts();
}

// ============================================
// THEME
// ============================================
function getPreferredTheme() {
  const stored = localStorage.getItem("dirtytag_theme");
  if (stored) return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("dirtytag_theme", theme);
  
  if (theme === "dark") {
    $iconSun.classList.add("hidden");
    $iconMoon.classList.remove("hidden");
  } else {
    $iconSun.classList.remove("hidden");
    $iconMoon.classList.add("hidden");
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme") || "light";
  setTheme(current === "light" ? "dark" : "light");
}

// ============================================
// RENDER FUNCTIONS
// ============================================
function renderProfile() {
  $avatar.src = PROFILE.avatar;
  $avatar.alt = `${PROFILE.name} profile picture`;
  $profileName.textContent = PROFILE.name;
  $profileBio.textContent = PROFILE.bio;
}

function renderCategories() {
  $categoryFilter.innerHTML = "";
  
  CATEGORIES.forEach(cat => {
    const chip = document.createElement("button");
    chip.className = "category-chip";
    chip.textContent = cat.label;
    chip.setAttribute("aria-pressed", cat.id === activeCategory);
    chip.dataset.category = cat.id;
    
    if (cat.id === activeCategory) {
      chip.classList.add("active");
    }
    
    chip.addEventListener("click", () => {
      // Use hash to enable deep-linking and browser history
      const currentHash = location.hash.replace('#','') || 'all';
      if (currentHash !== cat.id) {
        location.hash = cat.id;
      } else {
        // If already on same hash, re-render to keep UI consistent
        renderCategories();
        renderLinks();
      }
    });
    
    $categoryFilter.appendChild(chip);
  });
}

function renderLinks() {
  // Filtra link per categoria (supporta array di categories)
  const filteredLinks = LINKS.filter(link => {
    const cats = Array.isArray(link.categories) ? link.categories : (link.categories ? [link.categories] : []);
    return cats.includes(activeCategory);
  });
  
  // Valida link (deve avere URL)
  const validLinks = filteredLinks.filter(link => {
    if (!link.url || link.url.trim() === "") {
      showToast(`Errore: il link "${link.label}" non ha un URL valido`);
      return false;
    }
    return true;
  });
  
  // Mostra empty state se necessario
  if (validLinks.length === 0) {
    $linksContainer.classList.add("hidden");
    $emptyState.classList.remove("hidden");
    return;
  }
  
  $linksContainer.classList.remove("hidden");
  $emptyState.classList.add("hidden");
  
  // Render cards
  $linksContainer.innerHTML = "";
  
  validLinks.forEach(link => {
    const card = document.createElement("a");
    card.className = "link-card";
    card.href = link.url;
    card.target = "_blank";
    card.rel = "noopener noreferrer";
    
    const clicks = clickCounts[link.id] || 0;
    
    card.innerHTML = `
      <span class="link-card-icon" aria-hidden="true">${getIcon(link.icon)}</span>
      <span class="link-card-label">${link.label}</span>
      <span class="link-card-arrow" aria-hidden="true">${getIcon("arrow-right")}</span>
    `;
    
    // No click tracking UI: clicking the card opens the link in a new tab without showing a badge.
    
    $linksContainer.appendChild(card);
  });
}

// ============================================
// INIT
// ============================================
function init() {
  // Carica stato persistente
  loadClickCounts();
  setTheme(getPreferredTheme());

  // Sync initial category from URL hash (deep-linking)
  const initHash = (location.hash || '').replace('#','');
  if (initHash && CATEGORIES.some(c => c.id === initHash)) {
    activeCategory = initHash;
  }

  // React to hash changes (back/forward + manual edits)
  window.addEventListener('hashchange', () => {
    const newHash = (location.hash || '').replace('#','') || 'general';
    if (newHash !== activeCategory && CATEGORIES.some(c => c.id === newHash)) {
      activeCategory = newHash;
      renderCategories();
      renderLinks();
    }
  });
  
  // Simula loading (300ms)
  setTimeout(() => {
    $loading.classList.add("hidden");
    $content.classList.remove("hidden");
    
    renderProfile();
    renderCategories();
    renderLinks();
  }, 300);
  
  // Event listeners
  $themeToggle.addEventListener("click", toggleTheme);
  
  // Ascolta cambiamenti preferenza sistema
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    if (!localStorage.getItem("dirtytag_theme")) {
      setTheme(e.matches ? "dark" : "light");
    }
  });
}

// Start
document.addEventListener("DOMContentLoaded", init);
