// constants/email.js
// Configuración de EmailJS (envío de correos desde el cliente, sin backend).
//
// ⚠️ Completa estos 3 valores desde tu panel de EmailJS (https://dashboard.emailjs.com):
//   - Service ID:   Email Services → tu servicio
//   - Template ID:  Email Templates → tu plantilla
//   - Public Key:   Account → General → Public Key
// Y activa: Account → Security → "Allow EmailJS API for non-browser applications".
export const EMAILJS_SERVICE_ID = "service_lt76xio";
export const EMAILJS_TEMPLATE_ID = "template_8x0zfuc";
export const EMAILJS_PUBLIC_KEY = "-mumeZLwr7wm-7UmR";

// Segunda plantilla, para avisar al aventurero cuando su reserva cambia de estado
// (la confirma o la rechaza el operador, o la cancela él mismo).
// Pega en EmailJS el contenido de emails/estado-reserva.html y copia aquí su ID.
export const EMAILJS_TEMPLATE_STATUS_ID = "template_gg2czag";

// URL base de la app (donde se sirve el build web de Expo). Se usa para el botón
// "Confirmar reserva" del correo, que abre el panel del operador ya filtrado por la
// reserva. En local es el servidor de Expo; al desplegar, pon aquí el dominio público.
export const APP_BASE_URL = "http://localhost:8081";

// Enlace del botón del correo: abre el panel del operador resaltando esta reserva.
export const buildConfirmUrl = (reference) =>
  `${APP_BASE_URL.replace(/\/$/, "")}/operator${
    reference ? `?ref=${encodeURIComponent(reference)}` : ""
  }`;

const filled = (...values) => values.every((v) => v && !v.startsWith("PEGA_"));

export const isEmailConfigured = () =>
  filled(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY);

// Los correos de estado necesitan además su propia plantilla. Si falta, se omiten
// sin romper nada más.
export const isStatusEmailConfigured = () =>
  filled(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_STATUS_ID, EMAILJS_PUBLIC_KEY);

// Textos y colores del correo según el nuevo estado de la reserva. Hay dos
// variantes de cancelación porque el mensaje cambia según quién canceló.
export const STATUS_EMAIL_COPY = {
  confirmada: {
    subject: "confirmada",
    badge: "Confirmada",
    icon: "✅",
    accent: "#2F9E62",
    surface: "#E6F4EC",
    title: "¡Tu reserva está confirmada!",
    message:
      "El operador local revisó tu solicitud y confirmó tu plaza. Guarda este correo y presenta tu número de reserva el día de la experiencia.",
    note: "Llega con antelación al punto de encuentro. Si necesitas cambiar la fecha, contacta directamente con el operador.",
  },
  cancelada: {
    subject: "cancelada",
    badge: "Cancelada",
    icon: "❌",
    accent: "#EF4444",
    surface: "#FEE9E9",
    title: "Tu reserva fue cancelada",
    message:
      "El operador local no pudo atender esta solicitud y la reserva quedó cancelada. No se te cobrará nada por ella.",
    note: "Puedes escribir al operador para buscar otra fecha, o elegir otra experiencia en AventuraRD.",
  },
  cancelada_por_cliente: {
    subject: "cancelada",
    badge: "Cancelada",
    icon: "❌",
    accent: "#EF4444",
    surface: "#FEE9E9",
    title: "Cancelaste tu reserva",
    message:
      "Hemos registrado la cancelación de tu reserva y avisado al operador local. No se te cobrará nada por ella.",
    note: "Si fue un error o quieres otra fecha, puedes reservar de nuevo desde la app cuando quieras.",
  },
};

// Nivel de seguridad / condiciones según la dificultad de la actividad.
export const conditionsForDifficulty = (difficulty) => {
  switch (difficulty) {
    case "Fácil":
      return "Actividad apta para todas las edades y condiciones físicas. Sigue las indicaciones del guía local.";
    case "Moderado":
      return "Requiere condición física moderada. No recomendada para personas con movilidad reducida o problemas cardíacos.";
    case "Difícil":
      return "Actividad exigente. Se requiere buena condición física y seguir en todo momento las instrucciones de seguridad del guía. No apta para embarazadas ni menores sin autorización.";
    default:
      return "Sigue en todo momento las indicaciones del guía y del operador local.";
  }
};

// Recomendaciones (qué llevar / tener en cuenta) según la categoría.
export const recommendationsForCategory = (category) => {
  switch (category) {
    case "Aventura":
      return "Ropa deportiva y calzado cerrado · Protector solar · Agua · Atención a las instrucciones de seguridad · Llega 15 minutos antes.";
    case "Ecoturismo":
      return "Calzado de senderismo · Repelente de insectos · Protector solar y gorra · Agua suficiente · Respeta la flora y fauna del lugar.";
    case "Turismo Comunitario":
      return "Documento de identidad · Ropa fresca y cómoda · Protector solar y gorra · Efectivo para artesanía local · Respeto por los espacios religiosos y las comunidades.";
    default:
      return "Ropa cómoda · Protector solar · Agua · Sigue las indicaciones del guía.";
  }
};
