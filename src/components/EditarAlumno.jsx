import { useState, useEffect } from "react";
import { buscarUsuarioPorDni, buscarRutina, actualizarRutinaAlumno } from "../services/usuarios";

export function EditarAlumno({ dniPreset }) {
  const [dniBusqueda, setDniBusqueda] = useState(dniPreset || "");
  const [buscando, setBuscando] = useState(false);
  const [errorBusqueda, setErrorBusqueda] = useState("");

  const [alumno, setAlumno] = useState(null);
  const [cantidadDias, setCantidadDias] = useState(3);
  const [rutina, setRutina] = useState({});

  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  async function buscarPorDni(dni) {
    const dniLimpio = String(dni || "").trim();
    if (!dniLimpio) return;

    setBuscando(true);
    setErrorBusqueda("");
    setMensaje("");
    setAlumno(null);

    try {
      const encontrado = await buscarUsuarioPorDni(dniLimpio);

      if (!encontrado) {
        setErrorBusqueda("No encontramos ningún alumno con ese DNI.");
        setBuscando(false);
        return;
      }

      let rutinaBase = encontrado.rutina;
      if (!rutinaBase || Object.keys(rutinaBase).length === 0) {
        const plantilla = encontrado.rutinaId ? await buscarRutina(encontrado.rutinaId) : null;
        rutinaBase = plantilla?.dias ?? {};
      }

      setAlumno(encontrado);
      setCantidadDias(encontrado.cantidadDias || 3);
      setRutina(clonarRutina(rutinaBase));
    } catch (err) {
      console.error(err);
      setErrorBusqueda("Ocurrió un error al buscar el alumno. Probá de nuevo.");
    } finally {
      setBuscando(false);
    }
  }

  // Si llegamos con un DNI ya elegido (desde la lista de alumnos), buscamos automático
  useEffect(() => {
    if (dniPreset) {
      setDniBusqueda(dniPreset);
      buscarPorDni(dniPreset);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dniPreset]);

  function handleBuscar(e) {
    e.preventDefault();
    buscarPorDni(dniBusqueda);
  }

  function clonarRutina(rutinaOriginal) {
    return JSON.parse(JSON.stringify(rutinaOriginal || {}));
  }

  function handleCambiarEjercicio(diaKey, index, campo, valor) {
    setRutina((prev) => {
      const copia = { ...prev };
      const ejerciciosDia = [...(copia[diaKey] || [])];
      ejerciciosDia[index] = { ...ejerciciosDia[index], [campo]: valor };
      copia[diaKey] = ejerciciosDia;
      return copia;
    });
  }

  function handleAgregarEjercicio(diaKey) {
    setRutina((prev) => {
      const copia = { ...prev };
      const ejerciciosDia = [...(copia[diaKey] || [])];
      ejerciciosDia.push({ nombre: "", detalle: "" });
      copia[diaKey] = ejerciciosDia;
      return copia;
    });
  }

  function handleEliminarEjercicio(diaKey, index) {
    setRutina((prev) => {
      const copia = { ...prev };
      const ejerciciosDia = [...(copia[diaKey] || [])];
      ejerciciosDia.splice(index, 1);
      copia[diaKey] = ejerciciosDia;
      return copia;
    });
  }

  async function handleGuardar() {
    if (!alumno) return;
    setGuardando(true);
    setMensaje("");
    try {
      const rutinaFinal = {};
      for (let i = 1; i <= cantidadDias; i++) {
        rutinaFinal[`dia${i}`] = rutina[`dia${i}`] || [];
      }

      await actualizarRutinaAlumno(alumno.dni, rutinaFinal, cantidadDias);
      setRutina(rutinaFinal);
      setMensaje("¡Rutina actualizada con éxito!");
    } catch (err) {
      console.error(err);
      setMensaje("Error al guardar los cambios.");
    } finally {
      setGuardando(false);
    }
  }

  const diasArray = Array.from({ length: cantidadDias }, (_, i) => `dia${i + 1}`);

  return (
    <div>
      <form onSubmit={handleBuscar} style={{ marginBottom: alumno ? "20px" : "0" }}>
        <label>Buscar alumno por DNI</label>
        <div style={{ display: "flex", gap: "8px" }}>
          <input
            type="text"
            value={dniBusqueda}
            onChange={(e) => setDniBusqueda(e.target.value)}
            placeholder="Ej: 43614517"
            style={{ marginBottom: 0 }}
          />
          <button type="submit" disabled={buscando} style={{ width: "auto", padding: "0 18px" }}>
            {buscando ? "..." : "Buscar"}
          </button>
        </div>
        {errorBusqueda && <p className="error-msg">{errorBusqueda}</p>}
      </form>

      {alumno && (
        <div className="editor-rutina">
          <div className="editor-alumno-info">
            <p className="nombre" style={{ fontSize: "16px" }}>{alumno.nombre}</p>
            <p className="subtitulo" style={{ margin: 0 }}>DNI: {alumno.dni}</p>
          </div>

          <label>Cantidad de días</label>
          <input
            type="number"
            min="1"
            max="7"
            value={cantidadDias}
            onChange={(e) => setCantidadDias(Math.max(1, Number(e.target.value) || 1))}
          />

          {diasArray.map((diaKey, i) => (
            <div className="editor-dia" key={diaKey}>
              <p className="editor-dia-titulo">Día {i + 1}</p>

              {(rutina[diaKey] || []).map((ej, index) => (
                <div className="editor-ejercicio-row" key={index}>
                  <input
                    type="text"
                    placeholder="Nombre del ejercicio"
                    value={ej.nombre}
                    onChange={(e) => handleCambiarEjercicio(diaKey, index, "nombre", e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Series x reps"
                    value={ej.detalle}
                    onChange={(e) => handleCambiarEjercicio(diaKey, index, "detalle", e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn-eliminar-ejercicio"
                    onClick={() => handleEliminarEjercicio(diaKey, index)}
                    aria-label="Eliminar ejercicio"
                  >
                    ✕
                  </button>
                </div>
              ))}

              <button
                type="button"
                className="btn-agregar-ejercicio"
                onClick={() => handleAgregarEjercicio(diaKey)}
              >
                + Agregar ejercicio
              </button>
            </div>
          ))}

          {mensaje && (
            <p className={mensaje.startsWith("Error") ? "error-msg" : "msg-exito"}>{mensaje}</p>
          )}

          <button type="button" onClick={handleGuardar} disabled={guardando}>
            {guardando ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      )}
    </div>
  );
}