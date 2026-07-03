// constants/roles.js
// Enfoque simple de "operador único": un solo correo puede acceder al panel de
// confirmación de reservas. Para cambiar quién es el operador, edita este correo
// (y el mismo valor en firestore.rules).
export const OPERATOR_EMAIL = "operador@aventurard.com";

export const isOperatorUser = (user) =>
  !!user && (user.email || "").toLowerCase() === OPERATOR_EMAIL.toLowerCase();
