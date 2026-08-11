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
  try {
    const dniLimpio = String(dni).trim();

    // 1. Verificamos si el alumno ya existe para no sobrescribirlo
    const userRef = doc(db, "usuarios", dniLimpio);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      throw new Error("ELIMINAR_DUPLICADO");
    }

    // 2. Buscamos la plantilla en la colección 'rutinas'
    const plantillaRef = doc(db, "rutinas", rutinaId);
    const plantillaSnap = await getDoc(plantillaRef);

    let ejerciciosPlantilla = {};
    let cantidadDias = 3;

    if (plantillaSnap.exists()) {
      const data = plantillaSnap.data();
      ejerciciosPlantilla = data.dias || {};
      cantidadDias = data.cantidadDias || 3;
    } else {
      if (rutinaId === "fuerza_4dias") cantidadDias = 4;
      if (rutinaId === "acondicionamiento_2dias") cantidadDias = 2;
    }

    // 3. Guardamos el nuevo usuario
    await setDoc(userRef, {
      nombre: nombre.toLowerCase().trim(),
      cantidadDias: cantidadDias,
      diaActual: 1,
      rutinaId: rutinaId,
      rutina: ejerciciosPlantilla
    });

    return true;
  } catch (error) {
    console.error("Error al crear alumno en Firestore:", error);
    throw error;
  }
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