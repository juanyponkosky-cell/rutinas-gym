import { useState } from "react";
import LoginDni from "./components/LoginDni";
import RutinaDelDia from "./components/RutinaDelDia";
import { buscarUsuarioPorDni, buscarRutina, completarDia } from "./services/usuarios";
import "./App.css";

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [ejercicios, setEjercicios] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [completando, setCompletando] = useState(false);
  const [error, setError] = useState("");

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

      const rutina = await buscarRutina(usuarioEncontrado.rutinaId);
      const claveDia = `dia${usuarioEncontrado.diaActual}`;
      const ejerciciosDelDia = rutina?.dias?.[claveDia] ?? [];

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

  return usuario ? (
    <RutinaDelDia
      usuario={usuario}
      ejercicios={ejercicios}
      onCompletar={handleCompletar}
      completando={completando}
      onVolver={handleVolver}
    />
  ) : (
    <LoginDni onBuscar={handleBuscar} cargando={cargando} error={error} />
  );
}
