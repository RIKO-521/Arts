import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { auth } from "./firebase-init.js";
import {
  getContent, saveContent, getProjects, addProject, updateProject, deleteProject,
  uploadImage
} from "./site-data.js";

const loginScreen = document.getElementById("loginScreen");
const dashboard = document.getElementById("dashboard");

document.getElementById("loginBtn").onclick = async () => {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;
  const err = document.getElementById("loginError");
  err.textContent = "";
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (e) {
    err.textContent = "Couldn't log in — check your email and password.";
  }
};
document.getElementById("logoutBtn").onclick = () => signOut(auth);

let content = null;
let projects = [];

onAuthStateChanged(auth, async (user) => {
  if (user) {
    loginScreen.style.display = "none";
    dashboard.style.display = "block";
    content = await getContent();
    fillForms();
    await refreshProjectList();
  } else {
    loginScreen.style.display = "flex";
    dashboard.style.display = "none";
  }
});

function fillForms() {
  const h = content.hero, a = content.about, c = content.contact;
  document.getElementById("heroName").value = h.name || "";
  document.getElementById("heroTitle").value = h.title || "";
  document.getElementById("heroTagline").value = h.tagline || "";
  document.getElementById("heroProjectsCount").value = h.projectsCount || "";
  document.getElementById("heroClientsCount").value = h.clientsCount || "";
  document.getElementById("heroPhotoPreview").src = h.photoURL || "";

  document.getElementById("aboutTextInput").value = a.text || "";

  document.getElementById("contactEmail").value = c.email || "";
  document.getElementById("contactBook").value = c.bookLink || "";
  const socials = c.socials || [];
  ["soc1", "soc2", "soc3"].forEach((prefix, i) => {
    document.getElementById(prefix + "l").value = socials[i]?.label || "";
    document.getElementById(prefix + "u").value = socials[i]?.url || "";
  });
}

// ---- Hero ----
let pendingHeroFile = null;
document.getElementById("heroPhotoInput").onchange = (e) => {
  pendingHeroFile = e.target.files[0] || null;
  if (pendingHeroFile) document.getElementById("heroPhotoPreview").src = URL.createObjectURL(pendingHeroFile);
};
document.getElementById("saveHeroBtn").onclick = async () => {
  const status = document.getElementById("heroStatus");
  status.textContent = "Saving…";
  try {
    if (pendingHeroFile) {
      const path = `profile/photo-${Date.now()}-${pendingHeroFile.name}`;
      content.hero.photoURL = await uploadImage(pendingHeroFile, path);
      pendingHeroFile = null;
    }
    content.hero.name = document.getElementById("heroName").value.trim();
    content.hero.title = document.getElementById("heroTitle").value.trim();
    content.hero.tagline = document.getElementById("heroTagline").value.trim();
    content.hero.projectsCount = document.getElementById("heroProjectsCount").value.trim();
    content.hero.clientsCount = document.getElementById("heroClientsCount").value.trim();
    await saveContent({ hero: content.hero });
    status.textContent = "Saved. Visible on the site now.";
  } catch (e) {
    status.textContent = "Couldn't save: " + e.message;
  }
};

// ---- About ----
document.getElementById("saveAboutBtn").onclick = async () => {
  const status = document.getElementById("aboutStatus");
  status.textContent = "Saving…";
  try {
    content.about.text = document.getElementById("aboutTextInput").value;
    await saveContent({ about: content.about });
    status.textContent = "Saved. Visible on the site now.";
  } catch (e) {
    status.textContent = "Couldn't save: " + e.message;
  }
};

// ---- Contact ----
document.getElementById("saveContactBtn").onclick = async () => {
  const status = document.getElementById("contactStatus");
  status.textContent = "Saving…";
  try {
    content.contact.email = document.getElementById("contactEmail").value.trim();
    content.contact.bookLink = document.getElementById("contactBook").value.trim();
    content.contact.socials = ["soc1", "soc2", "soc3"].map(prefix => ({
      label: document.getElementById(prefix + "l").value.trim(),
      url: document.getElementById(prefix + "u").value.trim()
    })).filter(s => s.label && s.url);
    await saveContent({ contact: content.contact });
    status.textContent = "Saved. Visible on the site now.";
  } catch (e) {
    status.textContent = "Couldn't save: " + e.message;
  }
};

