import { useState } from "react";
import { crearAlumnoConPlantilla } from "../services/usuarios";
import { EditarAlumno } from "./EditarAlumno";

function RegistrarAlumno() {
  const [dni, setDni] = useState("");
  const [nombre, setNombre] = useState("");
  const [rutinaId, setRutinaId] = useState("hipertrofia_3dias_A");
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
        <option value="hipertrofia_3dias_A">Hipertrofia 3 Días (Opción A)</option>
        <option value="fuerza_4dias">Fuerza 4 Días</option>
        <option value="acondicionamiento_2dias">Acondicionamiento 2 Días</option>
      </select>

      {errorMsg && <p className="error-msg">{errorMsg}</p>}
      {mensaje && <p className="msg-exito">{mensaje}</p>}

      <button type="submit" disabled={cargando}>
        {cargando ? "Cargando..." : "Registrar Alumno"}
      </button>
    </form>
  );
}

export function AdminPanel({ onVolver }) {
  const [tab, setTab] = useState("registrar"); // "registrar" | "editar"

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
            onClick={() => setTab("registrar")}
          >
            Registrar alumno
          </button>
          <button
            type="button"
            className={tab === "editar" ? "admin-tab activo" : "admin-tab"}
            onClick={() => setTab("editar")}
          >
            Editar rutina
          </button>
        </div>

        {tab === "registrar" ? <RegistrarAlumno /> : <EditarAlumno />}

        <button type="button" className="btn-volver" onClick={onVolver} style={{ marginTop: "12px" }}>
          ← Volver al inicio
        </button>
      </div>
    </div>
  );
}