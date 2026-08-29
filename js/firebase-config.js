
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBk9V4xTSvcn8MO9vZzDBiMVge8W-btUgM",
  authDomain: "amigo-secreto-2026-bdb43.firebaseapp.com",
  projectId: "amigo-secreto-2026-bdb43",
  storageBucket: "amigo-secreto-2026-bdb43.firebasestorage.app",
  messagingSenderId: "660634212822",
  appId: "1:660634212822:web:1ff90d9b7188914752ac77",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
