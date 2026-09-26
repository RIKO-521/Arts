// Every read/write to Firestore or Storage goes through these functions,
// so both the public pages and admin.js share one source of truth.
import {
  doc, getDoc, setDoc, collection, getDocs, addDoc, updateDoc, deleteDoc, query, orderBy
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import {
  ref, uploadBytes, getDownloadURL, deleteObject
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js";
import { db, storage } from "./firebase-init.js";

export const DEFAULT_CONTENT = {
  hero: {
    name: "Your Name",
    title: "Creative Professional",
    tagline: "Welcome to my portfolio — log into /admin.html to make this page yours.",
    projectsCount: "0",
    clientsCount: "0",
    photoURL: ""
  },
  about: {
    text: "Tell visitors who you are, what you do, and what you're looking for. Edit this from the admin page."
  },
  contact: {
    email: "you@example.com",
    bookLink: "",
    socials: []
  }
};

export async function getContent() {
  const snap = await getDoc(doc(db, "content", "main"));
  return snap.exists() ? { ...DEFAULT_CONTENT, ...snap.data() } : DEFAULT_CONTENT;
}

export async function saveContent(data) {
  await setDoc(doc(db, "content", "main"), data, { merge: true });
}

export async function getProjects() {
  const q = query(collection(db, "projects"), orderBy("order", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function addProject(data) {
  return addDoc(collection(db, "projects"), { ...data, order: Date.now() });
}

export async function updateProject(id, data) {
  return updateDoc(doc(db, "projects", id), data);
}

export async function deleteProject(id) {
  return deleteDoc(doc(db, "projects", id));
}

/** Uploads a single image file to Storage under `path` and returns its public URL. */
export async function uploadImage(file, path) {
  const r = ref(storage, path);
  await uploadBytes(r, file);
  return getDownloadURL(r);
}

/** Best-effort delete; ignores errors (e.g. file already gone). */
export async function deleteImage(path) {
  try { await deleteObject(ref(storage, path)); } catch (e) { /* ignore */ }
}
