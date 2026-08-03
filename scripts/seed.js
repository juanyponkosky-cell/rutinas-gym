// Script para cargar datos de PRUEBA en Firestore.
// Correr con: node scripts/seed.js
// Requiere que src/firebase.js ya tenga tu firebaseConfig real.

import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Pegá acá el mismo firebaseConfig que tenés en src/firebase.js
const firebaseConfig = {
  apiKey: "AIzaSyD8bXFIKK9lENsf2wS0iWunCYodKTQw8Mg",
  authDomain: "proyecto-5825e.firebaseapp.com",
  projectId: "proyecto-5825e",
  storageBucket: "proyecto-5825e.firebasestorage.app",
  messagingSenderId: "750542649836",
  appId: "1:750542649836:web:00d541db32cea97b57a8c9",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seed() {
  // --- Rutina de ejemplo: 3 días, full body ---
  await setDoc(doc(db, "rutinas", "fullbody_3dias_A"), {
    dias: {
      dia1: [
        { nombre: "Sentadilla", detalle: "4 series x 10 reps" },
        { nombre: "Press banca", detalle: "3 series x 12 reps" },
        { nombre: "Remo bajo", detalle: "3 series x 10 reps" },
      ],
      dia2: [
        { nombre: "Peso muerto", detalle: "4 series x 8 reps" },
        { nombre: "Press militar", detalle: "3 series x 10 reps" },
        { nombre: "Dominadas asistidas", detalle: "3 series x 8 reps" },
      ],
      dia3: [
        { nombre: "Prensa de piernas", detalle: "4 series x 12 reps" },
        { nombre: "Press inclinado mancuernas", detalle: "3 series x 12 reps" },
        { nombre: "Jalón al pecho", detalle: "3 series x 10 reps" },
      ],
    },
  });

  // --- Usuario de prueba ---
  await setDoc(doc(db, "usuarios", "12345678"), {
    nombre: "Juan Pérez",
    rutinaId: "fullbody_3dias_A",
    diaActual: 1,
    cantidadDias: 3,
  });

  console.log("Datos de prueba cargados con éxito.");
  console.log("Probá con el DNI: 12345678");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Error al cargar datos:", err);
  process.exit(1);
});
