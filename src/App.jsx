import { useState, useEffect } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./firebase";
import LoginDni from "./components/LoginDni";
import RutinaDelDia from "./components/RutinaDelDia";
import { AdminPanel } from "./components/AdminPanel";
import { buscarUsuarioPorDni, buscarRutina, completarDia } from "./services/usuarios";
import "./App.css";

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [ejercicios, setEjercicios] = useState([]);
  const [rutinaCompleta, setRutinaCompleta] = useState({});
  const [cargando, setCargando] = useState(false);
  const [completando, setCompletando] = useState(false);
  const [error, setError] = useState("");

  // Estados para el acceso del Profesor (ahora con Firebase Auth de verdad)
  const [profeAuth, setProfeAuth] = useState(null); // usuario de Firebase Auth, o null
  const [chequeandoSesion, setChequeandoSesion] = useState(true);
  const [pidiendoLogin, setPidiendoLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorLogin, setErrorLogin] = useState("");
  const [entrando, setEntrando] = useState(false);

  // Escucha el estado de sesión del profe (se mantiene logueado entre recargas)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setProfeAuth(user);
      setChequeandoSesion(false);
    });
    return unsubscribe;
  }, []);

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

      let rutinaCompleta = usuarioEncontrado.rutina;
      if (!rutinaCompleta || Object.keys(rutinaCompleta).length === 0) {
        const plantilla = usuarioEncontrado.rutinaId
          ? await buscarRutina(usuarioEncontrado.rutinaId)
          : null;
        rutinaCompleta = plantilla?.dias ?? {};
      }

      const claveDia = `dia${usuarioEncontrado.diaActual}`;
      const ejerciciosDelDia = rutinaCompleta[claveDia] ?? [];

      setUsuario(usuarioEncontrado);
      setEjercicios(ejerciciosDelDia);
      setRutinaCompleta(rutinaCompleta);
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
    setRutinaCompleta({});
    setError("");
  }

  async function handleLoginProfe(e) {
    e.preventDefault();
    setEntrando(true);
    setErrorLogin("");
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      setPidiendoLogin(false);
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error(err);
      setErrorLogin("Email o contraseña incorrectos.");
    } finally {
      setEntrando(false);
    }
  }

  async function handleCerrarSesion() {
    await signOut(auth);
  }

  if (chequeandoSesion) {
    return <div className="pantalla" />;
  }

  if (profeAuth) {
    return <AdminPanel onCerrarSesion={handleCerrarSesion} />;
  }

  if (usuario) {
    return (
      <RutinaDelDia
        usuario={usuario}
        ejercicios={ejercicios}
        rutinaCompleta={rutinaCompleta}
        onCompletar={handleCompletar}
        completando={completando}
        onVolver={handleVolver}
      />
    );
  }

  return (
    <div className="pantalla">
      <div style={{ width: "100%", maxWidth: "360px", display: "flex", flexDirection: "column" }}>
        <LoginDni onBuscar={handleBuscar} cargando={cargando} error={error} />

        <button className="btn-profe" onClick={() => setPidiendoLogin(true)}>
          ⚙️ Soy Profe
        </button>
      </div>

      {pidiendoLogin && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>Acceso Profesor</h3>
            <form onSubmit={handleLoginProfe}>
              <label>Email</label>
              <input
                type="email"
                placeholder="profe@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
              />

              <label>Contraseña</label>
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {errorLogin && <p className="error-msg">{errorLogin}</p>}

              <div className="modal-acciones">
                <button type="submit" disabled={entrando}>
                  {entrando ? "Entrando..." : "Entrar"}
                </button>
                <button
                  type="button"
                  className="btn-volver"
                  onClick={() => {
                    setPidiendoLogin(false);
                    setErrorLogin("");
                    setEmail("");
                    setPassword("");
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