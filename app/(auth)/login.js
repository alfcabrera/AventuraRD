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
import { useAppStore } from "@/store/useAppStore";
import PrimaryButton from "@components/PrimaryButton";
import { Colors } from "@constants/colors";

export default function LoginScreen() {
  const router = useRouter();
  const setUser = useAppStore((s) => s.setUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }
    setLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1200));
    setUser({
      id: "1",
      name: "Carlos Rodríguez",
      email,
      avatar: "https://i.pravatar.cc/150?img=7",
      stats: { experiencias: 12, favoritos: 8, esteAnio: 4 },
    });
    setLoading(false);
    router.replace("/(tabs)");
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setUser({
      id: "2",
      name: "María González",
      email: "maria@gmail.com",
      avatar: "https://i.pravatar.cc/150?img=5",
      stats: { experiencias: 6, favoritos: 3, esteAnio: 2 },
    });
    setLoading(false);
    router.replace("/(tabs)");
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
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={18} color={Colors.textMuted} />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="tu@email.com"
                placeholderTextColor={Colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />
            </View>

            {/* Password */}
            <Text style={styles.label}>Contraseña</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={18} color={Colors.textMuted} />
              <TextInput
                value={password}
                onChangeText={setPassword}
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
  input: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: Colors.textPrimary,
    padding: 0,
    margin: 0,
  },
};
