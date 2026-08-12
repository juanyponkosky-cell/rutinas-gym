import { useState, useEffect } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./firebase";
import LoginDni from "./components/LoginDni";
import MenuDias from "./components/MenuDias";
import RutinaDelDia from "./components/RutinaDelDia";
import { AdminPanel } from "./components/AdminPanel";
import { buscarUsuarioPorDni, buscarRutina, guardarPesosAlumno } from "./services/usuarios";
import { descargarRutinaPdf } from "./utils/generarPdf";
import "./App.css";

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [rutinaCompleta, setRutinaCompleta] = useState({});
  const [pesos, setPesos] = useState({});
  const [diaSeleccionado, setDiaSeleccionado] = useState(null); // null = menú de días
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const [profeAuth, setProfeAuth] = useState(null);
  const [chequeandoSesion, setChequeandoSesion] = useState(true);
  const [pidiendoLogin, setPidiendoLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorLogin, setErrorLogin] = useState("");
  const [entrando, setEntrando] = useState(false);

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

      let rc = usuarioEncontrado.rutina;
      if (!rc || Object.keys(rc).length === 0) {
        const plantilla = usuarioEncontrado.rutinaId
          ? await buscarRutina(usuarioEncontrado.rutinaId)
          : null;
        rc = plantilla?.dias ?? {};
      }

      setUsuario(usuarioEncontrado);
      setRutinaCompleta(rc);
      setPesos(usuarioEncontrado.pesos || {});
      setDiaSeleccionado(null);
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error al buscar tu rutina. Probá de nuevo.");
    } finally {
      setCargando(false);
    }
  }

  function handleVolverInicio() {
    setUsuario(null);
    setRutinaCompleta({});
    setPesos({});
    setDiaSeleccionado(null);
    setError("");
  }

  function handleSeleccionarDia(numeroDia) {
    setDiaSeleccionado(numeroDia);
  }

  function handleVolverAlMenu() {
    setDiaSeleccionado(null);
  }

  function handleCambiarPeso(claveEjercicio, valor) {
    setPesos((prev) => ({ ...prev, [claveEjercicio]: valor }));
  }

  function handleGuardarPeso(claveEjercicio, valor) {
    const pesosActualizados = { ...pesos, [claveEjercicio]: valor };
    setPesos(pesosActualizados);
    guardarPesosAlumno(usuario.dni, pesosActualizados).catch((err) => {
      console.error("No se pudo guardar el peso:", err);
    });
  }

  function handleDescargarPdf() {
    descargarRutinaPdf(usuario, rutinaCompleta, pesos);
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

  if (usuario && diaSeleccionado) {
    return (
      <RutinaDelDia
        usuario={usuario}
        numeroDia={diaSeleccionado}
        ejercicios={rutinaCompleta[`dia${diaSeleccionado}`] || []}
        pesos={pesos}
        onCambiarPeso={handleCambiarPeso}
        onGuardarPeso={handleGuardarPeso}
        onVolverMenu={handleVolverAlMenu}
      />
    );
  }

  if (usuario) {
    return (
      <MenuDias
        usuario={usuario}
        rutinaCompleta={rutinaCompleta}
        pesos={pesos}
        onSeleccionarDia={handleSeleccionarDia}
        onDescargarPdf={handleDescargarPdf}
        onVolver={handleVolverInicio}
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