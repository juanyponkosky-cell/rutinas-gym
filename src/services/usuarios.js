import { doc, getDoc, setDoc, updateDoc, deleteDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

/**
 * Busca un usuario por DNI en la colección "usuarios".
 * Devuelve null si no existe.
 */
export async function buscarUsuarioPorDni(dni) {
  const ref = doc(db, "usuarios", String(dni).trim());
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
  const ref = doc(db, "usuarios", String(dni).trim());
  await updateDoc(ref, { diaActual: proximoDia });
  return proximoDia;
}

/**
 * Crea un nuevo alumno en la colección "usuarios" copiando la plantilla elegida.
 * Lanza un error si el DNI ya existe.
 */
export async function crearAlumnoConPlantilla({ dni, nombre, rutinaId }) {
  const dniLimpio = String(dni).trim();
  
  const plantillaRef = doc(db, "rutinas", rutinaId);
  const plantillaSnap = await getDoc(plantillaRef);

  let ejerciciosPlantilla = {};
  if (plantillaSnap.exists()) {
    ejerciciosPlantilla = plantillaSnap.data();
  }

  const diasPlantilla = ejerciciosPlantilla.dias || {};
  // La cantidad de días se calcula a partir de las claves reales de la plantilla
  // (dia1, dia2, ...), no de un campo separado que podría no existir o desactualizarse.
  const cantidadDias = Object.keys(diasPlantilla).length || 3;

  const userRef = doc(db, "usuarios", dniLimpio);
  await setDoc(userRef, {
    nombre: nombre.toLowerCase().trim(),
    cantidadDias,
    diaActual: 1,
    rutinaId: rutinaId,
    rutina: diasPlantilla
  });

  return true;
}
/**
 * Sobreescribe la rutina personalizada de un alumno existente
 * (queda guardada en usuarios/{dni}.rutina, con prioridad sobre la plantilla).
 */
export async function actualizarRutinaAlumno(dni, rutina, cantidadDias) {
  const ref = doc(db, "usuarios", dni);
  await updateDoc(ref, { rutina, cantidadDias });
  return true;
}
/**
 * Guarda el mapa completo de pesos de un alumno.
 * Se guarda en usuarios/{dni}.pesos, separado de la rutina, para no pisar
 * la plantilla compartida ni mezclar pesos entre alumnos.
 * La clave de cada entrada es "{diaKey}::{nombreEjercicio}" (no la posición),
 * así el peso queda atado al ejercicio en sí y no se desalinea si el profe
 * reordena o agrega/quita ejercicios de ese día.
 */
export async function guardarPesosAlumno(dni, pesos) {
  const ref = doc(db, "usuarios", dni);
  await updateDoc(ref, { pesos });
  return true;
}

/**
 * Trae todos los alumnos, ordenados alfabéticamente por nombre
 * (el orden se hace en el cliente, no en la consulta a Firestore, para
 * que maneje bien acentos/mayúsculas y no dependa de un índice compuesto).
 */
export async function listarAlumnos() {
  const ref = collection(db, "usuarios");
  const snap = await getDocs(ref);
  const alumnos = snap.docs.map((d) => ({ dni: d.id, ...d.data() }));

  alumnos.sort((a, b) =>
    (a.nombre || "").localeCompare(b.nombre || "", "es", { sensitivity: "base" })
  );

  return alumnos;
}
/**
 * Elimina un alumno de forma definitiva. Requiere estar logueado como
 * profe (lo exige la regla de Firestore); no hay forma de deshacer esto.
 */
export async function eliminarAlumno(dni) {
  const ref = doc(db, "usuarios", dni);
  await deleteDoc(ref);
  return true;
}