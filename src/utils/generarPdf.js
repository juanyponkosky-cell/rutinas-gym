import { jsPDF } from "jspdf";

const AMARILLO = [245, 196, 0];
const NEGRO = [20, 20, 20];
const GRIS = [110, 110, 110];

/**
 * Genera y descarga un PDF con la rutina completa de un alumno
 * (todos los días, con series/reps y el último peso registrado).
 */
export function descargarRutinaPdf(usuario, rutinaCompleta, pesos) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const margenX = 18;
  const anchoUtil = 210 - margenX * 2;
  let y = 22;

  // --- Encabezado ---
  doc.setFillColor(...NEGRO);
  doc.rect(0, 0, 210, 34, "F");

  doc.setFillColor(...AMARILLO);
  doc.circle(24, 17, 9, "F");
  doc.setTextColor(...NEGRO);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("FTS", 24, 19.5, { align: "center" });

  doc.setTextColor(...AMARILLO);
  doc.setFontSize(14);
  doc.text("FUNTRAINSPORTS", 40, 15);
  doc.setTextColor(230, 230, 230);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Rutina de entrenamiento", 40, 21);

  y = 44;

  // --- Datos del alumno ---
  doc.setTextColor(...NEGRO);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(usuario.nombre, margenX, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...GRIS);
  doc.text(`DNI: ${usuario.dni}`, margenX, y + 6);
  doc.text(
    `Rutina de ${usuario.cantidadDias} días · día actual: ${usuario.diaActual}`,
    margenX,
    y + 11
  );
  doc.text(
    `Generado el ${new Date().toLocaleDateString("es-AR")}`,
    210 - margenX,
    y + 6,
    { align: "right" }
  );

  y += 20;

  const diasArray = Array.from(
    { length: usuario.cantidadDias },
    (_, i) => `dia${i + 1}`
  );

  diasArray.forEach((diaKey, i) => {
    const numeroDia = i + 1;
    const ejerciciosDia = rutinaCompleta[diaKey] || [];

    if (y > 265) {
      doc.addPage();
      y = 22;
    }

    doc.setFillColor(...AMARILLO);
    doc.rect(margenX, y - 5, anchoUtil, 8, "F");
    doc.setTextColor(...NEGRO);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(`DÍA ${numeroDia}`, margenX + 3, y);
    y += 9;

    if (ejerciciosDia.length === 0) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9.5);
      doc.setTextColor(...GRIS);
      doc.text("Sin ejercicios cargados.", margenX + 3, y);
      y += 8;
    } else {
      ejerciciosDia.forEach((ej, idx) => {
        if (y > 275) {
          doc.addPage();
          y = 22;
        }

        const claveEjercicio = `${diaKey}::${(ej.nombre || "").trim().toLowerCase()}`;
        const pesoGuardado = pesos?.[claveEjercicio];

        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(...NEGRO);
        doc.text(`•  ${ej.nombre}`, margenX + 3, y);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9.5);
        doc.setTextColor(...GRIS);
        doc.text(ej.detalle || "", margenX + 8, y + 4.5);

        if (pesoGuardado) {
          doc.setTextColor(150, 110, 0);
          doc.setFont("helvetica", "bold");
          doc.text(`Último peso: ${pesoGuardado}`, 210 - margenX, y, { align: "right" });
        }

        y += 9;
      });
    }

    y += 4;
  });

  const nombreArchivo = `rutina-${usuario.nombre.replace(/\s+/g, "-").toLowerCase()}.pdf`;
  doc.save(nombreArchivo);
}