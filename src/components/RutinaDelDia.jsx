import { useState } from "react";

export default function RutinaDelDia({
  usuario,
  ejercicios,
  rutinaCompleta,
  onCompletar,
  completando,
  onVolver,
}) {
  const [verCompleta, setVerCompleta] = useState(false);

  const diasArray = Array.from(
    { length: usuario.cantidadDias },
    (_, i) => `dia${i + 1}`
  );

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

        {!verCompleta ? (
          <>
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
          </>
        ) : (
          <div className="rutina-completa">
            {diasArray.map((diaKey, i) => {
              const numeroDia = i + 1;
              const ejerciciosDia = rutinaCompleta[diaKey] || [];
              const esHoy = numeroDia === usuario.diaActual;

              return (
                <div className="bloque-dia" key={diaKey}>
                  <p className={esHoy ? "bloque-dia-titulo hoy" : "bloque-dia-titulo"}>
                    Día {numeroDia} {esHoy && "· hoy"}
                  </p>

                  {ejerciciosDia.length === 0 ? (
                    <p className="sin-ejercicios" style={{ marginBottom: "12px" }}>
                      Sin ejercicios cargados.
                    </p>
                  ) : (
                    <div className="lista-ejercicios" style={{ marginBottom: "16px" }}>
                      {ejerciciosDia.map((ej, idx) => (
                        <div className="ejercicio" key={idx}>
                          <p className="ejercicio-nombre">{ej.nombre}</p>
                          <p className="ejercicio-detalle">{ej.detalle}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <button
          type="button"
          className="btn-ver-completa"
          onClick={() => setVerCompleta((prev) => !prev)}
        >
          {verCompleta ? "Ver solo el día de hoy" : "Ver rutina completa"}
        </button>

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