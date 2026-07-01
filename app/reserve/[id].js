// app/reserve/[id].js
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";
import {
  useAppStore,
  SERVICE_FEE_RATE,
  operatorForCategory,
} from "@/store/useAppStore";
import { destinations } from "@/data/destinations";
import PrimaryButton from "@components/PrimaryButton";
import { Colors } from "@constants/colors";

const WEEKDAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MONTHS = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
];

// Genera las próximas 14 fechas disponibles a partir de mañana.
function buildAvailableDates() {
  const dates = [];
  const base = new Date();
  base.setHours(0, 0, 0, 0);
  for (let i = 1; i <= 14; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    dates.push(d);
  }
  return dates;
}

function toISODate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function Section({ title, children }) {
  return (
    <View style={{ marginBottom: 26 }}>
      <Text
        style={{
          fontSize: 16,
          fontFamily: "Poppins_600SemiBold",
          color: Colors.textPrimary,
          marginBottom: 14,
        }}
      >
        {title}
      </Text>
      {children}
    </View>
  );
}

function Field({ icon, value, onChangeText, placeholder, keyboardType }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        backgroundColor: Colors.card,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: Colors.border,
        paddingHorizontal: 14,
        marginBottom: 12,
      }}
    >
      <Ionicons name={icon} size={18} color={Colors.textMuted} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textMuted}
        keyboardType={keyboardType}
        style={{
          flex: 1,
          paddingVertical: 14,
          fontSize: 14,
          fontFamily: "Poppins_400Regular",
          color: Colors.textPrimary,
        }}
      />
    </View>
  );
}

