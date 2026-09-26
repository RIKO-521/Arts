// Optional, minimal page-view counter. Fails silently and never blocks
// the page. Delete this file's import in script.js and the "analytics"
// rule in firestore.rules if you don't want it.
import { doc, setDoc, increment } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { db } from "./firebase-init.js";

export function trackView(pageName) {
  try {
    setDoc(
      doc(db, "analytics", "views"),
      { [pageName]: increment(1), total: increment(1) },
      { merge: true }
    ).catch(() => {});
  } catch (e) { /* ignore */ }
}
