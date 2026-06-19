// app/(tabs)/profile.js
import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useAppStore } from "@/store/useAppStore";
import { Colors } from "@constants/colors";

function StatCard({ value, label }) {
  return (
    <View style={{ alignItems: "center", gap: 4 }}>
      <Text style={{ fontSize: 22, fontFamily: "Poppins_700Bold", color: Colors.textPrimary }}>
        {value}
      </Text>
      <Text style={{ fontSize: 12, fontFamily: "Poppins_400Regular", color: Colors.textSecondary }}>
        {label}
      </Text>
    </View>
  );
}

function MenuItem({ icon, label, subtitle, onPress, danger = false }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
        paddingVertical: 16,
        paddingHorizontal: 20,
        backgroundColor: Colors.card,
        borderRadius: 16,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: danger ? "rgba(239,68,68,0.1)" : Colors.primaryLight,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name={icon} size={20} color={danger ? Colors.danger : Colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 15, fontFamily: "Poppins_500Medium", color: danger ? Colors.danger : Colors.textPrimary }}>
          {label}
        </Text>
        {subtitle && (
          <Text style={{ fontSize: 12, fontFamily: "Poppins_400Regular", color: Colors.textMuted }}>
            {subtitle}
          </Text>
        )}
      </View>
      {!danger && <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />}
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, favorites } = useAppStore();

  const handleLogout = () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro de que quieres cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Cerrar sesión",
          style: "destructive",
          onPress: async () => {
            await logout();
            router.replace("/(auth)/login");
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Profile card */}
        <Animated.View entering={FadeInDown.delay(50).springify()}>
          <LinearGradient
            colors={[Colors.primary, Colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              marginHorizontal: 20,
              marginTop: 20,
              borderRadius: 28,
              padding: 28,
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 84,
                height: 84,
                borderRadius: 42,
                borderWidth: 3,
                borderColor: "rgba(255,255,255,0.5)",
                overflow: "hidden",
                marginBottom: 16,
              }}
            >
              <Image
                source={{ uri: user?.avatar || "https://i.pravatar.cc/150?img=7" }}
                style={{ width: "100%", height: "100%" }}
              />
            </View>
            <Text style={{ fontSize: 20, fontFamily: "Poppins_700Bold", color: "#fff", marginBottom: 4 }}>
              {user?.name || "Aventurero"}
            </Text>
            <Text style={{ fontSize: 13, fontFamily: "Poppins_400Regular", color: "rgba(255,255,255,0.8)" }}>
              {user?.email || ""}
            </Text>

            {/* Stats */}
            <View
              style={{
                flexDirection: "row",
                marginTop: 24,
                backgroundColor: "rgba(255,255,255,0.15)",
                borderRadius: 18,
                paddingVertical: 18,
                paddingHorizontal: 32,
                gap: 0,
                width: "100%",
                justifyContent: "space-around",
              }}
            >
              <StatCard value={user?.stats?.experiencias || 0} label="Experiencias" />
              <View style={{ width: 1, backgroundColor: "rgba(255,255,255,0.25)" }} />
              <StatCard value={favorites.length} label="Favoritos" />
              <View style={{ width: 1, backgroundColor: "rgba(255,255,255,0.25)" }} />
              <StatCard value={user?.stats?.esteAnio || 0} label="Este año" />
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Menu items */}
        <Animated.View entering={FadeInDown.delay(150).springify()} style={{ paddingHorizontal: 20, marginTop: 24 }}>
          <Text style={{ fontSize: 13, fontFamily: "Poppins_600SemiBold", color: Colors.textMuted, marginBottom: 12, letterSpacing: 0.8, textTransform: "uppercase" }}>
            Mi cuenta
          </Text>

          <MenuItem
            icon="calendar-outline"
            label="Mis reservas"
            subtitle="Ver historial de viajes"
            onPress={() => {}}
          />
          <MenuItem
            icon="heart-outline"
            label="Favoritos"
            subtitle={`${favorites.length} destino${favorites.length !== 1 ? "s" : ""} guardado${favorites.length !== 1 ? "s" : ""}`}
            onPress={() => router.push("/(tabs)/favorites")}
          />
          <MenuItem
            icon="settings-outline"
            label="Configuración"
            subtitle="Notificaciones, privacidad"
            onPress={() => {}}
          />
          <MenuItem
            icon="help-circle-outline"
            label="Ayuda y soporte"
            subtitle="Centro de ayuda, contacto"
            onPress={() => {}}
          />
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(250).springify()}
          style={{ paddingHorizontal: 20, marginTop: 8 }}
        >
          <MenuItem
            icon="log-out-outline"
            label="Cerrar sesión"
            onPress={handleLogout}
            danger
          />
        </Animated.View>

        {/* Version */}
        <Text style={{ textAlign: "center", marginTop: 24, fontSize: 12, fontFamily: "Poppins_400Regular", color: Colors.textMuted }}>
          AventuraRD v1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
