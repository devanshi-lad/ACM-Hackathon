// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA1XqIc7BB2A92woDTd5M5FvHoGMBscYHo",
  authDomain: "trash-talker-ai.firebaseapp.com",
  projectId: "trash-talker-ai",
  storageBucket: "trash-talker-ai.firebasestorage.app",
  messagingSenderId: "949133782689",
  appId: "1:949133782689:web:3b025db0a54880f3874ae0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);