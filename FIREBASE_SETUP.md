# Configuración de Firebase — AventuraRD

La app usa el **Firebase JS SDK** (compatible con Expo Go, sin build nativo):

- **Firebase Authentication** — login/registro con email y contraseña.
- **Cloud Firestore** — favoritos, reservas y reseñas, guardados por usuario.

Ya tienes creado el proyecto **AventuraRD** (`aventurard`). Solo faltan 3 pasos en la
consola de Firebase para dejarlo funcionando.

---

## 1. Registrar la app Web y pegar la config

La config necesita el `apiKey` y el `appId`, que se obtienen al registrar una **app Web**.

1. Ve a **Configuración del proyecto** (⚙️) → pestaña **General**.
2. En **"Tus apps"**, haz clic en el icono **`</>`** (Web).
3. Ponle un apodo (ej. `AventuraRD Web`) y registra la app (no marques Hosting).
4. Firebase te mostrará un objeto `firebaseConfig`. Copia `apiKey` y `appId`.
5. Pégalos en [`firebase/config.js`](firebase/config.js), reemplazando:
   - `PEGA_AQUI_TU_API_KEY`
   - `PEGA_AQUI_TU_APP_ID`

> El resto de campos (`authDomain`, `projectId`, `storageBucket`, `messagingSenderId`)
> ya están puestos con los valores de tu proyecto. Verifica que coincidan con los que
> te muestra la consola.

---

## 2. Activar Authentication (Email/Contraseña)

1. Menú lateral → **Compilación / Build → Authentication → Comenzar**.
2. Pestaña **Sign-in method**.
3. Habilita el proveedor **Correo electrónico/contraseña** → **Guardar**.

---

## 3. Crear la base de datos Firestore y aplicar reglas

1. Menú lateral → **Compilación / Build → Firestore Database → Crear base de datos**.
2. Elige el modo **producción** y la región (ej. `nam5` / EE. UU.).
3. Cuando esté creada, ve a la pestaña **Reglas** y pega el contenido del archivo
   [`firestore.rules`](firestore.rules) del proyecto. Cada usuario solo accede a lo
   suyo, y el **operador** (por correo) puede ver/confirmar todas las reservas:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // ⚠️ Debe coincidir con OPERATOR_EMAIL en constants/roles.js
    function isOperator() {
      return request.auth != null
        && request.auth.token.email == 'operador@aventurard.com';
    }

    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      match /{sub=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }

    match /reservations/{resId} {
      allow create: if request.auth != null
        && request.resource.data.userId == request.auth.uid;
      allow read, update, delete: if request.auth != null
        && (resource.data.userId == request.auth.uid || isOperator());
    }
  }
}
```

4. Haz clic en **Publicar**.

---

## 4. Probar

```bash
npx expo start -c
```

(`-c` limpia la caché de Metro, recomendable tras instalar `firebase`.)

- **Regístrate** con un correo y contraseña (mín. 6 caracteres).
- En la consola de Firebase → **Authentication → Users** debe aparecer tu usuario.
- Marca un **favorito** y crea una **reserva**. En **Firestore → Data** verás:
  ```
  users/{tuUID}
    ├─ (name, email, avatar, createdAt)
    └─ favorites/{destinationId}

  reservations/{reservationId}   ← colección de nivel superior
    (userId, title, date, status: "pendiente", ...)
  ```
- Cierra sesión y vuelve a entrar: tus datos siguen ahí (ahora en la nube, no solo en
  el dispositivo).

---

## 5. Operador (confirmar reservas)

Las reservas ya **no se confirman automáticamente**: nacen en estado **`pendiente`** y
un único **operador** las confirma desde una pantalla propia.

El operador es un usuario identificado por su **correo**, definido en
[`constants/roles.js`](constants/roles.js):

```js
export const OPERATOR_EMAIL = "operador@aventurard.com";
```

Para activarlo:

1. **Regístrate** en la app con ese mismo correo (`operador@aventurard.com`) y una
   contraseña. Ese será el operador.
2. Inicia sesión con esa cuenta → en **Perfil** aparecerá la sección **Operador →
   Panel de operador**, que **solo** ve ese correo.
3. Ahí verás las reservas **pendientes** de todos los usuarios y podrás
   **Confirmar** o **Rechazar** cada una.
4. Cuando el cliente vuelva a abrir *Mis reservas*, verá el estado actualizado
   (`Confirmada` / `Cancelada`).

> ¿Quieres otro correo como operador? Cámbialo en **dos** sitios: `OPERATOR_EMAIL`
> en [`constants/roles.js`](constants/roles.js) y en la función `isOperator()` de
> [`firestore.rules`](firestore.rules) (vuelve a **Publicar** las reglas).

**Prueba del flujo completo:** con un usuario normal crea una reserva → queda
`Pendiente`. Cierra sesión, entra con el operador → **Panel de operador** →
**Confirmar**. Vuelve a entrar con el usuario normal → la reserva aparece `Confirmada`.

---

## Modelo de datos

```
users/{uid}
  name, email, avatar, createdAt

users/{uid}/favorites/{destinationId}
  destinationId, addedAt

reservations/{reservationId}          (colección de nivel superior)
  userId, destinationId, title, location, category, duration,
  date, time, people, pricePerPerson, subtotal, serviceFee, total,
  operator, contact*, payment, review,
  status ("pendiente" | "confirmada" | "cancelada"), reference, createdAt
```

Notas de diseño:

- La **imagen** del destino es un `require()` local y **no** se guarda en Firestore; se
  re-adjunta desde [`data/destinations.js`](data/destinations.js) usando `destinationId`.
- El **onboarding** y la **tarjeta guardada** (solo marca + últimos 4, datos no sensibles)
  siguen en AsyncStorage del dispositivo, por diseño.

---

## Qué queda pendiente / próximos pasos

- **Google Sign-In**: requiere `expo-auth-session` + configurar el proveedor en Firebase.
  Por ahora el botón muestra "Próximamente".
- **Reseñas globales por destino**: hoy cada usuario ve sus propias reseñas. Para que
  todos vean las de todos, crear una colección global `reviews` y leerla en la ficha
  del destino.

---

## ⚠️ Seguridad de la config

El `apiKey` del SDK Web **no es un secreto** (va en el cliente y Firebase lo diseña así);
la seguridad real la dan las **reglas de Firestore** y **Authentication**. Aun así, para
un repo público conviene mover la config a variables de entorno (`app.config.js` +
`process.env.EXPO_PUBLIC_*`). Para el TFM, dejarla en `firebase/config.js` es suficiente.
