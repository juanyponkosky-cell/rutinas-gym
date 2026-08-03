import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

/**
 * Busca un usuario por DNI en la colección "usuarios".
 * Devuelve null si no existe.
 */
export async function buscarUsuarioPorDni(dni) {
  const ref = doc(db, "usuarios", dni);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    return null;
  }

  return { dni, ...snap.data() };
}

/**
 * Busca la plantilla de rutina correspondiente a un rutinaId.
 * Devuelve null si no existe.
 */
export async function buscarRutina(rutinaId) {
  const ref = doc(db, "rutinas", rutinaId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    return null;
  }

  return snap.data();
}

/**
 * Avanza el día actual del usuario en loop (1 -> 2 -> ... -> cantidadDias -> 1)
 */
export async function completarDia(dni, diaActual, cantidadDias) {
  const proximoDia = diaActual >= cantidadDias ? 1 : diaActual + 1;
  const ref = doc(db, "usuarios", dni);
  await updateDoc(ref, { diaActual: proximoDia });
  return proximoDia;
}
