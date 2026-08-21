// components/PayPalCheckoutModal.js
// Simulación del redirect de PayPal para el checkout de AventuraRD.
//
// ⚠️ No procesa dinero real ni contacta con PayPal: reproduce las pantallas y los
// tiempos de una pasarela real (conexión → login → revisión → procesando → aprobado)
// para que el prototipo tenga un flujo de pago creíble. Cada pantalla lleva una nota
// visible de "simulación" para que nadie lo confunda con un cobro real.
import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@constants/colors";

// Paleta de PayPal, solo para que la simulación resulte reconocible.
const PP = {
  deep: "#003087",
  blue: "#0070BA",
  light: "#009CDE",
  yellow: "#FFC439",
  ink: "#2C2E2F",
  grey: "#687173",
  line: "#E1E7EA",
  bg: "#FFFFFF",
};

// Duración de los pasos automáticos (ms). Imitan la latencia de una pasarela real.
const DELAY_CONNECTING = 1500;
const DELAY_PROCESSING = 1900;
const DELAY_APPROVED = 1300;

// Fuentes de pago ficticias que el usuario puede elegir en la revisión.
const FUNDING = [
  { id: "balance", label: "Saldo de PayPal", detail: "$1,250.00 disponibles", icon: "wallet-outline" },
  { id: "visa", label: "Visa ···· 4242", detail: "Vence 04/29", icon: "card-outline" },
];

