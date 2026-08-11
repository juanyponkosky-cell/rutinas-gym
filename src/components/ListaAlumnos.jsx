import { useState, useEffect, useMemo } from "react";
import { listarAlumnos } from "../services/usuarios";

function capitalizar(nombre) {
  return (nombre || "")
    .split(" ")
    .filter(Boolean)
    .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
    .join(" ");
}

export function ListaAlumnos({ onSeleccionarAlumno }) {
  const [alumnos, setAlumnos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    cargarAlumnos();
  }, []);

  async function cargarAlumnos() {
    setCargando(true);
    setError("");
    try {
      const lista = await listarAlumnos();
      setAlumnos(lista);
    } catch (err) {
      console.error(err);
      setError("No se pudo cargar la lista de alumnos.");
    } finally {
      setCargando(false);
    }
  }

  const alumnosFiltrados = useMemo(() => {
    const filtroLimpio = filtro.trim().toLowerCase();
    if (!filtroLimpio) return alumnos;
    return alumnos.filter(
      (a) =>
        (a.nombre || "").toLowerCase().includes(filtroLimpio) ||
        a.dni.includes(filtroLimpio)
    );
  }, [alumnos, filtro]);

  if (cargando) {
    return <p className="subtitulo">Cargando alumnos...</p>;
  }

  if (error) {
    return <p className="error-msg">{error}</p>;
  }

  return (
    <div>
      <div className="lista-alumnos-header">
        <p className="lista-alumnos-total">
          {alumnos.length} {alumnos.length === 1 ? "alumno" : "alumnos"}
        </p>
      </div>

      <input
        type="text"
        placeholder="Buscar por nombre o DNI..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
      />

      {alumnosFiltrados.length === 0 ? (
        <p className="subtitulo">No se encontraron alumnos.</p>
      ) : (
        <div className="lista-alumnos">
          {alumnosFiltrados.map((alumno) => (
            <button
              type="button"
              key={alumno.dni}
              className="item-alumno"
              onClick={() => onSeleccionarAlumno(alumno.dni)}
            >
              <div>
                <p className="item-alumno-nombre">{capitalizar(alumno.nombre)}</p>
                <p className="item-alumno-dni">DNI: {alumno.dni}</p>
              </div>
              <span className="item-alumno-flecha">›</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}