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

export const isEmailConfigured = () =>
  ![EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY].some(
    (v) => !v || v.startsWith("PEGA_")
  );

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
