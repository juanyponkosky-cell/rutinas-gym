# Rutinas Gym — FTS Funtrainsports

Fase 1: MVP público. El usuario ingresa su DNI, ve su nombre y la rutina del
día que le toca (según su día actual en el ciclo), y puede marcar el día
como completado para avanzar al próximo.

## Cómo correrlo

1. Instalar dependencias (ya vienen instaladas si lo bajaste tal cual):
   ```
   npm install
   ```

2. Completar `src/firebase.js` con el `firebaseConfig` real que te da la
   consola de Firebase (Configuración del proyecto → Tus apps → Web).

3. En Firestore, crear dos colecciones:

   **usuarios/{dni}**
   ```json
   {
     "nombre": "Juan Pérez",
     "rutinaId": "fullbody_3dias_A",
     "diaActual": 1,
     "cantidadDias": 3
   }
   ```

   **rutinas/{rutinaId}**
   ```json
   {
     "dias": {
       "dia1": [
         { "nombre": "Sentadilla", "detalle": "4 series x 10 reps" },
         { "nombre": "Press banca", "detalle": "3 series x 12 reps" }
       ],
       "dia2": [ ],
       "dia3": [ ]
     }
   }
   ```

   Importante: `rutinaId` en el usuario tiene que coincidir con el ID del
   documento en `rutinas`, y las claves de `dias` tienen que ser
   `dia1`, `dia2`, etc. (sin espacios), coincidiendo con `cantidadDias`.

4. Levantar el proyecto:
   ```
   npm run dev
   ```

## Estructura

```
src/
├── firebase.js              Config e inicialización de Firebase
├── App.jsx                  Orquesta login <-> rutina
├── App.css                  Estilos (identidad FTS: negro + amarillo)
├── components/
│   ├── LoginDni.jsx         Pantalla de ingreso por DNI
│   └── RutinaDelDia.jsx     Pantalla de rutina + botón completar
└── services/
    └── usuarios.js          Funciones de Firestore (buscar usuario,
                              buscar rutina, completar día)
```

## Próximos pasos (fases futuras)

- Fase 2: panel admin para que el profe cargue rutinas y usuarios sin
  tocar Firestore directamente (requiere login separado, ej. Firebase Auth).
- Fase 3: control de pagos/cuotas visible para el profe en el mismo panel.
