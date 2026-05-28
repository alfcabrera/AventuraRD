// app/(auth)/register.js
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
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useAppStore } from "@/store/useAppStore";
import PrimaryButton from "@components/PrimaryButton";
import { Colors } from "@constants/colors";

export default function RegisterScreen() {
  const router = useRouter();
  const setUser = useAppStore((s) => s.setUser);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setUser({
      id: "3",
      name,
      email,
      avatar: "https://i.pravatar.cc/150?img=12",
      stats: { experiencias: 0, favoritos: 0, esteAnio: 0 },
    });
    setLoading(false);
    router.replace("/(tabs)");
  };

  const inputStyle = {
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
  };

  const labelStyle = {
    fontSize: 13,
    fontFamily: "Poppins_500Medium",
    color: Colors.textPrimary,
    marginBottom: 8,
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: 20 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back */}
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              width: 42,
              height: 42,
              borderRadius: 21,
              backgroundColor: Colors.card,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 24,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 6,
              elevation: 3,
            }}
          >
            <Ionicons name="arrow-back" size={20} color={Colors.textPrimary} />
          </TouchableOpacity>

          <Animated.View entering={FadeInDown.springify()}>
            <Text style={{ fontSize: 28, fontFamily: "Poppins_700Bold", color: Colors.textPrimary, marginBottom: 8 }}>
              Crea tu cuenta
            </Text>
            <Text style={{ fontSize: 15, fontFamily: "Poppins_400Regular", color: Colors.textSecondary, marginBottom: 32 }}>
              Únete a la comunidad AventuraRD
            </Text>

            <Text style={labelStyle}>Nombre completo</Text>
            <View style={inputStyle}>
              <Ionicons name="person-outline" size={18} color={Colors.textMuted} />
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Tu nombre"
                placeholderTextColor={Colors.textMuted}
                style={{ flex: 1, fontSize: 14, fontFamily: "Poppins_400Regular", color: Colors.textPrimary, padding: 0 }}
              />
            </View>

            <Text style={labelStyle}>Correo electrónico</Text>
            <View style={inputStyle}>
              <Ionicons name="mail-outline" size={18} color={Colors.textMuted} />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="tu@email.com"
                placeholderTextColor={Colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                style={{ flex: 1, fontSize: 14, fontFamily: "Poppins_400Regular", color: Colors.textPrimary, padding: 0 }}
              />
            </View>

            <Text style={labelStyle}>Contraseña</Text>
            <View style={inputStyle}>
              <Ionicons name="lock-closed-outline" size={18} color={Colors.textMuted} />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor={Colors.textMuted}
                secureTextEntry={!showPassword}
                style={{ flex: 1, fontSize: 14, fontFamily: "Poppins_400Regular", color: Colors.textPrimary, padding: 0 }}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={18}
                  color={Colors.textMuted}
                />
              </TouchableOpacity>
            </View>

            <PrimaryButton
              title="Crear cuenta"
              onPress={handleRegister}
              loading={loading}
              style={{ marginTop: 8 }}
            />

            <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 24, gap: 4 }}>
              <Text style={{ fontSize: 14, color: Colors.textSecondary, fontFamily: "Poppins_400Regular" }}>
                ¿Ya tienes cuenta?
              </Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={{ fontSize: 14, color: Colors.primary, fontFamily: "Poppins_600SemiBold" }}>
                  Inicia sesión
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