export default function ReserveScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const user = useAppStore((s) => s.user);
  const addReservation = useAppStore((s) => s.addReservation);

  const destination = destinations.find((d) => d.id === id);

  const availableDates = useMemo(buildAvailableDates, []);
  const [selectedDate, setSelectedDate] = useState(toISODate(availableDates[0]));
  const [people, setPeople] = useState(1);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");

  if (!destination) {
    return (
      <SafeAreaView style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Destino no encontrado</Text>
      </SafeAreaView>
    );
  }

  const operator = operatorForCategory(destination.category);
  const subtotal = destination.price * people;
  const serviceFee = Math.round(subtotal * SERVICE_FEE_RATE);
  const total = subtotal + serviceFee;

  const handleConfirm = () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert(
        "Datos incompletos",
        "Por favor ingresa tu nombre y correo para completar la reserva."
      );
      return;
    }

    const reservation = addReservation({
      destinationId: destination.id,
      title: destination.title,
      location: destination.location,
      category: destination.category,
      image: destination.image,
      duration: destination.duration,
      date: selectedDate,
      people,
      pricePerPerson: destination.price,
      subtotal,
      serviceFee,
      total,
      operator,
      contactName: name.trim(),
      contactEmail: email.trim(),
      contactPhone: phone.trim(),
    });

    router.replace({
      pathname: "/reservations/[id]",
      params: { id: reservation.id, justBooked: "1" },
    });
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
            Completar reserva
          </Text>
        </View>
      </SafeAreaView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 200 }}
      >
        {/* Experience summary */}
        <Animated.View
          entering={FadeInDown.delay(50).springify()}
          style={{
            flexDirection: "row",
            gap: 14,
            backgroundColor: Colors.card,
            borderRadius: 18,
            padding: 12,
            marginBottom: 26,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <Image
            source={destination.image}
            style={{ width: 84, height: 84, borderRadius: 14 }}
            resizeMode="cover"
          />
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Text
              style={{ fontSize: 15, fontFamily: "Poppins_600SemiBold", color: Colors.textPrimary }}
              numberOfLines={2}
            >
              {destination.title}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 }}>
              <Ionicons name="location-sharp" size={12} color={Colors.textSecondary} />
              <Text
                style={{ fontSize: 12, fontFamily: "Poppins_400Regular", color: Colors.textSecondary, flex: 1 }}
                numberOfLines={1}
              >
                {destination.location}
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 }}>
              <Ionicons name="time-outline" size={12} color={Colors.textMuted} />
              <Text style={{ fontSize: 12, fontFamily: "Poppins_400Regular", color: Colors.textMuted }}>
                {destination.duration}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Date selection */}
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <Section title="Elige la fecha">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 10 }}
            >
              {availableDates.map((d) => {
                const iso = toISODate(d);
                const active = iso === selectedDate;
                return (
                  <TouchableOpacity
                    key={iso}
                    onPress={() => setSelectedDate(iso)}
                    activeOpacity={0.85}
                    style={{
                      width: 62,
                      paddingVertical: 12,
                      borderRadius: 14,
                      alignItems: "center",
                      backgroundColor: active ? Colors.primary : Colors.card,
                      borderWidth: 1.5,
                      borderColor: active ? Colors.primary : Colors.border,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 11,
                        fontFamily: "Poppins_400Regular",
                        color: active ? "rgba(255,255,255,0.85)" : Colors.textMuted,
                      }}
                    >
                      {WEEKDAYS[d.getDay()]}
                    </Text>
                    <Text
                      style={{
                        fontSize: 20,
                        fontFamily: "Poppins_700Bold",
                        color: active ? "#fff" : Colors.textPrimary,
                        marginVertical: 2,
                      }}
                    >
                      {d.getDate()}
                    </Text>
                    <Text
                      style={{
                        fontSize: 11,
                        fontFamily: "Poppins_400Regular",
                        color: active ? "rgba(255,255,255,0.85)" : Colors.textMuted,
                      }}
                    >
                      {MONTHS[d.getMonth()]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </Section>
        </Animated.View>

        {/* People counter */}
        <Animated.View entering={FadeInDown.delay(150).springify()}>
          <Section title="Número de personas">
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: Colors.card,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: Colors.border,
                paddingHorizontal: 20,
                paddingVertical: 14,
              }}
            >
              <View>
                <Text style={{ fontSize: 15, fontFamily: "Poppins_500Medium", color: Colors.textPrimary }}>
                  Aventureros
                </Text>
                <Text style={{ fontSize: 12, fontFamily: "Poppins_400Regular", color: Colors.textMuted }}>
                  ${destination.price} por persona
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 18 }}>
                <TouchableOpacity
                  onPress={() => setPeople((p) => Math.max(1, p - 1))}
                  disabled={people <= 1}
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 19,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: people <= 1 ? Colors.background : Colors.primaryLight,
                  }}
                >
                  <Ionicons name="remove" size={20} color={people <= 1 ? Colors.textMuted : Colors.primary} />
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: 20,
                    fontFamily: "Poppins_700Bold",
                    color: Colors.textPrimary,
                    minWidth: 24,
                    textAlign: "center",
                  }}
                >
                  {people}
                </Text>
                <TouchableOpacity
                  onPress={() => setPeople((p) => Math.min(12, p + 1))}
                  disabled={people >= 12}
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 19,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: people >= 12 ? Colors.background : Colors.primaryLight,
                  }}
                >
                  <Ionicons name="add" size={20} color={people >= 12 ? Colors.textMuted : Colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
          </Section>
        </Animated.View>

        {/* Contact info */}
        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <Section title="Datos de contacto">
            <Field icon="person-outline" value={name} onChangeText={setName} placeholder="Nombre completo" />
            <Field
              icon="mail-outline"
              value={email}
              onChangeText={setEmail}
              placeholder="Correo electrónico"
              keyboardType="email-address"
            />
            <Field
              icon="call-outline"
              value={phone}
              onChangeText={setPhone}
              placeholder="Teléfono (opcional)"
              keyboardType="phone-pad"
            />
          </Section>
        </Animated.View>

        {/* Cost breakdown — bien visible */}
        <Animated.View entering={FadeInDown.delay(250).springify()}>
          <Section title="Resumen del costo">
            <View
              style={{
                backgroundColor: Colors.card,
                borderRadius: 18,
                borderWidth: 1,
                borderColor: Colors.border,
                padding: 18,
                gap: 12,
              }}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontSize: 14, fontFamily: "Poppins_400Regular", color: Colors.textSecondary }}>
                  ${destination.price} × {people} {people === 1 ? "persona" : "personas"}
                </Text>
                <Text style={{ fontSize: 14, fontFamily: "Poppins_500Medium", color: Colors.textPrimary }}>
                  ${subtotal}
                </Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontSize: 14, fontFamily: "Poppins_400Regular", color: Colors.textSecondary }}>
                  Tarifa de servicio (10%)
                </Text>
                <Text style={{ fontSize: 14, fontFamily: "Poppins_500Medium", color: Colors.textPrimary }}>
                  ${serviceFee}
                </Text>
              </View>
              <View style={{ height: 1, backgroundColor: Colors.border }} />
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ fontSize: 16, fontFamily: "Poppins_600SemiBold", color: Colors.textPrimary }}>
                  Total
                </Text>
                <Text style={{ fontSize: 22, fontFamily: "Poppins_700Bold", color: Colors.primary }}>
                  ${total}
                </Text>
              </View>
            </View>
          </Section>
        </Animated.View>

        {/* Operator / third-party note (estilo Viator) */}
        <Animated.View entering={FadeInDown.delay(300).springify()}>
          <View
            style={{
              flexDirection: "row",
              gap: 12,
              backgroundColor: Colors.primaryLight,
              borderRadius: 16,
              padding: 16,
            }}
          >
            <Ionicons name="business-outline" size={20} color={Colors.primary} style={{ marginTop: 2 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 13, fontFamily: "Poppins_600SemiBold", color: Colors.primaryDark }}>
                Operado por {operator.name}
              </Text>
              <Text style={{ fontSize: 12, fontFamily: "Poppins_400Regular", color: Colors.textSecondary, marginTop: 2, lineHeight: 18 }}>
                Al confirmar, tu reserva se envía directamente al operador local, quien recibe tus datos y te contactará para coordinar la experiencia.
              </Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Sticky confirm bar */}
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
              Total a pagar
            </Text>
            <Text style={{ fontSize: 22, fontFamily: "Poppins_700Bold", color: Colors.primary }}>
              ${total}
            </Text>
          </View>
          <PrimaryButton title="Confirmar reserva" onPress={handleConfirm} size="lg" />
        </View>
      </View>
    </View>
  );
}
