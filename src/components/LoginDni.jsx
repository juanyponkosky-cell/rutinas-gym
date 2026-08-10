import { useState } from "react";

export default function LoginDni({ onBuscar, cargando, error }) {
  const [dni, setDni] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const dniLimpio = dni.trim();
    if (dniLimpio.length === 0) return;
    onBuscar(dniLimpio);
  }

  return (
    <div className="pantalla">
      <form className="card" onSubmit={handleSubmit}>
        <div className="header-login">
          <div className="logo-fts">FTS</div>
          <p className="marca">FUNTRAINSPORTS</p>
          <p className="subtitulo">Ingresá a tu rutina del día</p>
        </div>

        <label htmlFor="dni">DNI</label>
        <input
          id="dni"
          type="text"
          inputMode="numeric"
          placeholder="12345678"
          value={dni}
          onChange={(e) => setDni(e.target.value)}
          autoFocus
        />

        {error && <p className="error-msg">{error}</p>}

        <button type="submit" disabled={cargando}>
          {cargando ? "Buscando..." : "Ver mi rutina"}
        </button>
      </form>
    </div>
  );
}
