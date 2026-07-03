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
  Modal,
  ActivityIndicator,
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
import {
  PAYMENT_METHODS,
  detectBrand,
  formatCardNumber,
  formatExpiry,
  expectedCvvLength,
  validateCard,
  last4,
} from "@constants/payment";

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

// Horarios disponibles de la actividad. Si el destino no define los suyos,
// se usa un horario por defecto según su duración.
function slotsForDestination(destination) {
  if (Array.isArray(destination.timeSlots) && destination.timeSlots.length) {
    return destination.timeSlots;
  }
  return destination.duration === "1 día" ? ["08:00"] : ["09:00", "14:00"];
}

// Convierte "14:30" a un formato 12h amigable: "2:30 PM".
function formatTime(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
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
  const savedCard = useAppStore((s) => s.savedCard);
  const setSavedCard = useAppStore((s) => s.setSavedCard);

  const destination = destinations.find((d) => d.id === id);

  const availableDates = useMemo(buildAvailableDates, []);
  const availableTimes = useMemo(
    () => (destination ? slotsForDestination(destination) : []),
    [destination]
  );
  const [selectedDate, setSelectedDate] = useState(toISODate(availableDates[0]));
  const [selectedTime, setSelectedTime] = useState(availableTimes[0] || "");
  const [people, setPeople] = useState(1);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");

  // ─── Pago ───────────────────────────────────────────────
  const [paymentMethod, setPaymentMethod] = useState("card");
  // Cuando hay tarjeta guardada usamos esa por defecto; si no, pediremos una nueva.
  const [useNewCard, setUseNewCard] = useState(!savedCard);
  const [cardModalOpen, setCardModalOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState(user?.name || "");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [saveCard, setSaveCard] = useState(true);
  const [cardErrors, setCardErrors] = useState({});

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

  // Crea la reserva con la info de pago y navega a la confirmación.
  const finalizeReservation = async (payment) => {
    const reservation = await addReservation({
      destinationId: destination.id,
      title: destination.title,
      location: destination.location,
      category: destination.category,
      image: destination.image,
      duration: destination.duration,
      date: selectedDate,
      time: selectedTime,
      people,
      pricePerPerson: destination.price,
      subtotal,
      serviceFee,
      total,
      operator,
      contactName: name.trim(),
      contactEmail: email.trim(),
      contactPhone: phone.trim(),
      payment,
    });

    router.replace({
      pathname: "/reservations/[id]",
      params: { id: reservation.id, justBooked: "1" },
    });
  };

  // Simula el procesamiento del pago (~1.6s) antes de confirmar.
  const simulateAndFinalize = (payment) => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      finalizeReservation(payment);
    }, 1600);
  };

  // Valida datos comunes (horario + contacto). Devuelve true si todo OK.
  const validateCommon = () => {
    if (!selectedTime) {
      Alert.alert(
        "Selecciona un horario",
        "Por favor elige el horario disponible para tu experiencia."
      );
      return false;
    }
    if (!name.trim() || !email.trim()) {
      Alert.alert(
        "Datos incompletos",
        "Por favor ingresa tu nombre y correo para completar la reserva."
      );
      return false;
    }
    return true;
  };

  const handleConfirm = () => {
    if (!validateCommon()) return;

    if (paymentMethod === "cash") {
      finalizeReservation({
        method: "cash",
        status: "pendiente",
        label: "Pago al operador",
      });
      return;
    }

    if (paymentMethod === "paypal") {
      simulateAndFinalize({
        method: "paypal",
        status: "pagado",
        label: "PayPal",
      });
      return;
    }

    // Tarjeta: usar la guardada o abrir el formulario para una nueva.
    if (savedCard && !useNewCard) {
      simulateAndFinalize({
        method: "card",
        status: "pagado",
        brand: savedCard.brand,
        last4: savedCard.last4,
        label: `${savedCard.brand} ···· ${savedCard.last4}`,
      });
      return;
    }

    setCardErrors({});
    setCardModalOpen(true);
  };

  // Pago con una tarjeta nueva desde el modal.
  const handlePayWithNewCard = () => {
    const { valid, errors } = validateCard(
      { number: cardNumber, expiry: cardExpiry, cvv: cardCvv, name: cardName },
      new Date()
    );
    if (!valid) {
      setCardErrors(errors);
      return;
    }

    const brand = detectBrand(cardNumber);
    const l4 = last4(cardNumber);

    if (saveCard) {
      setSavedCard({ brand: brand.name, last4: l4, name: cardName.trim() });
    }

    setCardModalOpen(false);
    simulateAndFinalize({
      method: "card",
      status: "pagado",
      brand: brand.name,
      last4: l4,
      label: `${brand.name} ···· ${l4}`,
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

        {/* Time selection */}
        <Animated.View entering={FadeInDown.delay(120).springify()}>
          <Section title="Elige el horario">
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
              {availableTimes.map((t) => {
                const active = t === selectedTime;
                return (
                  <TouchableOpacity
                    key={t}
                    onPress={() => setSelectedTime(t)}
                    activeOpacity={0.85}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                      paddingVertical: 12,
                      paddingHorizontal: 16,
                      borderRadius: 14,
                      backgroundColor: active ? Colors.primary : Colors.card,
                      borderWidth: 1.5,
                      borderColor: active ? Colors.primary : Colors.border,
                    }}
                  >
                    <Ionicons
                      name="time-outline"
                      size={15}
                      color={active ? "#fff" : Colors.textMuted}
                    />
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: "Poppins_600SemiBold",
                        color: active ? "#fff" : Colors.textPrimary,
                      }}
                    >
                      {formatTime(t)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
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

        {/* Payment method selection */}
        <Animated.View entering={FadeInDown.delay(270).springify()}>
          <Section title="Método de pago">
            <View style={{ gap: 10 }}>
              {PAYMENT_METHODS.map((m) => {
                const active = paymentMethod === m.id;
                return (
                  <TouchableOpacity
                    key={m.id}
                    onPress={() => setPaymentMethod(m.id)}
                    activeOpacity={0.85}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 14,
                      backgroundColor: active ? Colors.primaryLight : Colors.card,
                      borderRadius: 14,
                      borderWidth: 1.5,
                      borderColor: active ? Colors.primary : Colors.border,
                      paddingHorizontal: 16,
                      paddingVertical: 14,
                    }}
                  >
                    <Ionicons
                      name={m.icon}
                      size={22}
                      color={active ? Colors.primary : Colors.textMuted}
                    />
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 14,
                          fontFamily: "Poppins_600SemiBold",
                          color: Colors.textPrimary,
                        }}
                      >
                        {m.label}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: "Poppins_400Regular",
                          color: Colors.textMuted,
                        }}
                      >
                        {m.sublabel}
                      </Text>
                    </View>
                    <Ionicons
                      name={active ? "radio-button-on" : "radio-button-off"}
                      size={20}
                      color={active ? Colors.primary : Colors.textMuted}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Tarjeta guardada / nueva */}
            {paymentMethod === "card" && (
              <View style={{ marginTop: 12, gap: 10 }}>
                {savedCard && (
                  <TouchableOpacity
                    onPress={() => setUseNewCard(false)}
                    activeOpacity={0.85}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 12,
                      backgroundColor: Colors.card,
                      borderRadius: 12,
                      borderWidth: 1.5,
                      borderColor: !useNewCard ? Colors.primary : Colors.border,
                      paddingHorizontal: 14,
                      paddingVertical: 12,
                    }}
                  >
                    <Ionicons name="card" size={18} color={Colors.textSecondary} />
                    <Text
                      style={{
                        flex: 1,
                        fontSize: 13,
                        fontFamily: "Poppins_500Medium",
                        color: Colors.textPrimary,
                      }}
                    >
                      {savedCard.brand} ···· {savedCard.last4}
                    </Text>
                    <Ionicons
                      name={!useNewCard ? "radio-button-on" : "radio-button-off"}
                      size={18}
                      color={!useNewCard ? Colors.primary : Colors.textMuted}
                    />
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() => setUseNewCard(true)}
                  activeOpacity={0.7}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    paddingHorizontal: 4,
                    paddingVertical: savedCard ? 2 : 8,
                  }}
                >
                  <Ionicons
                    name={
                      savedCard
                        ? useNewCard
                          ? "radio-button-on"
                          : "radio-button-off"
                        : "information-circle-outline"
                    }
                    size={18}
                    color={useNewCard ? Colors.primary : Colors.textMuted}
                  />
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: "Poppins_500Medium",
                      color: savedCard ? Colors.textPrimary : Colors.textMuted,
                    }}
                  >
                    {savedCard
                      ? "Usar otra tarjeta"
                      : "Se te pedirá la tarjeta al confirmar"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
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
          <PrimaryButton
            title={paymentMethod === "cash" ? "Reservar" : `Pagar $${total}`}
            onPress={handleConfirm}
            size="lg"
          />
        </View>
      </View>

      {/* Card entry modal */}
      <Modal
        visible={cardModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setCardModalOpen(false)}
      >
        <View style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.4)" }}>
          <View
            style={{
              backgroundColor: Colors.card,
              borderTopLeftRadius: 28,
              borderTopRightRadius: 28,
              padding: 24,
              paddingBottom: 40,
              gap: 14,
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={{ fontSize: 18, fontFamily: "Poppins_700Bold", color: Colors.textPrimary }}>
                Datos de la tarjeta
              </Text>
              <TouchableOpacity onPress={() => setCardModalOpen(false)}>
                <Ionicons name="close" size={24} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>

            {/* Número */}
            <CardField
              label="Número de tarjeta"
              icon={detectBrand(cardNumber).icon}
              value={cardNumber}
              onChangeText={(t) => setCardNumber(formatCardNumber(t))}
              placeholder="4242 4242 4242 4242"
              keyboardType="number-pad"
              error={cardErrors.number}
              rightText={detectBrand(cardNumber).id !== "unknown" ? detectBrand(cardNumber).name : null}
            />

            {/* Titular */}
            <CardField
              label="Titular de la tarjeta"
              icon="person-outline"
              value={cardName}
              onChangeText={setCardName}
              placeholder="Nombre como aparece en la tarjeta"
              autoCapitalize="words"
              error={cardErrors.name}
            />

            {/* Expiración + CVV */}
            <View style={{ flexDirection: "row", gap: 12 }}>
              <View style={{ flex: 1 }}>
                <CardField
                  label="Vence (MM/AA)"
                  icon="calendar-outline"
                  value={cardExpiry}
                  onChangeText={(t) => setCardExpiry(formatExpiry(t))}
                  placeholder="09/28"
                  keyboardType="number-pad"
                  error={cardErrors.expiry}
                />
              </View>
              <View style={{ flex: 1 }}>
                <CardField
                  label="CVV"
                  icon="lock-closed-outline"
                  value={cardCvv}
                  onChangeText={(t) =>
                    setCardCvv(
                      t.replace(/\D/g, "").slice(0, expectedCvvLength(detectBrand(cardNumber).id))
                    )
                  }
                  placeholder="123"
                  keyboardType="number-pad"
                  secureTextEntry
                  error={cardErrors.cvv}
                />
              </View>
            </View>

            {/* Guardar tarjeta */}
            <TouchableOpacity
              onPress={() => setSaveCard((v) => !v)}
              activeOpacity={0.7}
              style={{ flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 4 }}
            >
              <Ionicons
                name={saveCard ? "checkbox" : "square-outline"}
                size={20}
                color={saveCard ? Colors.primary : Colors.textMuted}
              />
              <Text style={{ fontSize: 13, fontFamily: "Poppins_400Regular", color: Colors.textSecondary }}>
                Guardar esta tarjeta para próximas reservas
              </Text>
            </TouchableOpacity>

            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 2 }}>
              <Ionicons name="lock-closed" size={13} color={Colors.textMuted} />
              <Text style={{ fontSize: 11, fontFamily: "Poppins_400Regular", color: Colors.textMuted, flex: 1 }}>
                Pago simulado para fines de demostración. No se realiza ningún cobro real.
              </Text>
            </View>

            <PrimaryButton title={`Pagar $${total}`} onPress={handlePayWithNewCard} size="lg" />
          </View>
        </View>
      </Modal>

      {/* Processing overlay */}
      <Modal visible={processing} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: Colors.card,
              borderRadius: 24,
              paddingHorizontal: 36,
              paddingVertical: 32,
              alignItems: "center",
              gap: 16,
            }}
          >
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={{ fontSize: 15, fontFamily: "Poppins_600SemiBold", color: Colors.textPrimary }}>
              Procesando pago...
            </Text>
            <Text style={{ fontSize: 12, fontFamily: "Poppins_400Regular", color: Colors.textMuted }}>
              No cierres esta pantalla
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Campo del formulario de tarjeta, con etiqueta y estado de error.
function CardField({
  label,
  icon,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  secureTextEntry,
  autoCapitalize,
  error,
  rightText,
}) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={{ fontSize: 12, fontFamily: "Poppins_500Medium", color: Colors.textSecondary }}>
        {label}
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          backgroundColor: Colors.background,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: error ? Colors.danger : Colors.border,
          paddingHorizontal: 12,
        }}
      >
        <Ionicons name={icon} size={18} color={Colors.textMuted} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.textMuted}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          autoCapitalize={autoCapitalize || "none"}
          style={{
            flex: 1,
            paddingVertical: 12,
            fontSize: 14,
            fontFamily: "Poppins_400Regular",
            color: Colors.textPrimary,
          }}
        />
        {rightText ? (
          <Text style={{ fontSize: 12, fontFamily: "Poppins_600SemiBold", color: Colors.textSecondary }}>
            {rightText}
          </Text>
        ) : null}
      </View>
      {error ? (
        <Text style={{ fontSize: 11, fontFamily: "Poppins_400Regular", color: Colors.danger }}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}
