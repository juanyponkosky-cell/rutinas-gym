import { useState } from "react";
import { guardarPesosAlumno } from "../services/usuarios";

// Normaliza el nombre del ejercicio para usarlo como parte de la clave,
// así "Press Banca" y "press banca " apuntan al mismo peso guardado.
function normalizarNombre(nombre) {
  return (nombre || "").trim().toLowerCase();
}

function claveDePeso(diaKey, nombreEjercicio) {
  return `${diaKey}::${normalizarNombre(nombreEjercicio)}`;
}

export default function RutinaDelDia({
  usuario,
  ejercicios,
  rutinaCompleta,
  onCompletar,
  completando,
  onVolver,
}) {
  const [verCompleta, setVerCompleta] = useState(false);
  const [pesos, setPesos] = useState(usuario.pesos || {});

  const diasArray = Array.from(
    { length: usuario.cantidadDias },
    (_, i) => `dia${i + 1}`
  );

  function handleCambiarPeso(claveEjercicio, valor) {
    setPesos((prev) => ({ ...prev, [claveEjercicio]: valor }));
  }

  function handleGuardarPeso(claveEjercicio, valor) {
    const pesosActualizados = { ...pesos, [claveEjercicio]: valor };
    guardarPesosAlumno(usuario.dni, pesosActualizados).catch((err) => {
      console.error("No se pudo guardar el peso:", err);
    });
  }

  function renderEjercicio(ej, diaKey, index) {
    const claveEjercicio = claveDePeso(diaKey, ej.nombre);
    return (
      <div className="ejercicio" key={`${diaKey}_${index}`}>
        <p className="ejercicio-nombre">{ej.nombre}</p>
        <p className="ejercicio-detalle">{ej.detalle}</p>
        <div className="ejercicio-peso">
          <label>Peso usado</label>
          <input
            type="text"
            placeholder="Ej: 20kg"
            value={pesos[claveEjercicio] || ""}
            onChange={(e) => handleCambiarPeso(claveEjercicio, e.target.value)}
            onBlur={(e) => handleGuardarPeso(claveEjercicio, e.target.value)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="pantalla">
      <div className="card">
        <div className="header-rutina">
          <div className="logo-fts logo-chico">FTS</div>
          <div>
            <p className="saludo">Hola,</p>
            <p className="nombre">{usuario.nombre}</p>
          </div>
        </div>

        <span className="badge-dia">
          Día {usuario.diaActual} de {usuario.cantidadDias}
        </span>

        {!verCompleta ? (
          <>
            {ejercicios.length === 0 ? (
              <p className="sin-ejercicios">
                No encontramos ejercicios cargados para este día. Consultá con tu profe.
              </p>
            ) : (
              <div className="lista-ejercicios">
                {ejercicios.map((ej, i) =>
                  renderEjercicio(ej, `dia${usuario.diaActual}`, i)
                )}
              </div>
            )}
          </>
        ) : (
          <div className="rutina-completa">
            {diasArray.map((diaKey, i) => {
              const numeroDia = i + 1;
              const ejerciciosDia = rutinaCompleta[diaKey] || [];
              const esHoy = numeroDia === usuario.diaActual;

              return (
                <div className="bloque-dia" key={diaKey}>
                  <p className={esHoy ? "bloque-dia-titulo hoy" : "bloque-dia-titulo"}>
                    Día {numeroDia} {esHoy && "· hoy"}
                  </p>

                  {ejerciciosDia.length === 0 ? (
                    <p className="sin-ejercicios" style={{ marginBottom: "12px" }}>
                      Sin ejercicios cargados.
                    </p>
                  ) : (
                    <div className="lista-ejercicios" style={{ marginBottom: "16px" }}>
                      {ejerciciosDia.map((ej, idx) =>
                        renderEjercicio(ej, diaKey, idx)
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <button
          type="button"
          className="btn-ver-completa"
          onClick={() => setVerCompleta((prev) => !prev)}
        >
          {verCompleta ? "Ver solo el día de hoy" : "Ver rutina completa"}
        </button>

        <button
          className="btn-completar"
          onClick={onCompletar}
          disabled={completando}
        >
          {completando ? "Guardando..." : "✓ Completé este día"}
        </button>

        <button className="btn-volver" onClick={onVolver}>
          Volver
        </button>
      </div>
    </div>
  );
}