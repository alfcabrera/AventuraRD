// constants/payment.js
// Utilidades de pago para el checkout simulado de AventuraRD.
// No procesan dinero real: validan y formatean como una pasarela real
// para ofrecer una experiencia de pago creíble en el prototipo.

// Métodos de pago disponibles en el checkout.
export const PAYMENT_METHODS = [
  {
    id: "card",
    label: "Tarjeta de crédito/débito",
    sublabel: "Visa, Mastercard, Amex",
    icon: "card-outline",
  },
  {
    id: "paypal",
    label: "PayPal",
    sublabel: "Serás redirigido para confirmar",
    icon: "logo-paypal",
  },
  {
    id: "cash",
    label: "Pagar al operador",
    sublabel: "Reservas ahora, pagas en el sitio",
    icon: "cash-outline",
  },
];

// Detecta la marca de la tarjeta a partir de los primeros dígitos.
export function detectBrand(number) {
  const n = (number || "").replace(/\D/g, "");
  if (/^4/.test(n)) return { id: "visa", name: "Visa", icon: "card" };
  if (/^(5[1-5]|2[2-7])/.test(n))
    return { id: "mastercard", name: "Mastercard", icon: "card" };
  if (/^3[47]/.test(n)) return { id: "amex", name: "American Express", icon: "card" };
  if (/^6(011|5)/.test(n)) return { id: "discover", name: "Discover", icon: "card" };
  return { id: "unknown", name: "Tarjeta", icon: "card-outline" };
}

// Longitud esperada del número según la marca (Amex = 15, resto = 16).
function expectedLength(brandId) {
  return brandId === "amex" ? 15 : 16;
}

// Longitud esperada del CVV (Amex = 4, resto = 3).
export function expectedCvvLength(brandId) {
  return brandId === "amex" ? 4 : 3;
}

// Algoritmo de Luhn: valida que el número de tarjeta sea matemáticamente correcto.
export function luhnValid(number) {
  const n = (number || "").replace(/\D/g, "");
  if (n.length < 12) return false;
  let sum = 0;
  let double = false;
  for (let i = n.length - 1; i >= 0; i--) {
    let digit = parseInt(n[i], 10);
    if (double) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    double = !double;
  }
  return sum % 10 === 0;
}

// Formatea el número agrupando de a 4 (Amex: 4-6-5).
export function formatCardNumber(raw) {
  const n = (raw || "").replace(/\D/g, "");
  const brand = detectBrand(n);
  const max = expectedLength(brand.id);
  const digits = n.slice(0, max);
  if (brand.id === "amex") {
    const parts = [digits.slice(0, 4), digits.slice(4, 10), digits.slice(10, 15)];
    return parts.filter(Boolean).join(" ");
  }
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

// Formatea la fecha de expiración como "MM/AA".
export function formatExpiry(raw) {
  const n = (raw || "").replace(/\D/g, "").slice(0, 4);
  if (n.length <= 2) return n;
  return `${n.slice(0, 2)}/${n.slice(2)}`;
}

// Valida que la fecha MM/AA sea válida y no esté vencida.
// (reference se pasa como Date para no depender de "ahora" en el helper.)
export function expiryValid(expiry, reference) {
  const m = (expiry || "").match(/^(\d{2})\/(\d{2})$/);
  if (!m) return false;
  const month = parseInt(m[1], 10);
  const year = 2000 + parseInt(m[2], 10);
  if (month < 1 || month > 12) return false;
  const ref = reference || new Date();
  // Vence al final del mes indicado.
  const expDate = new Date(year, month, 0, 23, 59, 59);
  return expDate >= ref;
}

// Devuelve los últimos 4 dígitos del número.
export function last4(number) {
  const n = (number || "").replace(/\D/g, "");
  return n.slice(-4);
}

// Valida el formulario completo de tarjeta. Devuelve { valid, errors }.
export function validateCard({ number, expiry, cvv, name }, reference) {
  const errors = {};
  const digits = (number || "").replace(/\D/g, "");
  const brand = detectBrand(digits);

  if (!name || !name.trim()) {
    errors.name = "Ingresa el nombre del titular";
  }
  if (digits.length !== expectedLength(brand.id) || !luhnValid(digits)) {
    errors.number = "Número de tarjeta inválido";
  }
  if (!expiryValid(expiry, reference)) {
    errors.expiry = "Fecha inválida o vencida";
  }
  if ((cvv || "").replace(/\D/g, "").length !== expectedCvvLength(brand.id)) {
    errors.cvv = "CVV inválido";
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
