import { doc, setDoc } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "../src/firebase.js";

// Credenciales del profe (las mismas que creaste en Firebase Authentication)
const EMAIL_PROFE = "kwaltersamuel@gmail.com";
const PASSWORD_PROFE = "profesamu";

// 1. Definí la rutina con la misma estructura que creamos recién
const nuevaRutina = {
  dias: {
    dia1: [
      { nombre: "Press Banco Plano", detalle: "4x10" },
      { nombre: "Cruce de Poleas", detalle: "3x12" },
      { nombre: "Press Inclinado", detalle: "3x10" }
    ],
    dia2: [
      { nombre: "Dominadas", detalle: "4x8" },
      { nombre: "Remo con Barra", detalle: "4x10" },
      { nombre: "Jalón al Pecho", detalle: "3x12" }
    ],
    dia3: [
      { nombre: "Sentadillas", detalle: "4x10" },
      { nombre: "Prensa", detalle: "3x12" },
      { nombre: "Estocadas", detalle: "3x12 por pierna" }
    ]
  }
};

// 2. Definí el ID de la rutina (ejemplo: "hipertrofia_3dias_A")
const rutinaId = "fuerza_3dias_A"; // Cambiá esto según la rutina que quieras subir

async function subirRutina() {
  try {
    console.log("Iniciando sesión como profe...");
    await signInWithEmailAndPassword(auth, EMAIL_PROFE, PASSWORD_PROFE);

    console.log(`Subiendo rutina '${rutinaId}'...`);
    const ref = doc(db, "rutinas", rutinaId);

    // setDoc crea el documento o lo sobrescribe si ya existe
    await setDoc(ref, nuevaRutina);

    console.log("¡Rutina subida con éxito!");
    process.exit(0);
  } catch (error) {
    console.error("Error al subir la rutina:", error);
    process.exit(1);
  }
}

subirRutina();