// app/operator/index.js
// Panel del operador: solo el correo OPERATOR_EMAIL puede acceder.
// Lista las reservas pendientes de todos los usuarios y permite confirmarlas
// o rechazarlas (para que no se confirmen automáticamente).
import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useRouter, useFocusEffect, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppStore, reservationStatus } from "@/store/useAppStore";
import { fetchAllReservations, patchReservation } from "@/services/firestoreData";
import { sendReservationStatusEmail } from "@/services/email";
import { destinations } from "@/data/destinations";
import { isOperatorUser, OPERATOR_EMAIL } from "@constants/roles";
import PrimaryButton from "@components/PrimaryButton";
import { Colors } from "@constants/colors";

const MONTHS = [
  "ene", "feb", "mar", "abr", "may", "jun",
  "jul", "ago", "sep", "oct", "nov", "dic",
];

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

function formatTime(hhmm) {
  if (!hhmm) return null;
  const [h, m] = hhmm.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

// Al abrir /operator directamente (p. ej. desde el botón "Confirmar reserva" del
// correo) no hay pantalla previa en el historial y router.back() no hace nada.
// En ese caso volvemos al perfil, que es desde donde se entra al panel.
const goBack = (router) => {
  if (router.canGoBack()) router.back();
  else router.replace("/(tabs)/profile");
};

const imageFor = (destinationId) =>
  destinations.find((d) => d.id === destinationId)?.image;

function PendingCard({ reservation, busy, highlight, onConfirm, onReject }) {
  const r = reservation;
  return (
    <View
      style={{
        backgroundColor: Colors.card,
        borderRadius: 18,
        borderWidth: highlight ? 2 : 1,
        borderColor: highlight ? Colors.primary : Colors.border,
        padding: 14,
        marginBottom: 14,
        gap: 12,
      }}
    >
      {highlight ? (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Ionicons name="mail-open-outline" size={14} color={Colors.primary} />
          <Text style={{ fontSize: 11, fontFamily: "Poppins_600SemiBold", color: Colors.primary }}>
            Reserva del correo
          </Text>
        </View>
      ) : null}
      <View style={{ flexDirection: "row", gap: 12 }}>
        <Image
          source={imageFor(r.destinationId)}
          style={{ width: 70, height: 70, borderRadius: 12, backgroundColor: Colors.background }}
          resizeMode="cover"
        />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 15, fontFamily: "Poppins_600SemiBold", color: Colors.textPrimary }} numberOfLines={1}>
            {r.title}
          </Text>
          <Text style={{ fontSize: 12, fontFamily: "Poppins_400Regular", color: Colors.textMuted, marginTop: 2 }}>
            {r.reference}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5, marginTop: 4, flexWrap: "wrap" }}>
            <Ionicons name="calendar-outline" size={13} color={Colors.textSecondary} />
            <Text style={{ fontSize: 12, fontFamily: "Poppins_400Regular", color: Colors.textSecondary }}>
              {formatDate(r.date)}
            </Text>
            {r.time ? (
              <>
                <Text style={{ color: Colors.textMuted }}>·</Text>
                <Ionicons name="time-outline" size={13} color={Colors.textSecondary} />
                <Text style={{ fontSize: 12, fontFamily: "Poppins_400Regular", color: Colors.textSecondary }}>
                  {formatTime(r.time)}
                </Text>
              </>
            ) : null}
            <Text style={{ color: Colors.textMuted }}>·</Text>
            <Ionicons name="people-outline" size={13} color={Colors.textSecondary} />
            <Text style={{ fontSize: 12, fontFamily: "Poppins_400Regular", color: Colors.textSecondary }}>
              {r.people}
            </Text>
          </View>
        </View>
        <Text style={{ fontSize: 16, fontFamily: "Poppins_700Bold", color: Colors.primary }}>
          ${r.total}
        </Text>
      </View>

      {/* Datos del cliente */}
      <View style={{ backgroundColor: Colors.background, borderRadius: 12, padding: 12, gap: 6 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Ionicons name="person-outline" size={14} color={Colors.textMuted} />
          <Text style={{ fontSize: 13, fontFamily: "Poppins_500Medium", color: Colors.textPrimary }}>
            {r.contactName || "Sin nombre"}
          </Text>
        </View>
        {r.contactEmail ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Ionicons name="mail-outline" size={14} color={Colors.textMuted} />
            <Text style={{ fontSize: 12, fontFamily: "Poppins_400Regular", color: Colors.textSecondary }}>
              {r.contactEmail}
            </Text>
          </View>
        ) : null}
        {r.contactPhone ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Ionicons name="call-outline" size={14} color={Colors.textMuted} />
            <Text style={{ fontSize: 12, fontFamily: "Poppins_400Regular", color: Colors.textSecondary }}>
              {r.contactPhone}
            </Text>
          </View>
        ) : null}
        {r.payment?.label ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Ionicons name="card-outline" size={14} color={Colors.textMuted} />
            <Text style={{ fontSize: 12, fontFamily: "Poppins_400Regular", color: Colors.textSecondary }}>
              {r.payment.label}
              {r.payment.status ? ` · ${r.payment.status === "pagado" ? "Pagado" : "Pago pendiente"}` : ""}
            </Text>
          </View>
        ) : null}
      </View>

      {/* Acciones */}
      {busy ? (
        <View style={{ paddingVertical: 8, alignItems: "center" }}>
          <ActivityIndicator color={Colors.primary} />
        </View>
      ) : (
        <View style={{ flexDirection: "row", gap: 12 }}>
          <PrimaryButton
            title="Rechazar"
            variant="outline"
            onPress={onReject}
            style={{ flex: 1, borderColor: Colors.danger }}
            textStyle={{ color: Colors.danger }}
          />
          <PrimaryButton title="Confirmar" onPress={onConfirm} style={{ flex: 1 }} />
        </View>
      )}
    </View>
  );
}

