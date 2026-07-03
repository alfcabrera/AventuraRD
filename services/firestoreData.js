// services/firestoreData.js
// Persistencia en Firestore:
//   - Favoritos por usuario:  users/{uid}/favorites/{destinationId}
//   - Reservas en colección de nivel superior:  reservations/{reservationId}
//     (con campo `userId`), para que el operador pueda ver las de todos.
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/firebase/config";

// ─── Favoritos (guardamos solo el id del destino) ──────────────────
const favoritesCol = (uid) => collection(db, "users", uid, "favorites");

export async function fetchFavoriteIds(uid) {
  const snap = await getDocs(favoritesCol(uid));
  return snap.docs.map((d) => d.id);
}

export async function addFavorite(uid, destinationId) {
  await setDoc(doc(db, "users", uid, "favorites", destinationId), {
    destinationId,
    addedAt: new Date().toISOString(),
  });
}

export async function removeFavorite(uid, destinationId) {
  await deleteDoc(doc(db, "users", uid, "favorites", destinationId));
}

// ─── Reservas (colección top-level `reservations`) ─────────────────
const reservationsCol = () => collection(db, "reservations");

// Reservas de un usuario concreto (las que ve el cliente).
export async function fetchReservations(uid) {
  const snap = await getDocs(query(reservationsCol(), where("userId", "==", uid)));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function saveReservation(uid, reservation) {
  await setDoc(doc(db, "reservations", reservation.id), {
    ...reservation,
    userId: uid,
  });
}

export async function patchReservation(id, patch) {
  await updateDoc(doc(db, "reservations", id), patch);
}

// Todas las reservas (solo para el operador, que las revisa y confirma).
export async function fetchAllReservations() {
  const snap = await getDocs(reservationsCol());
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
