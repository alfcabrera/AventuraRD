// services/email.js
// Envío del correo de confirmación de reserva con EmailJS (API REST vía fetch).
import {
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
  EMAILJS_TEMPLATE_STATUS_ID,
  EMAILJS_PUBLIC_KEY,
  isEmailConfigured,
  isStatusEmailConfigured,
  STATUS_EMAIL_COPY,
  buildConfirmUrl,
  conditionsForDifficulty,
  recommendationsForCategory,
} from "@constants/email";

const MONTHS = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

const formatDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  return `${d.getDate()} de ${MONTHS[d.getMonth()]}, ${d.getFullYear()}`;
};

const formatTime = (hhmm) => {
  if (!hhmm) return "";
  const [h, m] = hhmm.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
};

// Construye los template_params que espera la plantilla de EmailJS.
export const buildReservationParams = (reservation, destination) => ({
  to_email: reservation.contactEmail,
  contactName: reservation.contactName || "Aventurero",
  reference: reservation.reference,
  experienceTitle: reservation.title,
  experienceLocation: reservation.location,
  experienceCategory: reservation.category,
  experienceDuration: reservation.duration,
  date: formatDate(reservation.date),
  time: formatTime(reservation.time),
  people: String(reservation.people),
  pricePerPerson: String(reservation.pricePerPerson),
  subtotal: String(reservation.subtotal),
  serviceFee: String(reservation.serviceFee),
  total: String(reservation.total),
  operatorName: reservation.operator?.name || "",
  operatorContact: reservation.operator?.contact || "",
  operatorPhone: reservation.operator?.phone || "",
  // Enlace del botón "Confirmar reserva": abre el panel del operador
  // con esta reserva resaltada.
  confirmUrl: buildConfirmUrl(reservation.reference),
  safetyLevel: destination?.difficulty || "General",
  // Preferimos la info específica de la actividad; si falta, usamos la genérica.
  conditions: destination?.safety || conditionsForDifficulty(destination?.difficulty),
  recommendations:
    destination?.recommendations?.length
      ? destination.recommendations.join(" · ")
      : recommendationsForCategory(reservation.category),
});

// Envía el correo. No lanza si EmailJS no está configurado (solo avisa en consola).
export async function sendReservationEmail(reservation, destination) {
  if (!isEmailConfigured()) {
    console.warn("EmailJS no configurado: se omite el envío del correo.");
    return { skipped: true };
  }
  if (!reservation?.contactEmail) {
    console.warn("Reserva sin correo de contacto: se omite el envío.");
    return { skipped: true };
  }

  return postToEmailJS(
    EMAILJS_TEMPLATE_ID,
    buildReservationParams(reservation, destination)
  );
}

// POST a la API de EmailJS. Compartido por los dos tipos de correo.
async function postToEmailJS(templateId, templateParams) {
  const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: EMAILJS_SERVICE_ID,
      template_id: templateId,
      user_id: EMAILJS_PUBLIC_KEY,
      template_params: templateParams,
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`EmailJS ${res.status}: ${detail}`);
  }
  return { ok: true };
}

// ─── Correo de cambio de estado (confirmada / cancelada) ────────────

// `status` es "confirmada", "cancelada" o "cancelada_por_cliente" (la cancela el
// propio aventurero, así que el texto cambia).
export const buildStatusParams = (reservation, destination, status) => {
  const copy = STATUS_EMAIL_COPY[status];
  return {
    to_email: reservation.contactEmail,
    contactName: reservation.contactName || "Aventurero",
    reference: reservation.reference,
    statusSubject: copy.subject,
    statusBadge: copy.badge,
    statusIcon: copy.icon,
    statusTitle: copy.title,
    statusMessage: copy.message,
    statusNote: copy.note,
    statusAccent: copy.accent,
    statusSurface: copy.surface,
    experienceTitle: reservation.title,
    experienceLocation: reservation.location,
    experienceCategory: reservation.category,
    experienceDuration: reservation.duration,
    date: formatDate(reservation.date),
    time: formatTime(reservation.time),
    people: String(reservation.people),
    total: String(reservation.total),
    operatorName: reservation.operator?.name || "",
    operatorContact: reservation.operator?.contact || "",
    operatorPhone: reservation.operator?.phone || "",
  };
};

// Avisa al aventurero de que su reserva cambió de estado. Como el de reserva, no
// lanza si EmailJS no está configurado: solo avisa por consola.
export async function sendReservationStatusEmail(reservation, destination, status) {
  if (!STATUS_EMAIL_COPY[status]) {
    console.warn(`Estado sin plantilla de correo: ${status}. Se omite el envío.`);
    return { skipped: true };
  }
  if (!isStatusEmailConfigured()) {
    console.warn(
      "EmailJS sin plantilla de estado (EMAILJS_TEMPLATE_STATUS_ID): se omite el aviso."
    );
    return { skipped: true };
  }
  if (!reservation?.contactEmail) {
    console.warn("Reserva sin correo de contacto: se omite el aviso de estado.");
    return { skipped: true };
  }

  return postToEmailJS(
    EMAILJS_TEMPLATE_STATUS_ID,
    buildStatusParams(reservation, destination, status)
  );
}