export default function OperatorScreen() {
  const router = useRouter();
  const user = useAppStore((s) => s.user);
  const authLoaded = useAppStore((s) => s.authLoaded);
  const allowed = isOperatorUser(user);

  // El botón "Confirmar reserva" del correo llega como /operator?ref=ARD-XXXXX.
  // Usamos la referencia para poner esa reserva primero y resaltarla.
  const params = useLocalSearchParams();
  const focusRef = (Array.isArray(params.ref) ? params.ref[0] : params.ref) || null;

  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const all = await fetchAllReservations();
      const isFocused = (r) =>
        focusRef && (r.reference || "").toUpperCase() === focusRef.toUpperCase();
      setPending(
        all
          .filter((r) => reservationStatus(r) === "pendiente")
          .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""))
          // La reserva enlazada desde el correo va siempre arriba.
          .sort((a, b) => Number(isFocused(b)) - Number(isFocused(a)))
      );
    } catch (e) {
      console.error("Failed to load reservations for operator", e);
      setError(e?.code || e?.message || "No se pudieron cargar las reservas");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [focusRef]);

  useFocusEffect(
    useCallback(() => {
      if (allowed) load();
    }, [allowed, load])
  );

  const decide = async (id, status) => {
    setBusyId(id);
    try {
      const reservation = pending.find((r) => r.id === id);
      await patchReservation(id, { status });

      // Avisamos al aventurero del nuevo estado. No bloquea la decisión del
      // operador: si el correo falla, la reserva ya quedó actualizada.
      if (reservation) {
        sendReservationStatusEmail(
          { ...reservation, status },
          destinations.find((d) => d.id === reservation.destinationId),
          status
        ).catch((err) =>
          console.warn("No se pudo enviar el aviso de estado:", err?.message || err)
        );
      }

      setPending((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      console.error("Failed to update reservation", e);
    } finally {
      setBusyId(null);
    }
  };

  // ─── Guard de acceso ────────────────────────────────────────────
  if (!allowed) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background }}>
        <Header router={router} />
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 32, gap: 12 }}>
          <Ionicons name="lock-closed-outline" size={40} color={Colors.textMuted} />
          <Text style={{ fontSize: 16, fontFamily: "Poppins_600SemiBold", color: Colors.textPrimary, textAlign: "center" }}>
            Acceso restringido
          </Text>
          <Text style={{ fontSize: 13, fontFamily: "Poppins_400Regular", color: Colors.textSecondary, textAlign: "center" }}>
            {!authLoaded
              ? "Cargando..."
              : user
              ? "Esta sección es solo para el operador autorizado."
              : `Inicia sesión con la cuenta del operador (${OPERATOR_EMAIL}) para confirmar la reserva.`}
          </Text>
          {authLoaded && !user ? (
            // Caso típico al llegar desde el botón del correo sin sesión abierta.
            <PrimaryButton
              title="Iniciar sesión"
              onPress={() => router.replace("/(auth)/login")}
              style={{ marginTop: 8 }}
            />
          ) : (
            <PrimaryButton title="Volver" variant="outline" onPress={() => goBack(router)} style={{ marginTop: 8 }} />
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <Header router={router} subtitle={`${pending.length} pendiente${pending.length !== 1 ? "s" : ""}`} />

      {loading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : error ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 32, gap: 12 }}>
          <Ionicons name="alert-circle-outline" size={48} color={Colors.danger} />
          <Text style={{ fontSize: 16, fontFamily: "Poppins_600SemiBold", color: Colors.textPrimary, textAlign: "center" }}>
            No se pudieron cargar las reservas
          </Text>
          <Text style={{ fontSize: 13, fontFamily: "Poppins_400Regular", color: Colors.textSecondary, textAlign: "center" }}>
            {String(error)}
            {String(error).includes("permission")
              ? "\n\n¿Publicaste las reglas de Firestore y estás usando el correo del operador?"
              : ""}
          </Text>
          <PrimaryButton title="Reintentar" onPress={load} style={{ marginTop: 8 }} />
        </View>
      ) : pending.length === 0 ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 32, gap: 12 }}>
          <Ionicons name="checkmark-done-circle-outline" size={48} color={Colors.primary} />
          <Text style={{ fontSize: 16, fontFamily: "Poppins_600SemiBold", color: Colors.textPrimary }}>
            No hay reservas pendientes
          </Text>
          <Text style={{ fontSize: 13, fontFamily: "Poppins_400Regular", color: Colors.textSecondary, textAlign: "center" }}>
            Cuando un cliente reserve, aparecerá aquí para que la confirmes.
          </Text>
        </View>
      ) : (
        <FlatList
          data={pending}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                load();
              }}
              tintColor={Colors.primary}
            />
          }
          renderItem={({ item }) => (
            <PendingCard
              reservation={item}
              busy={busyId === item.id}
              highlight={
                !!focusRef &&
                (item.reference || "").toUpperCase() === focusRef.toUpperCase()
              }
              onConfirm={() => decide(item.id, "confirmada")}
              onReject={() => decide(item.id, "cancelada")}
            />
          )}
        />
      )}
    </View>
  );
}

function Header({ router, subtitle }) {
  return (
    <SafeAreaView edges={["top"]} style={{ backgroundColor: Colors.card }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: Colors.border,
        }}
      >
        <TouchableOpacity
          onPress={() => goBack(router)}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: Colors.background,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="arrow-back" size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View>
          <Text style={{ fontSize: 17, fontFamily: "Poppins_600SemiBold", color: Colors.textPrimary }}>
            Panel de operador
          </Text>
          {subtitle ? (
            <Text style={{ fontSize: 12, fontFamily: "Poppins_400Regular", color: Colors.textMuted }}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
}
