// Central Firebase setup. Every other script imports app/auth/db/storage from here.
// If you ever need to point this site at a different Firebase project, this is the only
// file you need to change.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCUj2IhTNWEJwbQSrTTNxdfNJTYpxSnhbU",
  authDomain: "akshuto-portfolio.firebaseapp.com",
  projectId: "akshuto-portfolio",
  storageBucket: "akshuto-portfolio.firebasestorage.app",
  messagingSenderId: "289928580886",
  appId: "1:289928580886:web:832561b3a982a82dd14a37"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