const makeTransactionId = () =>
  `PAY-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;

export default function PayPalCheckoutModal({
  visible,
  amount,
  merchant = "AventuraRD",
  payerEmail = "",
  onSuccess,
  onCancel,
}) {
  const [step, setStep] = useState("connecting");
  const [email, setEmail] = useState(payerEmail);
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [funding, setFunding] = useState("balance");
  const timers = useRef([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));

  // Al abrir, arranca siempre en "conectando" y encadena al login.
  useEffect(() => {
    clearTimers();
    if (!visible) return;
    setStep("connecting");
    setEmail(payerEmail);
    setPassword("");
    setErrors({});
    setFunding("balance");
    later(() => setStep("login"), DELAY_CONNECTING);
    return clearTimers;
  }, [visible, payerEmail]);

  const cancel = () => {
    clearTimers();
    onCancel?.();
  };

  const handleLogin = () => {
    const next = {};
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) next.email = "Introduce un correo válido.";
    // La contraseña no se valida contra nada: es parte de la simulación.
    if (password.length < 4) next.password = "La contraseña debe tener al menos 4 caracteres.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setStep("review");
  };

  const handlePay = () => {
    setStep("processing");
    later(() => {
      setStep("approved");
      later(() => {
        const source = FUNDING.find((f) => f.id === funding);
        onSuccess?.({
          method: "paypal",
          status: "pagado",
          label: `PayPal · ${source.label}`,
          payerEmail: email.trim(),
          funding: source.label,
          transactionId: makeTransactionId(),
          simulated: true,
        });
      }, DELAY_APPROVED);
    }, DELAY_PROCESSING);
  };

  // Durante el procesado no dejamos cancelar, como en una pasarela real.
  const closable = step !== "processing" && step !== "approved";

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={cancel}
      statusBarTranslucent
    >
      <View style={{ flex: 1, backgroundColor: PP.bg }}>
        <Brand onCancel={closable ? cancel : null} />

        {step === "connecting" ? <Connecting /> : null}
        {step === "login" ? (
          <Login
            email={email}
            password={password}
            errors={errors}
            merchant={merchant}
            amount={amount}
            onChangeEmail={setEmail}
            onChangePassword={setPassword}
            onSubmit={handleLogin}
            onCancel={cancel}
          />
        ) : null}
        {step === "review" ? (
          <Review
            email={email}
            amount={amount}
            merchant={merchant}
            funding={funding}
            onChangeFunding={setFunding}
            onPay={handlePay}
            onCancel={cancel}
          />
        ) : null}
        {step === "processing" ? <Processing amount={amount} /> : null}
        {step === "approved" ? <Approved amount={amount} merchant={merchant} /> : null}
      </View>
    </Modal>
  );
}

/* ─── Cabecera de marca ─────────────────────────────────────────── */

function Brand({ onCancel }) {
  return (
    <View
      style={{
        backgroundColor: PP.deep,
        paddingTop: 44,
        paddingBottom: 16,
        paddingHorizontal: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Ionicons name="logo-paypal" size={22} color="#FFFFFF" />
        <Text style={{ color: "#FFFFFF", fontSize: 17, fontFamily: "Poppins_700Bold" }}>
          PayPal
        </Text>
        <View
          style={{
            backgroundColor: "rgba(255,255,255,0.18)",
            borderRadius: 6,
            paddingHorizontal: 7,
            paddingVertical: 2,
          }}
        >
          <Text style={{ color: "#FFFFFF", fontSize: 9, fontFamily: "Poppins_600SemiBold" }}>
            SIMULACIÓN
          </Text>
        </View>
      </View>
      {onCancel ? (
        <TouchableOpacity onPress={onCancel} hitSlop={10}>
          <Ionicons name="close" size={22} color="rgba(255,255,255,0.85)" />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

/* ─── Paso 1: conectando ────────────────────────────────────────── */

function Connecting() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 18, padding: 32 }}>
      <ActivityIndicator size="large" color={PP.blue} />
      <Text style={{ fontSize: 16, fontFamily: "Poppins_600SemiBold", color: PP.ink }}>
        Conectando con PayPal...
      </Text>
      <Text style={{ fontSize: 13, fontFamily: "Poppins_400Regular", color: PP.grey, textAlign: "center" }}>
        Te estamos redirigiendo de forma segura. No cierres esta ventana.
      </Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 }}>
        <Ionicons name="lock-closed" size={12} color={PP.grey} />
        <Text style={{ fontSize: 11, fontFamily: "Poppins_400Regular", color: PP.grey }}>
          Conexión cifrada
        </Text>
      </View>
    </View>
  );
}

/* ─── Paso 2: inicio de sesión ──────────────────────────────────── */

function Login({
  email,
  password,
  errors,
  merchant,
  amount,
  onChangeEmail,
  onChangePassword,
  onSubmit,
  onCancel,
}) {
  return (
    <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 40 }}>
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        <Text style={{ fontSize: 18, fontFamily: "Poppins_600SemiBold", color: PP.ink }}>
          Inicia sesión para pagar
        </Text>
        <Text style={{ fontSize: 13, fontFamily: "Poppins_400Regular", color: PP.grey, marginTop: 4 }}>
          ${amount} a {merchant}
        </Text>
      </View>

      <Field
        label="Correo electrónico"
        value={email}
        onChangeText={onChangeEmail}
        error={errors.email}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholder="tu@correo.com"
      />
      <Field
        label="Contraseña"
        value={password}
        onChangeText={onChangePassword}
        error={errors.password}
        secureTextEntry
        placeholder="••••••••"
      />

      <PPButton title="Iniciar sesión" onPress={onSubmit} />
      <PPButton title="Cancelar y volver" variant="ghost" onPress={onCancel} />

      <View
        style={{
          marginTop: 20,
          backgroundColor: "#FFF8E7",
          borderWidth: 1,
          borderColor: "#FFE2A8",
          borderRadius: 12,
          padding: 12,
          flexDirection: "row",
          gap: 8,
        }}
      >
        <Ionicons name="information-circle-outline" size={16} color="#B37400" />
        <Text
          style={{
            flex: 1,
            fontSize: 11,
            fontFamily: "Poppins_400Regular",
            color: "#8A5A00",
            lineHeight: 16,
          }}
        >
          Entorno de simulación del prototipo. No se envían credenciales a ningún
          servidor ni se cobra dinero real: introduce cualquier contraseña de 4 o más
          caracteres para continuar.
        </Text>
      </View>
    </ScrollView>
  );
}

/* ─── Paso 3: revisión y confirmación ───────────────────────────── */

function Review({ email, amount, merchant, funding, onChangeFunding, onPay, onCancel }) {
  return (
    <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 40 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 18 }}>
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: PP.light,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="person" size={18} color="#FFFFFF" />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{ fontSize: 13, fontFamily: "Poppins_600SemiBold", color: PP.ink }}
            numberOfLines={1}
          >
            {email}
          </Text>
          <Text style={{ fontSize: 11, fontFamily: "Poppins_400Regular", color: PP.grey }}>
            Sesión iniciada
          </Text>
        </View>
      </View>

      <View
        style={{
          borderWidth: 1,
          borderColor: PP.line,
          borderRadius: 14,
          padding: 16,
          marginBottom: 20,
        }}
      >
        <Text
          style={{
            fontSize: 11,
            fontFamily: "Poppins_500Medium",
            color: PP.grey,
            textTransform: "uppercase",
          }}
        >
          Pagar a
        </Text>
        <Text style={{ fontSize: 16, fontFamily: "Poppins_600SemiBold", color: PP.ink, marginTop: 2 }}>
          {merchant}
        </Text>
        <View style={{ height: 1, backgroundColor: PP.line, marginVertical: 12 }} />
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={{ fontSize: 14, fontFamily: "Poppins_500Medium", color: PP.grey }}>Total</Text>
          <Text style={{ fontSize: 24, fontFamily: "Poppins_700Bold", color: PP.deep }}>${amount}</Text>
        </View>
      </View>

      <Text style={{ fontSize: 13, fontFamily: "Poppins_600SemiBold", color: PP.ink, marginBottom: 10 }}>
        Pagar con
      </Text>
      {FUNDING.map((f) => {
        const active = funding === f.id;
        return (
          <TouchableOpacity
            key={f.id}
            onPress={() => onChangeFunding(f.id)}
            activeOpacity={0.85}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              borderWidth: active ? 2 : 1,
              borderColor: active ? PP.blue : PP.line,
              backgroundColor: active ? "#F1F8FD" : "#FFFFFF",
              borderRadius: 12,
              padding: 14,
              marginBottom: 10,
            }}
          >
            <Ionicons name={f.icon} size={20} color={active ? PP.blue : PP.grey} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 13, fontFamily: "Poppins_600SemiBold", color: PP.ink }}>
                {f.label}
              </Text>
              <Text style={{ fontSize: 11, fontFamily: "Poppins_400Regular", color: PP.grey }}>
                {f.detail}
              </Text>
            </View>
            <Ionicons
              name={active ? "radio-button-on" : "radio-button-off"}
              size={18}
              color={active ? PP.blue : PP.line}
            />
          </TouchableOpacity>
        );
      })}

      <View style={{ marginTop: 10 }}>
        <PPButton title={`Pagar $${amount} ahora`} variant="yellow" onPress={onPay} />
        <PPButton title="Cancelar y volver" variant="ghost" onPress={onCancel} />
      </View>
    </ScrollView>
  );
}

/* ─── Paso 4: procesando ────────────────────────────────────────── */

function Processing({ amount }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 16, padding: 32 }}>
      <ActivityIndicator size="large" color={PP.blue} />
      <Text style={{ fontSize: 16, fontFamily: "Poppins_600SemiBold", color: PP.ink }}>
        Procesando el pago de ${amount}
      </Text>
      <Text style={{ fontSize: 13, fontFamily: "Poppins_400Regular", color: PP.grey, textAlign: "center" }}>
        Estamos confirmando la transacción. No cierres esta ventana.
      </Text>
    </View>
  );
}

/* ─── Paso 5: aprobado ──────────────────────────────────────────── */

function Approved({ amount, merchant }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 14, padding: 32 }}>
      <View
        style={{
          width: 76,
          height: 76,
          borderRadius: 38,
          backgroundColor: Colors.primaryLight,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name="checkmark-circle" size={54} color={Colors.primary} />
      </View>
      <Text style={{ fontSize: 19, fontFamily: "Poppins_700Bold", color: PP.ink }}>
        Pago aprobado
      </Text>
      <Text style={{ fontSize: 13, fontFamily: "Poppins_400Regular", color: PP.grey, textAlign: "center" }}>
        Se enviaron ${amount} a {merchant}.{"\n"}Volviendo a AventuraRD...
      </Text>
      <ActivityIndicator color={PP.blue} style={{ marginTop: 6 }} />
    </View>
  );
}

/* ─── Piezas reutilizables ──────────────────────────────────────── */

function Field({ label, error, ...props }) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={{ fontSize: 12, fontFamily: "Poppins_500Medium", color: PP.grey, marginBottom: 6 }}>
        {label}
      </Text>
      <TextInput
        {...props}
        placeholderTextColor={PP.line}
        style={{
          borderWidth: 1,
          borderColor: error ? Colors.danger : PP.line,
          borderRadius: 10,
          paddingHorizontal: 14,
          paddingVertical: 12,
          fontSize: 14,
          fontFamily: "Poppins_400Regular",
          color: PP.ink,
          backgroundColor: "#FFFFFF",
        }}
      />
      {error ? (
        <Text
          style={{
            fontSize: 11,
            fontFamily: "Poppins_400Regular",
            color: Colors.danger,
            marginTop: 4,
          }}
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
}

function PPButton({ title, onPress, variant = "blue" }) {
  const style = {
    blue: { bg: PP.blue, fg: "#FFFFFF", border: PP.blue },
    yellow: { bg: PP.yellow, fg: PP.ink, border: PP.yellow },
    ghost: { bg: "transparent", fg: PP.blue, border: "transparent" },
  }[variant];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={{
        backgroundColor: style.bg,
        borderWidth: 1,
        borderColor: style.border,
        borderRadius: 26,
        paddingVertical: 14,
        alignItems: "center",
        marginTop: 10,
      }}
    >
      <Text style={{ fontSize: 15, fontFamily: "Poppins_600SemiBold", color: style.fg }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
