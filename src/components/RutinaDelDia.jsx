export default function RutinaDelDia({
  usuario,
  ejercicios,
  onCompletar,
  completando,
  onVolver,
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
          Día {usuario.diaActual} de {usuario.cantidadDias}
        </span>

        {ejercicios.length === 0 ? (
          <p className="sin-ejercicios">
            No encontramos ejercicios cargados para este día. Consultá con tu profe.
          </p>
        ) : (
          <div className="lista-ejercicios">
            {ejercicios.map((ej, i) => (
              <div className="ejercicio" key={i}>
                <p className="ejercicio-nombre">{ej.nombre}</p>
                <p className="ejercicio-detalle">{ej.detalle}</p>
              </div>
            ))}
          </div>
        )}

        <button
          className="btn-completar"
          onClick={onCompletar}
          disabled={completando}
        >
          {completando ? "Guardando..." : "✓ Completé este día"}
        </button>

        <button className="btn-volver" onClick={onVolver}>
          Volver
        </button>
      </div>
    </div>
  );
}
