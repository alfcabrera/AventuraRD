# Envío de correos con EmailJS — AventuraRD

Al confirmar una reserva, la app envía un correo de confirmación al cliente usando
**EmailJS** (sin backend). Sigue estos pasos una sola vez.

## 1. Crear cuenta y servicio

1. Crea una cuenta gratis en <https://www.emailjs.com>.
2. **Email Services → Add New Service** → elige tu proveedor (Gmail es lo más fácil) y
   conéctalo. Copia el **Service ID**.

## 2. Crear la plantilla

1. **Email Templates → Create New Template**.
2. En el editor, cambia a **vista de código** (`<>`) y pega el contenido de
   [`emails/reserva.html`](emails/reserva.html).
3. Configura los campos del template:
   - **To Email:** `{{to_email}}`
   - **Subject:** `Reserva {{reference}} — {{experienceTitle}} | AventuraRD`
   - **From Name:** `AventuraRD`
4. Guarda y copia el **Template ID**.

## 3. Public Key y permiso para apps no-navegador

1. **Account → General** → copia la **Public Key**.
2. **Account → Security** → activa **"Allow EmailJS API for non-browser applications"**.
   > ⚠️ Imprescindible: Expo/React Native no es un navegador; sin esto, EmailJS
   > rechaza la petición con un error de API.

## 4. Pegar las credenciales en la app

En [`constants/email.js`](constants/email.js), reemplaza:

```js
export const EMAILJS_SERVICE_ID = "PEGA_TU_SERVICE_ID";
export const EMAILJS_TEMPLATE_ID = "PEGA_TU_TEMPLATE_ID";
export const EMAILJS_PUBLIC_KEY  = "PEGA_TU_PUBLIC_KEY";
```

## 5. Probar

1. Recarga la app (`r` en la terminal de Expo).
2. Haz una reserva usando un **correo real** en el campo de contacto.
3. Revisa la bandeja de entrada (y spam). También verás el envío en
   **EmailJS → Email History**.

Si EmailJS **no está configurado** (siguen los `PEGA_...`), la app simplemente **omite**
el envío sin romper la reserva (lo verás como aviso en la consola).

---

## Variables que rellena la app

`to_email`, `contactName`, `reference`, `experienceTitle`, `experienceLocation`,
`experienceCategory`, `experienceDuration`, `date`, `time`, `people`,
`pricePerPerson`, `subtotal`, `serviceFee`, `total`, `operatorName`,
`operatorContact`, `operatorPhone`, `safetyLevel`, `conditions`, `recommendations`.

- **safetyLevel / conditions**: se derivan de la *dificultad* del destino
  (`Fácil` / `Moderado` / `Difícil`).
- **recommendations**: se derivan de la *categoría* (Aventura / Ecoturismo /
  Turismo Comunitario).

Ver la lógica en [`constants/email.js`](constants/email.js).

---

## Notas

- El correo se envía al **cliente** (`contactEmail`). Si quieres enviarlo también al
  operador, puedes añadir un `Cc`/`Bcc` fijo en el template de EmailJS, o crear un
  segundo envío.
- El plan gratuito de EmailJS permite ~200 correos/mes: suficiente para el TFM.
- La **Public Key** de EmailJS es pública por diseño (va en el cliente); la protección
  la dan los límites y el dominio permitido en el panel de EmailJS.
