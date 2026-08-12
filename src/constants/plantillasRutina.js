// Lista de plantillas de rutina cargadas en Firestore (colección "rutinas").
// Se usa tanto para registrar un alumno nuevo como para reasignarle
// una plantilla distinta a uno existente.
export const PLANTILLAS_RUTINA = [
  {
    grupo: "3 días",
    opciones: [
      { id: "3dias_hombre_nivel1", etiqueta: "3 días · Hombre · Nivel 1" },
      { id: "3dias_hombre_nivel2", etiqueta: "3 días · Hombre · Nivel 2" },
      { id: "3dias_hombre_nivel3", etiqueta: "3 días · Hombre · Nivel 3" },
      { id: "3dias_mujer_nivel1", etiqueta: "3 días · Mujer · Nivel 1" },
      { id: "3dias_mujer_nivel2", etiqueta: "3 días · Mujer · Nivel 2" },
      { id: "3dias_mujer_nivel3", etiqueta: "3 días · Mujer · Nivel 3" },
      { id: "3dias_mujer_nivel4", etiqueta: "3 días · Mujer · Nivel 4" },
    ],
  },
  {
    grupo: "4 días",
    opciones: [
      { id: "4dias_hombre_nivel1", etiqueta: "4 días · Hombre · Nivel 1" },
      { id: "4dias_hombre_nivel2", etiqueta: "4 días · Hombre · Nivel 2" },
      { id: "4dias_hombre_nivel3", etiqueta: "4 días · Hombre · Nivel 3" },
      { id: "4dias_mujer_nivel1", etiqueta: "4 días · Mujer · Nivel 1" },
      { id: "4dias_mujer_nivel2", etiqueta: "4 días · Mujer · Nivel 2" },
      { id: "4dias_mujer_nivel3", etiqueta: "4 días · Mujer · Nivel 3" },
    ],
  },
  {
    grupo: "5 días",
    opciones: [
      { id: "5dias_hombre_nivel1", etiqueta: "5 días · Hombre · Nivel 1" },
      { id: "5dias_hombre_nivel2", etiqueta: "5 días · Hombre · Nivel 2" },
      { id: "5dias_mujer_nivel1", etiqueta: "5 días · Mujer · Nivel 1" },
      { id: "5dias_mujer_nivel2", etiqueta: "5 días · Mujer · Nivel 2" },
      { id: "5dias_mujer_nivel3", etiqueta: "5 días · Mujer · Nivel 3" },
      { id: "5dias_mujer_nivel4", etiqueta: "5 días · Mujer · Nivel 4" },
      { id: "5dias_mujer_nivel5", etiqueta: "5 días · Mujer · Nivel 5" },
    ],
  },
];