// app/destination/[id].js
import React, { useCallback } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Share,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  FadeIn,
  FadeInDown,
  SlideInUp,
} from "react-native-reanimated";
import { useAppStore, reservationStatus } from "@/store/useAppStore";
import { destinations } from "@/data/destinations";
import PrimaryButton from "@components/PrimaryButton";
import { Colors } from "@constants/colors";

const { width, height } = Dimensions.get("window");

const difficultyConfig = {
  Fácil: { color: Colors.success, icon: "checkmark-circle" },
  Moderado: { color: Colors.accent, icon: "alert-circle" },
  Difícil: { color: Colors.danger, icon: "warning" },
};

function InfoChip({ icon, label, value, color }) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.background,
        borderRadius: 14,
        padding: 14,
        alignItems: "center",
        gap: 6,
      }}
    >
      <View
        style={{
          width: 38,
          height: 38,
          borderRadius: 19,
          backgroundColor: color + "22",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <Text style={{ fontSize: 12, fontFamily: "Poppins_400Regular", color: Colors.textSecondary }}>
        {label}
      </Text>
      <Text style={{ fontSize: 13, fontFamily: "Poppins_600SemiBold", color: Colors.textPrimary, textAlign: "center" }}>
        {value}
      </Text>
    </View>
  );
}

