// services/email.js
// Envío del correo de confirmación de reserva con EmailJS (API REST vía fetch).
import {
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
  EMAILJS_PUBLIC_KEY,
  isEmailConfigured,
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

  const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_ID,
      user_id: EMAILJS_PUBLIC_KEY,
      template_params: buildReservationParams(reservation, destination),
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`EmailJS ${res.status}: ${detail}`);
  }
  return { ok: true };
}