// ---- Projects ----
async function refreshProjectList() {
  projects = await getProjects();
  const box = document.getElementById("projList");
  box.innerHTML = projects.length ? projects.map(p => `
    <div class="proj-row">
      <img class="thumb" src="${p.cover || ""}">
      <div class="meta"><div class="t">${p.title || "Untitled"}</div><div class="c">${p.category || ""}</div></div>
      <div class="proj-actions">
        <button class="btn secondary" data-edit="${p.id}">Edit</button>
        <button class="btn danger" data-del="${p.id}">Delete</button>
      </div>
    </div>`).join("") : `<p style="color:#8A7261">No projects yet.</p>`;

  box.querySelectorAll("[data-edit]").forEach(b => b.onclick = () => openProjectEditor(b.dataset.edit));
  box.querySelectorAll("[data-del]").forEach(b => b.onclick = async () => {
    if (!confirm("Delete this project? This can't be undone.")) return;
    await deleteProject(b.dataset.del);
    await refreshProjectList();
  });
}

document.getElementById("addProjBtn").onclick = () => openProjectEditor(null);

function openProjectEditor(id) {
  const existing = id ? projects.find(p => p.id === id) : null;
  const modal = document.getElementById("projModal");
  modal.innerHTML = `
    <div class="modal-bg"><div class="modal">
      <h2>${existing ? "Edit" : "Add"} project</h2>
      <label>Title</label><input id="pmTitle" value="${existing?.title || ""}">
      <label>Category / tag</label><input id="pmCat" value="${existing?.category || ""}">
      <label>Cover image</label>
      <div class="row" style="align-items:center">
        <img class="thumb" id="pmCoverPreview" src="${existing?.cover || ""}">
        <input type="file" id="pmCoverInput" accept="image/*">
      </div>
      <label>Additional gallery images (optional, multiple allowed)</label>
      <input type="file" id="pmGalleryInput" accept="image/*" multiple>
      <div class="row" style="margin-top:20px">
        <button class="btn" id="pmSave">${existing ? "Save changes" : "Add project"}</button>
        <button class="btn secondary" id="pmCancel">Cancel</button>
      </div>
      <div class="status" id="pmStatus"></div>
    </div></div>`;

  let coverFile = null, galleryFiles = [];
  document.getElementById("pmCoverInput").onchange = (e) => {
    coverFile = e.target.files[0] || null;
    if (coverFile) document.getElementById("pmCoverPreview").src = URL.createObjectURL(coverFile);
  };
  document.getElementById("pmGalleryInput").onchange = (e) => {
    galleryFiles = Array.from(e.target.files);
  };
  document.getElementById("pmCancel").onclick = () => modal.innerHTML = "";

  document.getElementById("pmSave").onclick = async () => {
    const status = document.getElementById("pmStatus");
    status.textContent = "Saving…";
    const title = document.getElementById("pmTitle").value.trim();
    const category = document.getElementById("pmCat").value.trim();
    try {
      let docId = existing?.id;
      if (!docId) {
        const ref = await addProject({ title, category, cover: existing?.cover || "", gallery: existing?.gallery || [] });
        docId = ref.id;
      }
      const updates = { title, category };
      if (coverFile) {
        updates.cover = await uploadImage(coverFile, `projects/${docId}/cover-${Date.now()}-${coverFile.name}`);
      }
      if (galleryFiles.length) {
        const urls = [];
        for (const f of galleryFiles) {
          urls.push(await uploadImage(f, `projects/${docId}/gallery-${Date.now()}-${f.name}`));
        }
        updates.gallery = [...(existing?.gallery || []), ...urls];
      }
      await updateProject(docId, updates);
      modal.innerHTML = "";
      await refreshProjectList();
    } catch (e) {
      status.textContent = "Couldn't save: " + e.message;
    }
  };
}
