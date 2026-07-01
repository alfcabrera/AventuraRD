// store/useAppStore.js
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVORITES_KEY = "@aventurard_favorites";
const ONBOARDING_KEY = "@aventurard_onboarding";
const AUTH_KEY = "@aventurard_auth";
const RESERVATIONS_KEY = "@aventurard_reservations";

// Tarifa de servicio del marketplace (estilo Viator): 10% sobre el subtotal.
export const SERVICE_FEE_RATE = 0.1;

// Operador local (el "tercero" que recibe la reserva) según la categoría.
export const operatorForCategory = (category) => {
  switch (category) {
    case "Aventura":
      return {
        name: "Punta Cana Adventures",
        contact: "reservas@puntacana-adventures.do",
        phone: "+1 809-555-0142",
      };
    case "Ecoturismo":
      return {
        name: "EcoRutas del Este",
        contact: "hola@ecorutas-este.do",
        phone: "+1 809-555-0187",
      };
    case "Turismo Comunitario":
      return {
        name: "Red Comunitaria del Este",
        contact: "contacto@redcomunitaria-este.do",
        phone: "+1 809-555-0123",
      };
    default:
      return {
        name: "AventuraRD Partners",
        contact: "reservas@aventurard.do",
        phone: "+1 809-555-0100",
      };
  }
};

// Estado efectivo de la reserva. `status` almacenado es "confirmada" o "cancelada";
// "completada" se deriva cuando la fecha de la experiencia ya pasó.
export const reservationStatus = (reservation) => {
  if (!reservation) return "confirmada";
  if (reservation.status === "cancelada") return "cancelada";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(reservation.date + "T00:00:00");
  if (date < today) return "completada";
  return "confirmada";
};

export const useAppStore = create((set, get) => ({
  // ─── Auth State ───────────────────────────────────────────────
  user: null,
  isAuthenticated: false,

  setUser: (user) => {
    set({ user, isAuthenticated: !!user });
    AsyncStorage.setItem(AUTH_KEY, JSON.stringify(user));
  },

  logout: async () => {
    await AsyncStorage.removeItem(AUTH_KEY);
    set({ user: null, isAuthenticated: false });
  },

  loadAuthState: async () => {
    try {
      const stored = await AsyncStorage.getItem(AUTH_KEY);
      if (stored) {
        const user = JSON.parse(stored);
        set({ user, isAuthenticated: true });
      }
    } catch (e) {
      console.error("Failed to load auth state", e);
    }
  },

  // ─── Onboarding State ─────────────────────────────────────────
  onboardingCompleted: false,

  setOnboardingCompleted: async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, "true");
    set({ onboardingCompleted: true });
  },

  loadOnboardingState: async () => {
    try {
      const value = await AsyncStorage.getItem(ONBOARDING_KEY);
      set({ onboardingCompleted: value === "true" });
    } catch (e) {
      console.error("Failed to load onboarding state", e);
    }
  },

  // ─── Favorites State ──────────────────────────────────────────
  favorites: [],

  toggleFavorite: async (destination) => {
    const { favorites } = get();
    const exists = favorites.some((f) => f.id === destination.id);
    const updated = exists
      ? favorites.filter((f) => f.id !== destination.id)
      : [...favorites, destination];
    set({ favorites: updated });
    try {
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save favorites", e);
    }
  },

  isFavorite: (id) => {
    return get().favorites.some((f) => f.id === id);
  },

  loadFavorites: async () => {
    try {
      const stored = await AsyncStorage.getItem(FAVORITES_KEY);
      if (stored) {
        set({ favorites: JSON.parse(stored) });
      }
    } catch (e) {
      console.error("Failed to load favorites", e);
    }
  },

  // ─── Reservations State ───────────────────────────────────────
  reservations: [],

  _persistReservations: async (reservations) => {
    try {
      await AsyncStorage.setItem(RESERVATIONS_KEY, JSON.stringify(reservations));
    } catch (e) {
      console.error("Failed to save reservations", e);
    }
  },

  // Crea una reserva y la "envía" al operador local (el tercero).
  // Devuelve la reserva creada para poder navegar a su confirmación.
  addReservation: (reservation) => {
    const now = new Date();
    const ref =
      "ARD-" +
      now.getFullYear().toString().slice(-2) +
      (now.getTime().toString(36).slice(-5) + "0000").slice(0, 5).toUpperCase();
    const created = {
      id: "res_" + now.getTime(),
      reference: ref,
      status: "confirmada",
      createdAt: now.toISOString(),
      review: null,
      ...reservation,
    };
    const updated = [created, ...get().reservations];
    set({ reservations: updated });
    get()._persistReservations(updated);
    return created;
  },

  // Solo para pruebas: adelanta la fecha al pasado para que la reserva
  // se derive como "completada" y habilite dejar reseña.
  completeReservationDemo: (id) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const iso =
      yesterday.getFullYear() +
      "-" +
      String(yesterday.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(yesterday.getDate()).padStart(2, "0");
    const updated = get().reservations.map((r) =>
      r.id === id ? { ...r, date: iso, status: "confirmada" } : r
    );
    set({ reservations: updated });
    get()._persistReservations(updated);
  },

  cancelReservation: (id) => {
    const updated = get().reservations.map((r) =>
      r.id === id ? { ...r, status: "cancelada" } : r
    );
    set({ reservations: updated });
    get()._persistReservations(updated);
  },

  // Registra la reseña de una experiencia ya culminada.
  addReview: (id, review) => {
    const updated = get().reservations.map((r) =>
      r.id === id
        ? {
            ...r,
            review: {
              rating: review.rating,
              comment: review.comment || "",
              createdAt: new Date().toISOString(),
            },
          }
        : r
    );
    set({ reservations: updated });
    get()._persistReservations(updated);
  },

  getReservationById: (id) => get().reservations.find((r) => r.id === id),

  // Reseñas publicadas para un destino (para mostrarlas en su ficha).
  getReviewsForDestination: (destinationId) =>
    get()
      .reservations.filter(
        (r) => r.destinationId === destinationId && r.review
      )
      .map((r) => ({
        ...r.review,
        author: r.contactName || "Aventurero",
        reservationId: r.id,
      })),

  loadReservations: async () => {
    try {
      const stored = await AsyncStorage.getItem(RESERVATIONS_KEY);
      if (stored) {
        set({ reservations: JSON.parse(stored) });
      }
    } catch (e) {
      console.error("Failed to load reservations", e);
    }
  },
}));
