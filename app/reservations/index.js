// app/reservations/index.js
import React, { useCallback } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useAppStore, reservationStatus } from "@/store/useAppStore";
import PrimaryButton from "@components/PrimaryButton";
import { EmptyState } from "@components/UI";
import { Colors } from "@constants/colors";

const MONTHS = [
  "ene", "feb", "mar", "abr", "may", "jun",
  "jul", "ago", "sep", "oct", "nov", "dic",
];

function formatShortDate(iso) {
  const d = new Date(iso + "T00:00:00");
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

// Convierte "14:30" a formato 12h: "2:30 PM".
function formatTime(hhmm) {
  if (!hhmm) return null;
  const [h, m] = hhmm.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

const statusConfig = {
  pendiente: { label: "Pendiente", color: Colors.accent, icon: "hourglass-outline" },
  confirmada: { label: "Confirmada", color: Colors.primary, icon: "checkmark-circle" },
  completada: { label: "Completada", color: Colors.secondary, icon: "flag" },
  cancelada: { label: "Cancelada", color: Colors.danger, icon: "close-circle" },
};

function ReservationCard({ reservation, index, onPress }) {
  const status = reservationStatus(reservation);
  const conf = statusConfig[status];
  const needsReview = status === "completada" && !reservation.review;

  return (
    <Animated.View entering={FadeInDown.delay(index * 70).springify()}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        style={{
          backgroundColor: Colors.card,
          borderRadius: 18,
          marginBottom: 14,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: Colors.border,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 2,
        }}
      >
        <View style={{ flexDirection: "row", padding: 12, gap: 14 }}>
          <Image
            source={reservation.image}
            style={{ width: 90, height: 90, borderRadius: 14 }}
            resizeMode="cover"
          />
          <View style={{ flex: 1, justifyContent: "space-between" }}>
            <View>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Text
                  style={{ fontSize: 15, fontFamily: "Poppins_600SemiBold", color: Colors.textPrimary, flex: 1, marginRight: 8 }}
                  numberOfLines={1}
                >
                  {reservation.title}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                    backgroundColor: conf.color + "18",
                    borderRadius: 12,
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                  }}
                >
                  <Ionicons name={conf.icon} size={11} color={conf.color} />
                  <Text style={{ fontSize: 10, fontFamily: "Poppins_600SemiBold", color: conf.color }}>
                    {conf.label}
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 5, marginTop: 6 }}>
                <Ionicons name="calendar-outline" size={13} color={Colors.textSecondary} />
                <Text style={{ fontSize: 12, fontFamily: "Poppins_400Regular", color: Colors.textSecondary }}>
                  {formatShortDate(reservation.date)}
                </Text>
                {reservation.time ? (
                  <>
                    <Text style={{ fontSize: 12, color: Colors.textMuted }}>·</Text>
                    <Ionicons name="time-outline" size={13} color={Colors.textSecondary} />
                    <Text style={{ fontSize: 12, fontFamily: "Poppins_400Regular", color: Colors.textSecondary }}>
                      {formatTime(reservation.time)}
                    </Text>
                  </>
                ) : null}
                <Text style={{ fontSize: 12, color: Colors.textMuted }}>·</Text>
                <Ionicons name="people-outline" size={13} color={Colors.textSecondary} />
                <Text style={{ fontSize: 12, fontFamily: "Poppins_400Regular", color: Colors.textSecondary }}>
                  {reservation.people}
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={{ fontSize: 11, fontFamily: "Poppins_400Regular", color: Colors.textMuted }}>
                {reservation.reference}
              </Text>
              <Text style={{ fontSize: 17, fontFamily: "Poppins_700Bold", color: Colors.primary }}>
                ${reservation.total}
              </Text>
            </View>
          </View>
        </View>

        {needsReview && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              backgroundColor: "rgba(244,160,36,0.12)",
              paddingHorizontal: 14,
              paddingVertical: 10,
            }}
          >
            <Ionicons name="star" size={15} color={Colors.accent} />
            <Text style={{ flex: 1, fontSize: 12, fontFamily: "Poppins_500Medium", color: "#B37400" }}>
              Experiencia culminada — deja tu reseña
            </Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.accent} />
          </View>
        )}
        {reservation.review && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              backgroundColor: Colors.background,
              paddingHorizontal: 14,
              paddingVertical: 10,
            }}
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <Ionicons
                key={n}
                name={n <= reservation.review.rating ? "star" : "star-outline"}
                size={13}
                color={Colors.accent}
              />
            ))}
            <Text style={{ marginLeft: 4, fontSize: 12, fontFamily: "Poppins_400Regular", color: Colors.textMuted }}>
              Tu reseña
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function ReservationsScreen() {
  const router = useRouter();
  const reservations = useAppStore((s) => s.reservations);
  const loadReservations = useAppStore((s) => s.loadReservations);

  // Al enfocar la pantalla, recargamos por si el operador confirmó una reserva.
  useFocusEffect(
    useCallback(() => {
      loadReservations();
    }, [loadReservations])
  );

  const isUpcoming = (r) => {
    const s = reservationStatus(r);
    return s === "pendiente" || s === "confirmada";
  };
  const active = reservations.filter(isUpcoming);
  const past = reservations.filter((r) => !isUpcoming(r));

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      {/* Header */}
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
            onPress={() => router.back()}
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
          <Text style={{ fontSize: 17, fontFamily: "Poppins_600SemiBold", color: Colors.textPrimary }}>
            Mis reservas
          </Text>
        </View>
      </SafeAreaView>

      {reservations.length === 0 ? (
        <EmptyState
          icon="calendar-outline"
          title="Aún no tienes reservas"
          description="Explora las experiencias del Este dominicano y reserva tu próxima aventura."
          action={
            <PrimaryButton
              title="Explorar experiencias"
              onPress={() => router.replace("/(tabs)/explore")}
            />
          }
        />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
          {active.length > 0 && (
            <>
              <Text style={{ fontSize: 13, fontFamily: "Poppins_600SemiBold", color: Colors.textMuted, marginBottom: 14, letterSpacing: 0.6, textTransform: "uppercase" }}>
                Próximas
              </Text>
              {active.map((r, i) => (
                <ReservationCard
                  key={r.id}
                  reservation={r}
                  index={i}
                  onPress={() => router.push(`/reservations/${r.id}`)}
                />
              ))}
            </>
          )}

          {past.length > 0 && (
            <>
              <Text style={{ fontSize: 13, fontFamily: "Poppins_600SemiBold", color: Colors.textMuted, marginBottom: 14, marginTop: active.length > 0 ? 12 : 0, letterSpacing: 0.6, textTransform: "uppercase" }}>
                Historial
              </Text>
              {past.map((r, i) => (
                <ReservationCard
                  key={r.id}
                  reservation={r}
                  index={i}
                  onPress={() => router.push(`/reservations/${r.id}`)}
                />
              ))}
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
}
