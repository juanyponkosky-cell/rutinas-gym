import { useState } from "react";
import { crearAlumnoConPlantilla } from "../services/usuarios";
import { EditarAlumno } from "./EditarAlumno";
import { ListaAlumnos } from "./ListaAlumnos";
import { PLANTILLAS_RUTINA } from "../constants/plantillasRutina";

function RegistrarAlumno() {
  const [dni, setDni] = useState("");
  const [nombre, setNombre] = useState("");
  const [rutinaId, setRutinaId] = useState("3dias_hombre_nivel1");
  const [mensaje, setMensaje] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!dni.trim() || !nombre.trim()) {
      setErrorMsg("Por favor completá DNI y Nombre.");
      return;
    }

    setCargando(true);
    setMensaje("");
    setErrorMsg("");

    try {
      await crearAlumnoConPlantilla({ dni, nombre, rutinaId });
      setMensaje(`¡Alumno ${nombre} registrado con éxito!`);
      setDni("");
      setNombre("");
    } catch (error) {
      console.error(error);
      setErrorMsg("Error al guardar el alumno en la base de datos.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>DNI del Alumno</label>
      <input
        type="text"
        value={dni}
        onChange={(e) => setDni(e.target.value)}
        placeholder="Ej: 43614517"
      />

      <label>Nombre y Apellido</label>
      <input
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Ej: Juan Pérez"
      />

      <label>Plantilla de Rutina</label>
      <select value={rutinaId} onChange={(e) => setRutinaId(e.target.value)}>
        {PLANTILLAS_RUTINA.map((grupo) => (
          <optgroup label={grupo.grupo} key={grupo.grupo}>
            {grupo.opciones.map((op) => (
              <option value={op.id} key={op.id}>
                {op.etiqueta}
              </option>
            ))}
          </optgroup>
        ))}
      </select>

      {errorMsg && <p className="error-msg">{errorMsg}</p>}
      {mensaje && <p className="msg-exito">{mensaje}</p>}

      <button type="submit" disabled={cargando}>
        {cargando ? "Cargando..." : "Registrar Alumno"}
      </button>
    </form>
  );
}

export function AdminPanel({ onCerrarSesion }) {
  const [tab, setTab] = useState("registrar");
  const [dniSeleccionado, setDniSeleccionado] = useState(null);

  function handleSeleccionarAlumno(dni) {
    setDniSeleccionado(dni);
    setTab("editar");
  }

  function handleCambiarTab(nuevoTab) {
    if (nuevoTab === "editar" && tab !== "editar") {
      setDniSeleccionado(null);
    }
    setTab(nuevoTab);
  }

  return (
    <div className="pantalla">
      <div className="card">
        <div className="admin-header">
          <h2 className="admin-titulo">Panel del Profesor 🏋️‍♂️</h2>
        </div>

        <div className="admin-tabs">
          <button
            type="button"
            className={tab === "registrar" ? "admin-tab activo" : "admin-tab"}
            onClick={() => handleCambiarTab("registrar")}
          >
            Registrar
          </button>
          <button
            type="button"
            className={tab === "alumnos" ? "admin-tab activo" : "admin-tab"}
            onClick={() => handleCambiarTab("alumnos")}
          >
            Alumnos
          </button>
          <button
            type="button"
            className={tab === "editar" ? "admin-tab activo" : "admin-tab"}
            onClick={() => handleCambiarTab("editar")}
          >
            Editar rutina
          </button>
        </div>

        {tab === "registrar" && <RegistrarAlumno />}
        {tab === "alumnos" && <ListaAlumnos onSeleccionarAlumno={handleSeleccionarAlumno} />}
        {tab === "editar" && (
          <EditarAlumno key={dniSeleccionado || "manual"} dniPreset={dniSeleccionado} />
        )}

        <button
          type="button"
          className="btn-volver"
          onClick={onCerrarSesion}
          style={{ marginTop: "12px" }}
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}