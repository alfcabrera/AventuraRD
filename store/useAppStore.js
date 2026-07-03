// store/useAppStore.js
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { destinations } from "@/data/destinations";
import {
  subscribeToAuth,
  fetchOrCreateProfile,
  logoutFirebase,
} from "@/services/firebaseAuth";
import {
  fetchFavoriteIds,
  addFavorite,
  removeFavorite,
  fetchReservations,
  saveReservation,
  patchReservation,
} from "@/services/firestoreData";

// Se guardan en el dispositivo (no dependen de la cuenta):
//   - onboarding: si ya se vio la intro.
//   - tarjeta: solo datos NO sensibles (marca, últimos 4, titular).
const ONBOARDING_KEY = "@aventurard_onboarding";
const SAVED_CARD_KEY = "@aventurard_saved_card";

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

// Estado efectivo de la reserva. `status` almacenado es "pendiente",
// "confirmada" o "cancelada". "completada" se deriva cuando una reserva ya
// confirmada tiene fecha pasada. Una reserva "pendiente" espera la confirmación
// del operador antes de poder usarse/reseñarse.
export const reservationStatus = (reservation) => {
  if (!reservation) return "pendiente";
  if (reservation.status === "cancelada") return "cancelada";
  if (reservation.status === "pendiente") return "pendiente";
  // status === "confirmada"
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(reservation.date + "T00:00:00");
  if (date < today) return "completada";
  return "confirmada";
};

// Las imágenes de los destinos son require() locales: no se guardan en Firestore.
// Al leer una reserva re-adjuntamos la imagen desde los datos locales.
const attachImage = (reservation) => ({
  ...reservation,
  image: destinations.find((d) => d.id === reservation.destinationId)?.image,
});

