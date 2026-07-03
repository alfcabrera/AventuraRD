// app/(auth)/login.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { loginWithEmail, authErrorMessage } from "@/services/firebaseAuth";
import PrimaryButton from "@components/PrimaryButton";
import { Colors } from "@constants/colors";

// Validación simple de formato de correo.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Limpia el error de un campo mientras el usuario lo corrige.
  const clearError = (field) =>
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));

  const validate = () => {
    const next = {};
    const mail = email.trim();
    if (!mail) next.email = "Ingresa tu correo electrónico.";
    else if (!EMAIL_RE.test(mail)) next.email = "El correo no es válido.";

    if (!password) next.password = "Ingresa tu contraseña.";
    else if (password.length < 6) next.password = "Mínimo 6 caracteres.";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await loginWithEmail({ email, password });
      // El listener de auth carga los datos del usuario.
      router.replace("/(tabs)");
    } catch (e) {
      Alert.alert("No se pudo iniciar sesión", authErrorMessage(e.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    Alert.alert(
      "Próximamente",
      "El inicio de sesión con Google estará disponible pronto. Por ahora usa tu correo y contraseña."
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      {/* Top gradient accent */}
      <LinearGradient
        colors={[Colors.primary, Colors.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 220,
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
        }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <Animated.View
            entering={FadeInDown.delay(100).springify()}
            style={{ paddingTop: 40, paddingHorizontal: 32, marginBottom: 40 }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: "rgba(255,255,255,0.3)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="leaf" size={22} color="#fff" />
              </View>
              <Text style={{ fontSize: 22, fontFamily: "Poppins_700Bold", color: "#fff" }}>
                AventuraRD
              </Text>
            </View>
            <Text style={{ fontSize: 14, fontFamily: "Poppins_400Regular", color: "rgba(255,255,255,0.85)" }}>
              Descubre experiencias auténticas
            </Text>
          </Animated.View>

          {/* Card */}
          <Animated.View
            entering={FadeInUp.delay(200).springify()}
            style={{
              marginHorizontal: 20,
              backgroundColor: Colors.card,
              borderRadius: 28,
              padding: 28,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.1,
              shadowRadius: 24,
              elevation: 8,
            }}
          >
            <Text
              style={{
                fontSize: 24,
                fontFamily: "Poppins_700Bold",
                color: Colors.textPrimary,
                marginBottom: 6,
              }}
            >
              Bienvenido
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Poppins_400Regular",
                color: Colors.textSecondary,
                marginBottom: 28,
              }}
            >
              Inicia sesión para continuar
            </Text>

            {/* Email */}
            <Text style={styles.label}>Correo electrónico</Text>
            <View style={[styles.inputWrapper, errors.email && styles.inputError]}>
              <Ionicons name="mail-outline" size={18} color={Colors.textMuted} />
              <TextInput
                value={email}
                onChangeText={(t) => {
                  setEmail(t);
                  clearError("email");
                }}
                placeholder="tu@email.com"
                placeholderTextColor={Colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />
            </View>
            {errors.email ? (
              <Text style={styles.errorText}>{errors.email}</Text>
            ) : null}

            {/* Password */}
            <Text style={styles.label}>Contraseña</Text>
            <View style={[styles.inputWrapper, errors.password && styles.inputError]}>
              <Ionicons name="lock-closed-outline" size={18} color={Colors.textMuted} />
              <TextInput
                value={password}
                onChangeText={(t) => {
                  setPassword(t);
                  clearError("password");
                }}
                placeholder="••••••••"
                placeholderTextColor={Colors.textMuted}
                secureTextEntry={!showPassword}
                style={[styles.input, { flex: 1 }]}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={18}
                  color={Colors.textMuted}
                />
              </TouchableOpacity>
            </View>
            {errors.password ? (
              <Text style={styles.errorText}>{errors.password}</Text>
            ) : null}

            {/* Forgot password */}
            <TouchableOpacity style={{ alignSelf: "flex-end", marginBottom: 24 }}>
              <Text style={{ fontSize: 13, color: Colors.primary, fontFamily: "Poppins_500Medium" }}>
                ¿Olvidaste tu contraseña?
              </Text>
            </TouchableOpacity>

            <PrimaryButton title="Iniciar sesión" onPress={handleLogin} loading={loading} />

            {/* Divider */}
            <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 24, gap: 12 }}>
              <View style={{ flex: 1, height: 1, backgroundColor: Colors.border }} />
              <Text style={{ fontSize: 13, color: Colors.textMuted, fontFamily: "Poppins_400Regular" }}>
                o continúa con
              </Text>
              <View style={{ flex: 1, height: 1, backgroundColor: Colors.border }} />
            </View>

            {/* Google button */}
            <TouchableOpacity
              onPress={handleGoogleSignIn}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                paddingVertical: 14,
                borderRadius: 14,
                borderWidth: 1.5,
                borderColor: Colors.border,
                backgroundColor: Colors.card,
              }}
            >
              <Ionicons name="logo-google" size={20} color="#EA4335" />
              <Text style={{ fontSize: 15, fontFamily: "Poppins_500Medium", color: Colors.textPrimary }}>
                Google
              </Text>
            </TouchableOpacity>

            {/* Register link */}
            <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 24, gap: 4 }}>
              <Text style={{ fontSize: 14, color: Colors.textSecondary, fontFamily: "Poppins_400Regular" }}>
                ¿No tienes cuenta?
              </Text>
              <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
                <Text style={{ fontSize: 14, color: Colors.primary, fontFamily: "Poppins_600SemiBold" }}>
                  Regístrate
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = {
  label: {
    fontSize: 13,
    fontFamily: "Poppins_500Medium",
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  inputError: {
    borderColor: Colors.danger,
    marginBottom: 6,
  },
  errorText: {
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    color: Colors.danger,
    marginBottom: 10,
    marginLeft: 4,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: Colors.textPrimary,
    padding: 0,
    margin: 0,
  },
};
