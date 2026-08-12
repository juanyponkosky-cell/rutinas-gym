function claveDePeso(numeroDia, nombreEjercicio) {
  return `dia${numeroDia}::${(nombreEjercicio || "").trim().toLowerCase()}`;
}

export default function RutinaDelDia({
  usuario,
  numeroDia,
  ejercicios,
  pesos,
  onCambiarPeso,
  onGuardarPeso,
  onVolverMenu,
}) {
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
          Día {numeroDia} de {usuario.cantidadDias}
        </span>

        {ejercicios.length === 0 ? (
          <p className="sin-ejercicios">
            No encontramos ejercicios cargados para este día. Consultá con tu profe.
          </p>
        ) : (
          <div className="lista-ejercicios">
            {ejercicios.map((ej, i) => {
              const claveEjercicio = claveDePeso(numeroDia, ej.nombre);
              return (
                <div className="ejercicio" key={i}>
                  <p className="ejercicio-nombre">{ej.nombre}</p>
                  <p className="ejercicio-detalle">{ej.detalle}</p>
                  <div className="ejercicio-peso">
                    <label>Peso usado</label>
                    <input
                      type="text"
                      placeholder="Ej: 20kg"
                      value={pesos[claveEjercicio] || ""}
                      onChange={(e) => onCambiarPeso(claveEjercicio, e.target.value)}
                      onBlur={(e) => onGuardarPeso(claveEjercicio, e.target.value)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <button type="button" className="btn-volver" onClick={onVolverMenu}>
          ‹ Volver al menú
        </button>
      </div>
    </div>
  );
}