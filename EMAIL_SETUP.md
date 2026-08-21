# Envío de correos con EmailJS — AventuraRD

La app envía dos correos al aventurero usando **EmailJS** (sin backend):

1. **Reserva recibida** — al crear la reserva (queda en estado `pendiente`).
2. **Cambio de estado** — cuando el operador la **confirma** o la **rechaza**, o
   cuando el propio cliente la **cancela**.

Son **dos plantillas distintas** en EmailJS. Sigue estos pasos una sola vez.

## 1. Crear cuenta y servicio

1. Crea una cuenta gratis en <https://www.emailjs.com>.
2. **Email Services → Add New Service** → elige tu proveedor (Gmail es lo más fácil) y
   conéctalo. Copia el **Service ID**.

## 2. Crear las plantillas

### 2.1 Plantilla de reserva recibida

1. **Email Templates → Create New Template**.
2. En el editor, cambia a **vista de código** (`<>`) y pega el contenido de
   [`emails/reserva.html`](emails/reserva.html).
3. Configura los campos del template:
   - **To Email:** `{{to_email}}`
   - **Subject:** `Reserva {{reference}} — {{experienceTitle}} | AventuraRD`
   - **From Name:** `AventuraRD`
   - **Bcc:** el correo del operador (para que le llegue el botón *Confirmar reserva*).
4. Guarda y copia el **Template ID** → va en `EMAILJS_TEMPLATE_ID`.

### 2.2 Plantilla de cambio de estado

Una sola plantilla cubre *confirmada* y *cancelada*: los textos y colores llegan
como variables.

1. **Email Templates → Create New Template** (otra distinta).
2. Pega en el editor de código el contenido de
   [`emails/estado-reserva.html`](emails/estado-reserva.html).
3. Configura:
   - **To Email:** `{{to_email}}`
   - **Subject:** `Reserva {{statusSubject}} — {{experienceTitle}} | AventuraRD`
   - **From Name:** `AventuraRD`
4. Guarda y copia el **Template ID** → va en `EMAILJS_TEMPLATE_STATUS_ID`.

## 3. Public Key y permiso para apps no-navegador

1. **Account → General** → copia la **Public Key**.
2. **Account → Security** → activa **"Allow EmailJS API for non-browser applications"**.
   > ⚠️ Imprescindible: Expo/React Native no es un navegador; sin esto, EmailJS
   > rechaza la petición con un error de API.

## 4. Pegar las credenciales en la app

En [`constants/email.js`](constants/email.js), reemplaza:

```js
export const EMAILJS_SERVICE_ID         = "PEGA_TU_SERVICE_ID";
export const EMAILJS_TEMPLATE_ID        = "PEGA_TU_TEMPLATE_ID";         // reserva recibida
export const EMAILJS_TEMPLATE_STATUS_ID = "PEGA_TU_TEMPLATE_ID_DE_ESTADO"; // confirmada/cancelada
export const EMAILJS_PUBLIC_KEY         = "PEGA_TU_PUBLIC_KEY";
```

Las dos plantillas son independientes: si falta `EMAILJS_TEMPLATE_STATUS_ID`, los
avisos de estado se omiten con un aviso en consola, pero el correo de reserva sigue
funcionando.

## 5. Probar

1. Recarga la app (`r` en la terminal de Expo).
2. Haz una reserva usando un **correo real** en el campo de contacto.
3. Revisa la bandeja de entrada (y spam). También verás el envío en
   **EmailJS → Email History**.

Si EmailJS **no está configurado** (siguen los `PEGA_...`), la app simplemente **omite**
el envío sin romper la reserva (lo verás como aviso en la consola).

---

## Cuándo se envía cada correo

| Disparador | Dónde está el código | Plantilla | Estado |
|---|---|---|---|
| El cliente crea la reserva | [`app/reserve/[id].js`](app/reserve/%5Bid%5D.js) → `finalizeReservation` | `reserva.html` | `pendiente` |
| El operador pulsa **Confirmar** | [`app/operator/index.js`](app/operator/index.js) → `decide` | `estado-reserva.html` | `confirmada` |
| El operador pulsa **Rechazar** | [`app/operator/index.js`](app/operator/index.js) → `decide` | `estado-reserva.html` | `cancelada` |
| El cliente cancela su reserva | [`store/useAppStore.js`](store/useAppStore.js) → `cancelReservation` | `estado-reserva.html` | `cancelada_por_cliente` |

Los textos de cada estado están en `STATUS_EMAIL_COPY`
([`constants/email.js`](constants/email.js)). La cancelación del cliente usa una
variante propia del texto ("Cancelaste tu reserva") porque el mensaje cambia según
quién canceló.

Ningún envío bloquea la acción: si EmailJS falla, la reserva ya quedó guardada y el
error solo se registra en consola.

---

## Variables que rellena la app

`to_email`, `contactName`, `reference`, `experienceTitle`, `experienceLocation`,
`experienceCategory`, `experienceDuration`, `date`, `time`, `people`,
`pricePerPerson`, `subtotal`, `serviceFee`, `total`, `operatorName`,
`operatorContact`, `operatorPhone`, `confirmUrl`, `safetyLevel`, `conditions`,
`recommendations`.

En la plantilla de **estado** cambian algunas: en lugar de `pricePerPerson`,
`subtotal`, `serviceFee`, `confirmUrl`, `safetyLevel`, `conditions` y
`recommendations`, recibe `statusSubject`, `statusBadge`, `statusIcon`,
`statusTitle`, `statusMessage`, `statusNote`, `statusAccent` y `statusSurface`.

- **safetyLevel / conditions**: se derivan de la *dificultad* del destino
  (`Fácil` / `Moderado` / `Difícil`).
- **recommendations**: se derivan de la *categoría* (Aventura / Ecoturismo /
  Turismo Comunitario).
- **confirmUrl**: enlace del botón **"Confirmar reserva"**. Apunta a
  `{APP_BASE_URL}/operator?ref={reference}`, es decir al **panel del operador** con esa
  reserva puesta arriba y resaltada. Ajusta `APP_BASE_URL` en
  [`constants/email.js`](constants/email.js): en local es `http://localhost:8081`
  (el servidor de Expo web); al desplegar, pon el dominio público.

Ver la lógica en [`constants/email.js`](constants/email.js).

---

## Notas

- El correo se envía al **cliente** (`contactEmail`). Como **quien confirma es el
  operador**, añade su correo como `Bcc` fijo en el template de EmailJS (campo *Bcc*)
  para que el botón **"Confirmar reserva"** le llegue a él. El cliente que pulse el
  botón sin ser el operador verá la pantalla de *Acceso restringido*, no puede
  confirmarse su propia reserva (las reglas de Firestore también lo impiden).
- El botón **no confirma por sí solo**: abre la app en el panel del operador, que debe
  iniciar sesión y pulsar *Confirmar*. Confirmar directamente desde el clic del correo
  exigiría un backend con tokens firmados, fuera del alcance del prototipo.
- El plan gratuito de EmailJS permite ~200 correos/mes: suficiente para el TFM.
- La **Public Key** de EmailJS es pública por diseño (va en el cliente); la protección
  la dan los límites y el dominio permitido en el panel de EmailJS.
