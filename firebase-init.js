// Central Firebase setup. Every other script imports app/auth/db/storage from here.
// If you ever need to point this site at a different Firebase project, this is the only
// file you need to change.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBMMFeBqS8e_I0AbK-hZWDrz9sDa1Rwvqg",
  authDomain: "riko521-portfolio.firebaseapp.com",
  projectId: "riko521-portfolio",
  storageBucket: "riko521-portfolio.firebasestorage.app",
  messagingSenderId: "100892079526",
  appId: "1:100892079526:web:00eada923bfeda923a8b67"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