export default function DestinationDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { toggleFavorite, isFavorite } = useAppStore();
  const reservations = useAppStore((s) => s.reservations);

  const destination = destinations.find((d) => d.id === id);
  const favorited = isFavorite(id);

  // Reseñas publicadas por viajeros que ya culminaron esta experiencia.
  const reviews = reservations
    .filter((r) => r.destinationId === id && r.review)
    .map((r) => ({ ...r.review, author: r.contactName || "Aventurero" }));

  // Reserva completada del usuario, aún sin reseñar → mostrar invitación a reseñar.
  const pendingReview = reservations.find(
    (r) => r.destinationId === id && reservationStatus(r) === "completada" && !r.review
  );

  if (!destination) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Destino no encontrado</Text>
      </View>
    );
  }

  const diffConf = difficultyConfig[destination.difficulty] || difficultyConfig["Moderado"];

  const handleShare = async () => {
    try {
      await Share.share({
        message: `¡Descubre ${destination.title} en AventuraRD! ${destination.location} - $${destination.price}/persona`,
        title: destination.title,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleReserve = () => {
    router.push(`/reserve/${destination.id}`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* Hero image */}
        <View style={{ height: height * 0.45, position: "relative" }}>
          <Image
            source={destination.image}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
          <LinearGradient
            colors={["rgba(0,0,0,0.35)", "transparent", "transparent"]}
            style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.4)"]}
            style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 120 }}
          />
        </View>

        {/* Content card */}
        <Animated.View
          entering={SlideInUp.delay(100).springify()}
          style={{
            backgroundColor: Colors.background,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            marginTop: -28,
            paddingTop: 28,
            paddingHorizontal: 24,
            paddingBottom: 120,
            minHeight: height * 0.65,
          }}
        >
          {/* Category + title */}
          <Animated.View entering={FadeInDown.delay(150).springify()}>
            <View
              style={{
                backgroundColor: Colors.primaryLight,
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 5,
                alignSelf: "flex-start",
                marginBottom: 12,
              }}
            >
              <Text style={{ fontSize: 12, color: Colors.primary, fontFamily: "Poppins_600SemiBold" }}>
                {destination.category}
              </Text>
            </View>

            <Text style={{ fontSize: 26, fontFamily: "Poppins_700Bold", color: Colors.textPrimary, marginBottom: 10, lineHeight: 34 }}>
              {destination.title}
            </Text>

            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 20 }}>
              <Ionicons name="location-sharp" size={15} color={Colors.primary} />
              <Text style={{ fontSize: 14, fontFamily: "Poppins_400Regular", color: Colors.textSecondary, flex: 1 }}>
                {destination.location}
              </Text>
            </View>

            {/* Rating + Price row */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: Colors.card,
                borderRadius: 16,
                padding: 16,
                marginBottom: 20,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              <View style={{ alignItems: "center" }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                  <Ionicons name="star" size={18} color={Colors.accent} />
                  <Text style={{ fontSize: 20, fontFamily: "Poppins_700Bold", color: Colors.textPrimary }}>
                    {destination.rating}
                  </Text>
                </View>
                <Text style={{ fontSize: 11, fontFamily: "Poppins_400Regular", color: Colors.textMuted }}>Calificación</Text>
              </View>
              <View style={{ width: 1, height: 40, backgroundColor: Colors.border }} />
              <View style={{ alignItems: "center" }}>
                <Text style={{ fontSize: 20, fontFamily: "Poppins_700Bold", color: Colors.primary }}>
                  ${destination.price}
                </Text>
                <Text style={{ fontSize: 11, fontFamily: "Poppins_400Regular", color: Colors.textMuted }}>por persona</Text>
              </View>
            </View>
          </Animated.View>

          {/* Info chips */}
          <Animated.View entering={FadeInDown.delay(200).springify()}>
            <View style={{ flexDirection: "row", gap: 10, marginBottom: 24 }}>
              <InfoChip
                icon="time-outline"
                label="Duración"
                value={destination.duration}
                color={Colors.secondary}
              />
              <InfoChip
                icon={diffConf.icon}
                label="Dificultad"
                value={destination.difficulty}
                color={diffConf.color}
              />
            </View>
          </Animated.View>

          {/* Description */}
          <Animated.View entering={FadeInDown.delay(250).springify()}>
            <Text style={{ fontSize: 17, fontFamily: "Poppins_600SemiBold", color: Colors.textPrimary, marginBottom: 12 }}>
              Acerca de esta experiencia
            </Text>
            <Text style={{ fontSize: 14, fontFamily: "Poppins_400Regular", color: Colors.textSecondary, lineHeight: 24 }}>
              {destination.description}
            </Text>
          </Animated.View>

          {/* Nivel de seguridad y condiciones */}
          {destination.safety && (
            <Animated.View entering={FadeInDown.delay(260).springify()} style={{ marginTop: 28 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <Ionicons name="shield-checkmark-outline" size={18} color={Colors.secondary} />
                <Text style={{ fontSize: 17, fontFamily: "Poppins_600SemiBold", color: Colors.textPrimary }}>
                  Nivel de seguridad y condiciones
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: Colors.card,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: Colors.border,
                  padding: 16,
                  gap: 12,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                    alignSelf: "flex-start",
                    backgroundColor: diffConf.color + "18",
                    borderRadius: 20,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                  }}
                >
                  <Ionicons name={diffConf.icon} size={14} color={diffConf.color} />
                  <Text style={{ fontSize: 13, fontFamily: "Poppins_600SemiBold", color: diffConf.color }}>
                    Nivel: {destination.difficulty}
                  </Text>
                </View>
                <Text style={{ fontSize: 14, fontFamily: "Poppins_400Regular", color: Colors.textSecondary, lineHeight: 22 }}>
                  {destination.safety}
                </Text>
              </View>
            </Animated.View>
          )}

          {/* Recomendaciones */}
          {destination.recommendations?.length > 0 && (
            <Animated.View entering={FadeInDown.delay(280).springify()} style={{ marginTop: 24 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <Ionicons name="bulb-outline" size={18} color={Colors.accent} />
                <Text style={{ fontSize: 17, fontFamily: "Poppins_600SemiBold", color: Colors.textPrimary }}>
                  Recomendaciones
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: Colors.card,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: Colors.border,
                  padding: 16,
                  gap: 12,
                }}
              >
                {destination.recommendations.map((rec, i) => (
                  <View key={i} style={{ flexDirection: "row", alignItems: "flex-start", gap: 10 }}>
                    <Ionicons name="checkmark-circle" size={18} color={Colors.primary} style={{ marginTop: 1 }} />
                    <Text style={{ flex: 1, fontSize: 14, fontFamily: "Poppins_400Regular", color: Colors.textSecondary, lineHeight: 21 }}>
                      {rec}
                    </Text>
                  </View>
                ))}
              </View>
            </Animated.View>
          )}

          {/* Pending review prompt (user culminó y volvió a ingresar) */}
          {pendingReview && (
            <Animated.View entering={FadeInDown.delay(300).springify()}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => router.push(`/reservations/${pendingReview.id}`)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                  backgroundColor: "rgba(244,160,36,0.12)",
                  borderRadius: 16,
                  padding: 16,
                  marginTop: 24,
                }}
              >
                <Ionicons name="star" size={22} color={Colors.accent} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontFamily: "Poppins_600SemiBold", color: "#B37400" }}>
                    ¿Ya viviste esta experiencia?
                  </Text>
                  <Text style={{ fontSize: 12, fontFamily: "Poppins_400Regular", color: Colors.textSecondary, marginTop: 2 }}>
                    Comparte tu reseña con otros aventureros.
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={Colors.accent} />
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* Reviews */}
          {reviews.length > 0 && (
            <Animated.View entering={FadeInDown.delay(320).springify()} style={{ marginTop: 28 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <Text style={{ fontSize: 17, fontFamily: "Poppins_600SemiBold", color: Colors.textPrimary }}>
                  Reseñas
                </Text>
                <View
                  style={{
                    backgroundColor: Colors.primaryLight,
                    borderRadius: 10,
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                  }}
                >
                  <Text style={{ fontSize: 12, fontFamily: "Poppins_600SemiBold", color: Colors.primary }}>
                    {reviews.length}
                  </Text>
                </View>
              </View>
              {reviews.map((rev, i) => (
                <View
                  key={i}
                  style={{
                    backgroundColor: Colors.card,
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: Colors.border,
                    padding: 16,
                    marginBottom: 12,
                    gap: 8,
                  }}
                >
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text style={{ fontSize: 14, fontFamily: "Poppins_600SemiBold", color: Colors.textPrimary }}>
                      {rev.author}
                    </Text>
                    <View style={{ flexDirection: "row", gap: 2 }}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Ionicons
                          key={n}
                          name={n <= rev.rating ? "star" : "star-outline"}
                          size={13}
                          color={Colors.accent}
                        />
                      ))}
                    </View>
                  </View>
                  {rev.comment ? (
                    <Text style={{ fontSize: 13, fontFamily: "Poppins_400Regular", color: Colors.textSecondary, lineHeight: 21 }}>
                      {rev.comment}
                    </Text>
                  ) : null}
                </View>
              ))}
            </Animated.View>
          )}
        </Animated.View>
      </ScrollView>

      {/* Floating top buttons */}
      <SafeAreaView edges={["top"]} style={{ position: "absolute", top: 0, left: 0, right: 0, pointerEvents: "box-none" }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 12 }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: "rgba(255,255,255,0.92)",
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15,
              shadowRadius: 6,
              elevation: 4,
            }}
          >
            <Ionicons name="arrow-back" size={20} color={Colors.textPrimary} />
          </TouchableOpacity>

          <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity
              onPress={() => toggleFavorite(destination)}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: "rgba(255,255,255,0.92)",
                alignItems: "center",
                justifyContent: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 6,
                elevation: 4,
              }}
            >
              <Ionicons
                name={favorited ? "heart" : "heart-outline"}
                size={20}
                color={favorited ? Colors.danger : Colors.textPrimary}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleShare}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: "rgba(255,255,255,0.92)",
                alignItems: "center",
                justifyContent: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 6,
                elevation: 4,
              }}
            >
              <Ionicons name="share-outline" size={20} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {/* Sticky bottom reserve button */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: Colors.card,
          paddingHorizontal: 24,
          paddingTop: 16,
          paddingBottom: 32,
          borderTopWidth: 1,
          borderTopColor: Colors.border,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 8,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View>
            <Text style={{ fontSize: 12, fontFamily: "Poppins_400Regular", color: Colors.textMuted }}>
              Precio total
            </Text>
            <Text style={{ fontSize: 22, fontFamily: "Poppins_700Bold", color: Colors.primary }}>
              ${destination.price}
              <Text style={{ fontSize: 13, fontFamily: "Poppins_400Regular", color: Colors.textMuted }}>
                {" "}/persona
              </Text>
            </Text>
          </View>
          <PrimaryButton
            title="Reservar"
            onPress={handleReserve}
          />
        </View>
      </View>
    </View>
  );
}
