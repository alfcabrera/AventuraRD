// firebase/config.js
// Inicialización del SDK de Firebase (JS SDK — compatible con Expo Go).
//
// ⚠️  Completa apiKey y appId con los valores de tu app Web en la consola de
//     Firebase: Configuración del proyecto → "Tus apps" → app Web → SDK setup.
//     Los demás valores ya corresponden al proyecto "aventurard".
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  initializeAuth,
  getAuth,
  getReactNativePersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const firebaseConfig = {
  apiKey: "AIzaSyDM035Ynph2olGS_xeGW7PEdi73Zwh-b8c",
  authDomain: "aventurard.firebaseapp.com",
  projectId: "aventurard",
  storageBucket: "aventurard.firebasestorage.app",
  messagingSenderId: "625478589056",
  appId: "1:625478589056:web:9068f578a144ad8dc2e465",
};

// Evita re-inicializar la app durante Fast Refresh.
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Auth con persistencia en AsyncStorage para que la sesión sobreviva al reinicio.
// initializeAuth lanza si ya fue inicializado (Fast Refresh) → caemos a getAuth.
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  auth = getAuth(app);
}

export { app, auth };
export const db = getFirestore(app);