export const useAppStore = create((set, get) => ({
  // ─── Auth State ───────────────────────────────────────────────
  user: null,
  isAuthenticated: false,
  authLoaded: false, // true tras la primera resolución de sesión de Firebase

  // Escucha la sesión de Firebase. Se llama una vez desde el RootLayout y
  // carga los datos del usuario (favoritos/reservas) al iniciar sesión.
  initAuth: () => {
    return subscribeToAuth(async (fbUser) => {
      if (fbUser) {
        try {
          const profile = await fetchOrCreateProfile(fbUser);
          set({ user: profile, isAuthenticated: true });
          await Promise.all([get().loadFavorites(), get().loadReservations()]);
        } catch (e) {
          console.error("Failed to load user session", e);
          set({
            user: { id: fbUser.uid, email: fbUser.email },
            isAuthenticated: true,
          });
        }
      } else {
        set({
          user: null,
          isAuthenticated: false,
          favorites: [],
          reservations: [],
        });
      }
      set({ authLoaded: true });
    });
  },

  logout: async () => {
    try {
      await logoutFirebase();
    } catch (e) {
      console.error("Failed to logout", e);
    }
    // El listener de initAuth limpia user/favorites/reservations.
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
  // En memoria guardamos el destino completo (para la UI); en Firestore solo el id.
  favorites: [],

  toggleFavorite: async (destination) => {
    const uid = get().user?.id;
    if (!uid) return;
    const { favorites } = get();
    const exists = favorites.some((f) => f.id === destination.id);
    const updated = exists
      ? favorites.filter((f) => f.id !== destination.id)
      : [...favorites, destination];
    set({ favorites: updated }); // optimista
    try {
      if (exists) {
        await removeFavorite(uid, destination.id);
      } else {
        await addFavorite(uid, destination.id);
      }
    } catch (e) {
      console.error("Failed to save favorite", e);
      set({ favorites }); // revertir
    }
  },

  isFavorite: (id) => {
    return get().favorites.some((f) => f.id === id);
  },

  loadFavorites: async () => {
    const uid = get().user?.id;
    if (!uid) return;
    try {
      const ids = await fetchFavoriteIds(uid);
      const favorites = ids
        .map((id) => destinations.find((d) => d.id === id))
        .filter(Boolean);
      set({ favorites });
    } catch (e) {
      console.error("Failed to load favorites", e);
    }
  },

  // ─── Reservations State ───────────────────────────────────────
  reservations: [],

  // Crea una reserva y la "envía" al operador local (el tercero).
  // Devuelve la reserva creada para poder navegar a su confirmación.
  addReservation: async (reservation) => {
    const uid = get().user?.id;
    const now = new Date();
    const ref =
      "ARD-" +
      now.getFullYear().toString().slice(-2) +
      (now.getTime().toString(36).slice(-5) + "0000").slice(0, 5).toUpperCase();
    const created = {
      id: "res_" + now.getTime(),
      reference: ref,
      status: "pendiente", // el operador debe confirmarla
      createdAt: now.toISOString(),
      review: null,
      ...reservation,
    };
    // En memoria conservamos la imagen; en Firestore no se guarda el require().
    const { image, ...toStore } = created;
    set({ reservations: [created, ...get().reservations] });
    if (!uid) {
      // Sin sesión no podemos persistir: revertimos y avisamos.
      set({ reservations: get().reservations.filter((r) => r.id !== created.id) });
      throw new Error("No hay sesión activa para guardar la reserva.");
    }
    try {
      await saveReservation(uid, toStore);
    } catch (e) {
      console.error("Failed to save reservation", e);
      // Revertimos el estado optimista para no dejar reservas "fantasma".
      set({ reservations: get().reservations.filter((r) => r.id !== created.id) });
      throw e;
    }
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
    if (get().user?.id)
      patchReservation(id, { date: iso, status: "confirmada" }).catch((e) =>
        console.error("Failed to update reservation", e)
      );
  },

  cancelReservation: (id) => {
    const updated = get().reservations.map((r) =>
      r.id === id ? { ...r, status: "cancelada" } : r
    );
    set({ reservations: updated });
    if (get().user?.id)
      patchReservation(id, { status: "cancelada" }).catch((e) =>
        console.error("Failed to cancel reservation", e)
      );
  },

  // Registra la reseña de una experiencia ya culminada.
  addReview: (id, review) => {
    const newReview = {
      rating: review.rating,
      comment: review.comment || "",
      createdAt: new Date().toISOString(),
    };
    const updated = get().reservations.map((r) =>
      r.id === id ? { ...r, review: newReview } : r
    );
    set({ reservations: updated });
    if (get().user?.id)
      patchReservation(id, { review: newReview }).catch((e) =>
        console.error("Failed to save review", e)
      );
  },

  getReservationById: (id) => get().reservations.find((r) => r.id === id),

  // ─── Tarjeta guardada (enmascarada) ───────────────────────────
  // Solo se guarda info NO sensible: marca, últimos 4 y titular.
  // Nunca el número completo ni el CVV (pago simulado, sin backend).
  savedCard: null,

  setSavedCard: (card) => {
    set({ savedCard: card });
    AsyncStorage.setItem(SAVED_CARD_KEY, JSON.stringify(card)).catch((e) =>
      console.error("Failed to save card", e)
    );
  },

  clearSavedCard: async () => {
    try {
      await AsyncStorage.removeItem(SAVED_CARD_KEY);
    } catch (e) {
      console.error("Failed to clear card", e);
    }
    set({ savedCard: null });
  },

  loadSavedCard: async () => {
    try {
      const stored = await AsyncStorage.getItem(SAVED_CARD_KEY);
      if (stored) set({ savedCard: JSON.parse(stored) });
    } catch (e) {
      console.error("Failed to load saved card", e);
    }
  },

  // Reseñas publicadas para un destino (para mostrarlas en su ficha).
  getReviewsForDestination: (destinationId) =>
    get()
      .reservations.filter((r) => r.destinationId === destinationId && r.review)
      .map((r) => ({
        ...r.review,
        author: r.contactName || "Aventurero",
        reservationId: r.id,
      })),

  loadReservations: async () => {
    const uid = get().user?.id;
    if (!uid) return;
    try {
      const stored = await fetchReservations(uid);
      const reservations = stored
        .map(attachImage)
        .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
      set({ reservations });
    } catch (e) {
      console.error("Failed to load reservations", e);
    }
  },
}));
