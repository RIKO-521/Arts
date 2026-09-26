import { getContent, getProjects } from "./site-data.js";
import { trackView } from "./tracker.js";

export function initChrome(pageName) {
  document.getElementById("year") && (document.getElementById("year").textContent = new Date().getFullYear());
  document.querySelectorAll(".navlinks a").forEach(a => {
    if (a.dataset.page === pageName) a.classList.add("current");
  });
  trackView(pageName);
}

export function renderHero(content) {
  const h = content.hero;
  const nameEls = document.querySelectorAll("[data-field='hero.name']");
  nameEls.forEach(el => el.textContent = h.name);
  const set = (sel, val) => document.querySelectorAll(sel).forEach(el => el.textContent = val);
  set("[data-field='hero.title']", h.title);
  set("[data-field='hero.tagline']", h.tagline);
  set("[data-field='hero.projectsCount']", h.projectsCount);
  set("[data-field='hero.clientsCount']", h.clientsCount);
  const photoWrap = document.getElementById("heroPhotoWrap");
  if (photoWrap) {
    photoWrap.innerHTML = h.photoURL
      ? `<img src="${h.photoURL}" alt="${h.name}">`
      : `<div class="hero-avatar-fallback">${(h.name || "?").trim().slice(0, 1).toUpperCase()}</div>`;
  }
  document.title = h.name ? `${h.name} — Portfolio` : "Portfolio";
}

export function renderAbout(content) {
  const el = document.getElementById("aboutText");
  if (el) el.textContent = content.about.text;
}

export function renderContact(content) {
  const c = content.contact;
  const emailLink = document.getElementById("emailLink");
  if (emailLink) {
    emailLink.textContent = c.email;
    emailLink.href = "mailto:" + c.email;
  }
  const book = document.getElementById("bookLink");
  if (book) {
    if (c.bookLink) { book.href = c.bookLink; book.style.display = ""; }
    else { book.style.display = "none"; }
  }
  const socials = document.getElementById("socials");
  if (socials) {
    socials.innerHTML = (c.socials || [])
      .filter(s => s.label && s.url)
      .map(s => `<a href="${s.url}" target="_blank" rel="noopener">${s.label}</a>`)
      .join("");
  }
}

let allProjects = [];
let activeCategory = "All";

export async function renderProjectsPage() {
  allProjects = await getProjects();
  renderChips();
  renderGrid();
}

function categories() {
  return [...new Set(allProjects.map(p => p.category).filter(Boolean))];
}

function renderChips() {
  const chips = document.getElementById("chips");
  if (!chips) return;
  const cats = ["All", ...categories()];
  chips.innerHTML = cats.map(c =>
    `<div class="chip ${c === activeCategory ? "active" : ""}" data-cat="${c}">${c}</div>`
  ).join("");
  chips.querySelectorAll(".chip").forEach(el => el.onclick = () => {
    activeCategory = el.dataset.cat;
    renderChips();
    renderGrid();
  });
}

function renderGrid() {
  const grid = document.getElementById("grid");
  if (!grid) return;
  const list = allProjects.filter(p => activeCategory === "All" || p.category === activeCategory);
  if (!list.length) {
    grid.innerHTML = `<p class="empty-note">No projects yet.</p>`;
    return;
  }
  grid.innerHTML = list.map(p => `
    <div class="card" data-id="${p.id}">
      <img src="${p.cover || ""}" alt="${p.title || ""}">
      <div class="cbody">
        <div class="ctag">${p.category || ""}</div>
        <h3>${p.title || "Untitled"}</h3>
      </div>
    </div>`).join("");
  grid.querySelectorAll(".card").forEach(el => el.onclick = () => openProjectModal(el.dataset.id));
}

function openProjectModal(id, list = allProjects) {
  const p = list.find(pr => pr.id === id);
  if (!p) return;
  const images = [p.cover, ...(p.gallery || [])].filter(Boolean);
  const modal = document.getElementById("projModal");
  modal.innerHTML = `
    <div class="modal-bg">
      <div class="modal">
        <button class="close-x" id="pmClose">✕</button>
        <h2 class="sectitle">${p.title || ""}</h2>
        <div class="ctag">${p.category || ""}</div>
        ${images.map(src => `<img src="${src}">`).join("")}
      </div>
    </div>`;
  document.getElementById("pmClose").onclick = () => modal.innerHTML = "";
}

export async function loadSharedContent() {
  return getContent();
}

export async function renderHomeProjects() {
  const grid = document.getElementById("homeGrid");
  if (!grid) return;
  const projects = await getProjects();
  if (!projects.length) {
    grid.innerHTML = `<p class="empty-note">No projects yet.</p>`;
    return;
  }
  grid.innerHTML = projects.map(p => `
    <div class="card" data-id="${p.id}">
      <img src="${p.cover || ""}" alt="${p.title || ""}">
      <div class="cbody">
        <div class="ctag">${p.category || ""}</div>
        <h3>${p.title || "Untitled"}</h3>
      </div>
    </div>`).join("");
  grid.querySelectorAll(".card").forEach(el => el.onclick = () => openProjectModal(el.dataset.id, projects));
}
