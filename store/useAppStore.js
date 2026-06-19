// store/useAppStore.js
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVORITES_KEY = "@aventurard_favorites";
const ONBOARDING_KEY = "@aventurard_onboarding";
const AUTH_KEY = "@aventurard_auth";

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
}));
