import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD8bXFIKK9lENsf2wS0iWunCYodKTQw8Mg",
  authDomain: "proyecto-5825e.firebaseapp.com",
  projectId: "proyecto-5825e",
  storageBucket: "proyecto-5825e.firebasestorage.app",
  messagingSenderId: "750542649836",
  appId: "1:750542649836:web:00d541db32cea97b57a8c9",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
