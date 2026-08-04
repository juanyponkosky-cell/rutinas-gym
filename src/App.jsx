import { useState } from "react";
import LoginDni from "./components/LoginDni";
import RutinaDelDia from "./components/RutinaDelDia";
import { AdminPanel } from "./components/AdminPanel";
import { buscarUsuarioPorDni, buscarRutina, completarDia } from "./services/usuarios";
import "./App.css";

const CLAVE_PROFE = "1234"; // 🔑 Cambiá esta clave según lo acordado con el profe

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [ejercicios, setEjercicios] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [completando, setCompletando] = useState(false);
  const [error, setError] = useState("");

  // Estados para el acceso del Profesor
  const [esProfe, setEsProfe] = useState(false);
  const [pidiendoClave, setPidiendoClave] = useState(false);
  const [claveIngresada, setClaveIngresada] = useState("");
  const [errorClave, setErrorClave] = useState(false);

  async function handleBuscar(dni) {
    setCargando(true);
    setError("");
    try {
      const usuarioEncontrado = await buscarUsuarioPorDni(dni);

      if (!usuarioEncontrado) {
        setError("No encontramos ningún usuario con ese DNI. Consultá con tu profe.");
        setCargando(false);
        return;
      }

      const claveDia = `dia${usuarioEncontrado.diaActual}`;
      let ejerciciosDelDia = [];

      // Prioriza la rutina personalizada del usuario; si no existe, busca la plantilla por defecto
      if (usuarioEncontrado.rutina && usuarioEncontrado.rutina[claveDia]) {
        ejerciciosDelDia = usuarioEncontrado.rutina[claveDia];
      } else if (usuarioEncontrado.rutinaId) {
        const rutina = await buscarRutina(usuarioEncontrado.rutinaId);
        ejerciciosDelDia = rutina?.dias?.[claveDia] ?? [];
      }

      setUsuario(usuarioEncontrado);
      setEjercicios(ejerciciosDelDia);
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error al buscar tu rutina. Probá de nuevo.");
    } finally {
      setCargando(false);
    }
  }

  async function handleCompletar() {
    setCompletando(true);
    try {
      const proximoDia = await completarDia(
        usuario.dni,
        usuario.diaActual,
        usuario.cantidadDias
      );
      console.log("Día actualizado a:", proximoDia);
      handleVolver();
    } catch (err) {
      console.error(err);
      setError("No se pudo guardar. Probá de nuevo.");
    } finally {
      setCompletando(false);
    }
  }

  function handleVolver() {
    setUsuario(null);
    setEjercicios([]);
    setError("");
  }

  function handleLoginProfe(e) {
    e.preventDefault();
    if (claveIngresada === CLAVE_PROFE) {
      setEsProfe(true);
      setPidiendoClave(false);
      setErrorClave(false);
      setClaveIngresada("");
    } else {
      setErrorClave(true);
    }
  }

  // 1. Si está autenticado como profe, muestra el AdminPanel
  if (esProfe) {
    return <AdminPanel onVolver={() => setEsProfe(false)} />;
  }

  // 2. Si un alumno buscó su DNI, muestra su Rutina
  if (usuario) {
    return (
      <RutinaDelDia
        usuario={usuario}
        ejercicios={ejercicios}
        onCompletar={handleCompletar}
        completando={completando}
        onVolver={handleVolver}
      />
    );
  }

  // 3. Pantalla de inicio para alumnos con el acceso para el profesor
  return (
    <div className="pantalla">
      <div style={{ width: "100%", maxWidth: "360px", display: "flex", flexDirection: "column" }}>
        <LoginDni onBuscar={handleBuscar} cargando={cargando} error={error} />

        <button className="btn-profe" onClick={() => setPidiendoClave(true)}>
          ⚙️ Soy Profe
        </button>
      </div>

      {pidiendoClave && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>Acceso Profesor</h3>
            <form onSubmit={handleLoginProfe}>
              <input
                type="password"
                placeholder="Ingresá la contraseña"
                value={claveIngresada}
                onChange={(e) => setClaveIngresada(e.target.value)}
                autoFocus
              />
              {errorClave && <p className="error-msg">Contraseña incorrecta</p>}

              <div className="modal-acciones">
                <button type="submit">Entrar</button>
                <button
                  type="button"
                  className="btn-volver"
                  onClick={() => {
                    setPidiendoClave(false);
                    setErrorClave(false);
                    setClaveIngresada("");
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}