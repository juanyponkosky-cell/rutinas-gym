import { useState } from "react";

function claveDePeso(diaKey, nombreEjercicio) {
  return `${diaKey}::${(nombreEjercicio || "").trim().toLowerCase()}`;
}

export default function MenuDias({
  usuario,
  rutinaCompleta,
  pesos,
  onSeleccionarDia,
  onDescargarPdf,
  onVolver,
}) {
  const [verCompleta, setVerCompleta] = useState(false);

  const diasArray = Array.from({ length: usuario.cantidadDias }, (_, i) => i + 1);

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

        {!verCompleta ? (
          <div className="menu-dias">
            {diasArray.map((numeroDia) => (
              <button
                type="button"
                key={numeroDia}
                className="btn-dia-menu"
                onClick={() => onSeleccionarDia(numeroDia)}
              >
                Día {numeroDia}
              </button>
            ))}
          </div>
        ) : (
          <div className="rutina-completa">
            {diasArray.map((numeroDia) => {
              const diaKey = `dia${numeroDia}`;
              const ejerciciosDia = rutinaCompleta[diaKey] || [];

              return (
                <div className="bloque-dia" key={diaKey}>
                  <p className="bloque-dia-titulo">Día {numeroDia}</p>

                  {ejerciciosDia.length === 0 ? (
                    <p className="sin-ejercicios" style={{ marginBottom: "12px" }}>
                      Sin ejercicios cargados.
                    </p>
                  ) : (
                    <div className="lista-ejercicios" style={{ marginBottom: "16px" }}>
                      {ejerciciosDia.map((ej, idx) => {
                        const pesoGuardado = pesos[claveDePeso(diaKey, ej.nombre)];
                        return (
                          <div className="ejercicio" key={idx}>
                            <p className="ejercicio-nombre">{ej.nombre}</p>
                            <p className="ejercicio-detalle">{ej.detalle}</p>
                            {pesoGuardado && (
                              <p className="ejercicio-peso-guardado">Último peso: {pesoGuardado}</p>
                            )}
                          </div>
                        );
                      })}
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
          {verCompleta ? "Ver menú de días" : "Ver rutina completa"}
        </button>

        <button type="button" className="btn-descargar-pdf" onClick={onDescargarPdf}>
          ⬇ Descargar rutina en PDF
        </button>

        <button type="button" className="btn-volver" onClick={onVolver}>
          Volver
        </button>
      </div>
    </div>
  );
}