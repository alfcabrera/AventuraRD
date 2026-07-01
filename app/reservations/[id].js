// app/reservations/[id].js
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { useAppStore, reservationStatus } from "@/store/useAppStore";
import PrimaryButton from "@components/PrimaryButton";
import { Colors } from "@constants/colors";

const MONTHS = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

function formatLongDate(iso) {
  const d = new Date(iso + "T00:00:00");
  return `${d.getDate()} de ${MONTHS[d.getMonth()]}, ${d.getFullYear()}`;
}

const statusConfig = {
  confirmada: { label: "Confirmada", color: Colors.primary, icon: "checkmark-circle" },
  completada: { label: "Completada", color: Colors.secondary, icon: "flag" },
  cancelada: { label: "Cancelada", color: Colors.danger, icon: "close-circle" },
};

function Stars({ rating, size = 18, onSelect }) {
  return (
    <View style={{ flexDirection: "row", gap: 4 }}>
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= rating;
        const star = (
          <Ionicons
            name={filled ? "star" : "star-outline"}
            size={size}
            color={filled ? Colors.accent : Colors.textMuted}
          />
        );
        if (!onSelect) return <View key={n}>{star}</View>;
        return (
          <TouchableOpacity key={n} onPress={() => onSelect(n)} activeOpacity={0.7}>
            {star}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function Row({ label, value, valueColor, bold }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
      <Text
        style={{
          fontSize: bold ? 16 : 14,
          fontFamily: bold ? "Poppins_600SemiBold" : "Poppins_400Regular",
          color: bold ? Colors.textPrimary : Colors.textSecondary,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          fontSize: bold ? 20 : 14,
          fontFamily: bold ? "Poppins_700Bold" : "Poppins_500Medium",
          color: valueColor || (bold ? Colors.primary : Colors.textPrimary),
        }}
      >
        {value}
      </Text>
    </View>
  );
}

function Card({ children, style }) {
  return (
    <View
      style={[
        {
          backgroundColor: Colors.card,
          borderRadius: 18,
          borderWidth: 1,
          borderColor: Colors.border,
          padding: 18,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export default function ReservationDetailScreen() {
  const { id, justBooked } = useLocalSearchParams();
  const router = useRouter();
  const reservation = useAppStore((s) => s.getReservationById(id));
  const cancelReservation = useAppStore((s) => s.cancelReservation);
  const completeReservationDemo = useAppStore((s) => s.completeReservationDemo);
  const addReview = useAppStore((s) => s.addReview);

  const [reviewOpen, setReviewOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  if (!reservation) {
    return (
      <SafeAreaView style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: Colors.background }}>
        <Text style={{ fontFamily: "Poppins_500Medium", color: Colors.textSecondary }}>
          Reserva no encontrada
        </Text>
      </SafeAreaView>
    );
  }

  const status = reservationStatus(reservation);
  const conf = statusConfig[status];
  const isBooked = justBooked === "1";

  const handleClose = () => {
    if (isBooked) {
      router.replace("/reservations");
    } else {
      router.back();
    }
  };

  const confirmCancel = () => {
    cancelReservation(reservation.id);
    setCancelOpen(false);
  };

  const submitReview = () => {
    addReview(reservation.id, { rating, comment });
    setReviewOpen(false);
    Alert.alert("¡Gracias!", "Tu reseña ha sido publicada.");
  };

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
            onPress={handleClose}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: Colors.background,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name={isBooked ? "close" : "arrow-back"} size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={{ fontSize: 17, fontFamily: "Poppins_600SemiBold", color: Colors.textPrimary }}>
            {isBooked ? "Reserva confirmada" : "Detalle de reserva"}
          </Text>
        </View>
      </SafeAreaView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 40, gap: 16 }}
      >
        {/* Success banner (Viator-style third-party received) */}
        {isBooked && (
          <Animated.View entering={FadeIn.springify()}>
            <View
              style={{
                alignItems: "center",
                backgroundColor: Colors.primaryLight,
                borderRadius: 20,
                padding: 24,
              }}
            >
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  backgroundColor: Colors.primary,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 12,
                }}
              >
                <Ionicons name="checkmark" size={36} color="#fff" />
              </View>
              <Text style={{ fontSize: 18, fontFamily: "Poppins_700Bold", color: Colors.textPrimary, textAlign: "center" }}>
                ¡Tu reserva fue enviada!
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: "Poppins_400Regular",
                  color: Colors.textSecondary,
                  textAlign: "center",
                  marginTop: 6,
                  lineHeight: 20,
                }}
              >
                {reservation.operator?.name} recibió tu reserva y te contactará
                pronto para coordinar la experiencia.
              </Text>
            </View>
          </Animated.View>
        )}

        {/* Reference + status */}
        <Animated.View entering={FadeInDown.delay(60).springify()}>
          <Card>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View>
                <Text style={{ fontSize: 12, fontFamily: "Poppins_400Regular", color: Colors.textMuted }}>
                  Nº de reserva
                </Text>
                <Text style={{ fontSize: 18, fontFamily: "Poppins_700Bold", color: Colors.textPrimary, letterSpacing: 1 }}>
                  {reservation.reference}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                  backgroundColor: conf.color + "18",
                  borderRadius: 20,
                  paddingHorizontal: 12,
                  paddingVertical: 7,
                }}
              >
                <Ionicons name={conf.icon} size={15} color={conf.color} />
                <Text style={{ fontSize: 13, fontFamily: "Poppins_600SemiBold", color: conf.color }}>
                  {conf.label}
                </Text>
              </View>
            </View>
          </Card>
        </Animated.View>

        {/* Experience */}
        <Animated.View entering={FadeInDown.delay(120).springify()}>
          <Card style={{ flexDirection: "row", gap: 14, padding: 12 }}>
            <Image
              source={reservation.image}
              style={{ width: 84, height: 84, borderRadius: 14 }}
              resizeMode="cover"
            />
            <View style={{ flex: 1, justifyContent: "center" }}>
              <Text style={{ fontSize: 15, fontFamily: "Poppins_600SemiBold", color: Colors.textPrimary }} numberOfLines={2}>
                {reservation.title}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 }}>
                <Ionicons name="location-sharp" size={12} color={Colors.textSecondary} />
                <Text style={{ fontSize: 12, fontFamily: "Poppins_400Regular", color: Colors.textSecondary, flex: 1 }} numberOfLines={1}>
                  {reservation.location}
                </Text>
              </View>
            </View>
          </Card>
        </Animated.View>

        {/* Trip details */}
        <Animated.View entering={FadeInDown.delay(180).springify()}>
          <Card style={{ gap: 14 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <Ionicons name="calendar-outline" size={18} color={Colors.primary} />
              <View>
                <Text style={{ fontSize: 12, fontFamily: "Poppins_400Regular", color: Colors.textMuted }}>Fecha</Text>
                <Text style={{ fontSize: 14, fontFamily: "Poppins_500Medium", color: Colors.textPrimary }}>
                  {formatLongDate(reservation.date)}
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <Ionicons name="people-outline" size={18} color={Colors.primary} />
              <View>
                <Text style={{ fontSize: 12, fontFamily: "Poppins_400Regular", color: Colors.textMuted }}>Personas</Text>
                <Text style={{ fontSize: 14, fontFamily: "Poppins_500Medium", color: Colors.textPrimary }}>
                  {reservation.people} {reservation.people === 1 ? "aventurero" : "aventureros"}
                </Text>
              </View>
            </View>
          </Card>
        </Animated.View>

        {/* Cost breakdown — bien visible */}
        <Animated.View entering={FadeInDown.delay(240).springify()}>
          <Text style={{ fontSize: 13, fontFamily: "Poppins_600SemiBold", color: Colors.textMuted, marginBottom: 10, letterSpacing: 0.6, textTransform: "uppercase" }}>
            Detalle del costo
          </Text>
          <Card style={{ gap: 12 }}>
            <Row
              label={`$${reservation.pricePerPerson} × ${reservation.people} ${reservation.people === 1 ? "persona" : "personas"}`}
              value={`$${reservation.subtotal}`}
            />
            <Row label="Tarifa de servicio (10%)" value={`$${reservation.serviceFee}`} />
            <View style={{ height: 1, backgroundColor: Colors.border }} />
            <Row label="Total pagado" value={`$${reservation.total}`} bold />
          </Card>
        </Animated.View>

        {/* Operator (the third party) */}
        <Animated.View entering={FadeInDown.delay(300).springify()}>
          <Text style={{ fontSize: 13, fontFamily: "Poppins_600SemiBold", color: Colors.textMuted, marginBottom: 10, letterSpacing: 0.6, textTransform: "uppercase" }}>
            Operador local
          </Text>
          <Card style={{ gap: 12 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: Colors.primaryLight,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="business" size={20} color={Colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontFamily: "Poppins_600SemiBold", color: Colors.textPrimary }}>
                  {reservation.operator?.name}
                </Text>
                <Text style={{ fontSize: 12, fontFamily: "Poppins_400Regular", color: Colors.textMuted }}>
                  Recibe y coordina tu reserva
                </Text>
              </View>
            </View>
            {reservation.operator?.contact && (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <Ionicons name="mail-outline" size={16} color={Colors.textSecondary} />
                <Text style={{ fontSize: 13, fontFamily: "Poppins_400Regular", color: Colors.textSecondary }}>
                  {reservation.operator.contact}
                </Text>
              </View>
            )}
            {reservation.operator?.phone && (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <Ionicons name="call-outline" size={16} color={Colors.textSecondary} />
                <Text style={{ fontSize: 13, fontFamily: "Poppins_400Regular", color: Colors.textSecondary }}>
                  {reservation.operator.phone}
                </Text>
              </View>
            )}
          </Card>
        </Animated.View>

        {/* Review section */}
        {status === "completada" && (
          <Animated.View entering={FadeInDown.delay(360).springify()}>
            <Text style={{ fontSize: 13, fontFamily: "Poppins_600SemiBold", color: Colors.textMuted, marginBottom: 10, letterSpacing: 0.6, textTransform: "uppercase" }}>
              Tu reseña
            </Text>
            {reservation.review ? (
              <Card style={{ gap: 10 }}>
                <Stars rating={reservation.review.rating} />
                {reservation.review.comment ? (
                  <Text style={{ fontSize: 14, fontFamily: "Poppins_400Regular", color: Colors.textSecondary, lineHeight: 22 }}>
                    “{reservation.review.comment}”
                  </Text>
                ) : null}
              </Card>
            ) : (
              <Card style={{ alignItems: "center", gap: 12 }}>
                <Ionicons name="star-outline" size={30} color={Colors.accent} />
                <Text style={{ fontSize: 14, fontFamily: "Poppins_500Medium", color: Colors.textPrimary, textAlign: "center" }}>
                  ¿Cómo te fue en esta experiencia?
                </Text>
                <PrimaryButton title="Dejar reseña" onPress={() => setReviewOpen(true)} />
              </Card>
            )}
          </Animated.View>
        )}

        {/* Cancel (only for upcoming confirmed) */}
        {status === "confirmada" && (
          <Animated.View entering={FadeInDown.delay(360).springify()} style={{ gap: 12 }}>
            <PrimaryButton title="Cancelar reserva" variant="outline" onPress={() => setCancelOpen(true)} />

            {/* Botón de prueba: simula que la experiencia ya se realizó */}
            <TouchableOpacity
              onPress={() => completeReservationDemo(reservation.id)}
              activeOpacity={0.8}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                paddingVertical: 12,
                borderRadius: 14,
                borderWidth: 1,
                borderStyle: "dashed",
                borderColor: Colors.border,
                backgroundColor: Colors.card,
              }}
            >
              <Ionicons name="flask-outline" size={16} color={Colors.textMuted} />
              <Text style={{ fontSize: 13, fontFamily: "Poppins_500Medium", color: Colors.textMuted }}>
                Marcar como completada (demo)
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </ScrollView>

      {/* Cancel confirmation modal */}
      <Modal visible={cancelOpen} transparent animationType="fade" onRequestClose={() => setCancelOpen(false)}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.45)", padding: 32 }}>
          <View style={{ backgroundColor: Colors.card, borderRadius: 24, padding: 24, width: "100%", maxWidth: 400, alignItems: "center", gap: 14 }}>
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: "rgba(239,68,68,0.12)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="close-circle" size={32} color={Colors.danger} />
            </View>
            <Text style={{ fontSize: 18, fontFamily: "Poppins_700Bold", color: Colors.textPrimary, textAlign: "center" }}>
              Cancelar reserva
            </Text>
            <Text style={{ fontSize: 14, fontFamily: "Poppins_400Regular", color: Colors.textSecondary, textAlign: "center", lineHeight: 21 }}>
              ¿Seguro que deseas cancelar esta reserva? Se notificará a {reservation.operator?.name || "el operador local"}.
            </Text>
            <View style={{ flexDirection: "row", gap: 12, marginTop: 6, width: "100%" }}>
              <PrimaryButton title="No, volver" variant="outline" onPress={() => setCancelOpen(false)} style={{ flex: 1 }} />
              <PrimaryButton title="Sí, cancelar" onPress={confirmCancel} style={{ flex: 1, backgroundColor: Colors.danger, shadowColor: Colors.danger }} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Review modal */}
      <Modal visible={reviewOpen} transparent animationType="slide" onRequestClose={() => setReviewOpen(false)}>
        <View style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.4)" }}>
          <View
            style={{
              backgroundColor: Colors.card,
              borderTopLeftRadius: 28,
              borderTopRightRadius: 28,
              padding: 24,
              paddingBottom: 40,
              gap: 18,
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={{ fontSize: 18, fontFamily: "Poppins_700Bold", color: Colors.textPrimary }}>
                Califica tu experiencia
              </Text>
              <TouchableOpacity onPress={() => setReviewOpen(false)}>
                <Ionicons name="close" size={24} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>

            <Text style={{ fontSize: 14, fontFamily: "Poppins_400Regular", color: Colors.textSecondary }}>
              {reservation.title}
            </Text>

            <View style={{ alignItems: "center", paddingVertical: 6 }}>
              <Stars rating={rating} size={38} onSelect={setRating} />
            </View>

            <TextInput
              value={comment}
              onChangeText={setComment}
              placeholder="Cuéntanos qué te pareció (opcional)"
              placeholderTextColor={Colors.textMuted}
              multiline
              style={{
                minHeight: 90,
                textAlignVertical: "top",
                backgroundColor: Colors.background,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: Colors.border,
                padding: 14,
                fontSize: 14,
                fontFamily: "Poppins_400Regular",
                color: Colors.textPrimary,
              }}
            />

            <PrimaryButton title="Publicar reseña" onPress={submitReview} size="lg" />
          </View>
        </View>
      </Modal>
    </View>
  );
}
