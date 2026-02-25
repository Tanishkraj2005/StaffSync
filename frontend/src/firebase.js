import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBNowEfRB57sWuNVpszFdZIg_9rFE0rG6A",
  authDomain: "leave-management-system-15885.firebaseapp.com",
  projectId: "leave-management-system-15885",
  storageBucket: "leave-management-system-15885.firebasestorage.app",
  messagingSenderId: "449663271910",
  appId: "1:449663271910:web:dab4e95474cf7fe85dcc27"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();