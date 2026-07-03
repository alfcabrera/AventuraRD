// services/firebaseAuth.js
// Autenticación con Firebase Auth (email/contraseña) y perfil del usuario en
// Firestore (colección "users/{uid}").
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/config";

const DEFAULT_AVATAR = "https://i.pravatar.cc/150?img=7";

// Devuelve el perfil de la app a partir del usuario de Firebase. Si aún no
// existe el documento en Firestore, lo crea. `extra` permite pasar el nombre
// elegido en el registro.
//
// Importante: si Firestore no está disponible (aún sin crear, reglas, red...),
// NO bloqueamos la sesión: devolvemos un perfil derivado de Firebase Auth.
export async function fetchOrCreateProfile(fbUser, extra = {}) {
  const fallback = {
    id: fbUser.uid,
    name: extra.name || fbUser.displayName || "Aventurero",
    email: fbUser.email || "",
    avatar: extra.avatar || fbUser.photoURL || DEFAULT_AVATAR,
  };
  try {
    const ref = doc(db, "users", fbUser.uid);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return { id: fbUser.uid, ...snap.data() };
    }
    const profile = {
      name: fallback.name,
      email: fallback.email,
      avatar: fallback.avatar,
      createdAt: new Date().toISOString(),
    };
    await setDoc(ref, profile);
    return { id: fbUser.uid, ...profile };
  } catch (e) {
    console.warn(
      "No se pudo leer/crear el perfil en Firestore (¿falta crear la base o publicar reglas?):",
      e?.code || e?.message || e
    );
    return fallback;
  }
}

export async function registerWithEmail({ name, email, password }) {
  const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
  if (name) {
    await updateProfile(cred.user, { displayName: name });
  }
  await fetchOrCreateProfile(cred.user, { name });
  return cred.user;
}

export async function loginWithEmail({ email, password }) {
  const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
  return cred.user;
}

export function logoutFirebase() {
  return signOut(auth);
}

// Se dispara al iniciar la app (restaura sesión) y en cada login/logout.
export function subscribeToAuth(cb) {
  return onAuthStateChanged(auth, cb);
}

// Traduce los códigos de error de Firebase a mensajes en español.
export function authErrorMessage(code) {
  switch (code) {
    case "auth/invalid-email":
      return "El correo electrónico no es válido.";
    case "auth/email-already-in-use":
      return "Ya existe una cuenta con este correo.";
    case "auth/weak-password":
      return "La contraseña debe tener al menos 6 caracteres.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Correo o contraseña incorrectos.";
    case "auth/too-many-requests":
      return "Demasiados intentos. Inténtalo más tarde.";
    case "auth/network-request-failed":
      return "Sin conexión. Revisa tu internet.";
    default:
      return "Ocurrió un error. Inténtalo de nuevo.";
  }
}
