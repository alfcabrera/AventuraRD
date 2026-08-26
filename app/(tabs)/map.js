// app/(tabs)/map.js
// Mapa de experiencias — versión offline del wireframe "Mapa".
// No se usa react-native-maps a propósito: el prototipo debe correr en Expo Go
// y en el build web sin dev build ni API keys. En su lugar proyectamos las
// coordenadas reales de cada destino sobre un lienzo estilizado, de modo que la
// posición relativa de los pines sí se corresponde con la geografía del Este.
import React, { useMemo, useState } from "react";
import { View, Text, Image, TouchableOpacity, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeIn, FadeInDown, FadeOut } from "react-native-reanimated";
import { destinations } from "@/data/destinations";
import { Colors } from "@constants/colors";

const PIN_SIZE = 36;
// Margen interior para que ningún pin quede pegado al borde ni bajo la píldora.
const PADDING = { top: 96, right: 44, bottom: 150, left: 44 };

// Extremos reales del conjunto de destinos. Se calculan una vez a nivel de
// módulo porque `destinations` es estático.
const bounds = destinations.reduce(
  (acc, d) => ({
    minLat: Math.min(acc.minLat, d.coordinates.latitude),
    maxLat: Math.max(acc.maxLat, d.coordinates.latitude),
    minLon: Math.min(acc.minLon, d.coordinates.longitude),
    maxLon: Math.max(acc.maxLon, d.coordinates.longitude),
  }),
  { minLat: Infinity, maxLat: -Infinity, minLon: Infinity, maxLon: -Infinity }
);

// Proyección lineal lat/lon -> x/y. La latitud se invierte porque en pantalla
// el eje Y crece hacia abajo, pero el norte va arriba.
function project(coordinates, size) {
  const usableWidth = Math.max(size.width - PADDING.left - PADDING.right, 1);
  const usableHeight = Math.max(size.height - PADDING.top - PADDING.bottom, 1);
  const lonSpan = bounds.maxLon - bounds.minLon || 1;
  const latSpan = bounds.maxLat - bounds.minLat || 1;

  return {
    x: PADDING.left + ((coordinates.longitude - bounds.minLon) / lonSpan) * usableWidth,
    y: PADDING.top + (1 - (coordinates.latitude - bounds.minLat) / latSpan) * usableHeight,
  };
}

function Pin({ item, position, selected, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={`Ver ${item.title} en ${item.location}`}
      style={{
        position: "absolute",
        left: position.x - PIN_SIZE / 2,
        top: position.y - PIN_SIZE / 2,
        width: PIN_SIZE,
        height: PIN_SIZE,
        borderRadius: PIN_SIZE / 2,
        backgroundColor: selected ? Colors.primaryDark : Colors.primary,
        borderWidth: 3,
        borderColor: Colors.white,
        alignItems: "center",
        justifyContent: "center",
        transform: [{ scale: selected ? 1.2 : 1 }],
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.22,
        shadowRadius: 6,
        elevation: 6,
      }}
    >
      <Ionicons name="location-sharp" size={17} color={Colors.white} />
    </TouchableOpacity>
  );
}

function DestinationSheet({ item, onClose, onOpen }) {
  return (
    <Animated.View
      entering={FadeInDown.springify().damping(16)}
      exiting={FadeOut.duration(150)}
      style={{
        position: "absolute",
        left: 20,
        right: 20,
        bottom: 20,
      }}
    >
      <TouchableOpacity
        onPress={onOpen}
        activeOpacity={0.92}
        style={{
          flexDirection: "row",
          backgroundColor: Colors.card,
          borderRadius: 18,
          overflow: "hidden",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.14,
          shadowRadius: 16,
          elevation: 10,
        }}
      >
        <Image source={item.image} style={{ width: 96, height: 106 }} resizeMode="cover" />
        <View style={{ flex: 1, padding: 14, justifyContent: "space-between" }}>
          <View>
            <View
              style={{
                backgroundColor: Colors.primaryLight,
                borderRadius: 6,
                paddingHorizontal: 8,
                paddingVertical: 3,
                alignSelf: "flex-start",
                marginBottom: 6,
              }}
            >
              <Text style={{ fontSize: 10, color: Colors.primary, fontFamily: "Poppins_600SemiBold" }}>
                {item.category}
              </Text>
            </View>
            <Text
              style={{ fontSize: 15, fontFamily: "Poppins_600SemiBold", color: Colors.textPrimary, marginBottom: 4 }}
              numberOfLines={1}
            >
              {item.title}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Ionicons name="location-sharp" size={12} color={Colors.textSecondary} />
              <Text
                style={{ fontSize: 12, color: Colors.textSecondary, fontFamily: "Poppins_400Regular" }}
                numberOfLines={1}
              >
                {item.location}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Ionicons name="star" size={13} color={Colors.accent} />
              <Text style={{ fontSize: 13, fontFamily: "Poppins_600SemiBold", color: Colors.textPrimary }}>
                {item.rating}
              </Text>
            </View>
            <Text style={{ fontSize: 15, fontFamily: "Poppins_700Bold", color: Colors.primary }}>
              ${item.price}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={onClose}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Cerrar"
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            width: 26,
            height: 26,
            borderRadius: 13,
            backgroundColor: Colors.background,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="close" size={15} color={Colors.textSecondary} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function MapScreen() {
  const router = useRouter();
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [selectedId, setSelectedId] = useState(null);

  const pins = useMemo(() => {
    if (!size.width || !size.height) return [];
    return destinations.map((item) => ({ item, position: project(item.coordinates, size) }));
  }, [size.width, size.height]);

  const selected = destinations.find((d) => d.id === selectedId);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <LinearGradient
        colors={["#DCEAF7", "#E4F1E9", "#EAF6EE"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
        {/* Tocar el lienzo deselecciona; los pines detienen la propagación. */}
        <Pressable
          onPress={() => setSelectedId(null)}
          onLayout={(e) => setSize(e.nativeEvent.layout)}
          style={{ flex: 1 }}
        >
          {/* Trazos decorativos que evocan la costa, como en el wireframe. */}
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              top: "18%",
              left: "-15%",
              width: "80%",
              borderTopWidth: 1,
              borderColor: "rgba(47,158,98,0.18)",
              borderStyle: "dashed",
              transform: [{ rotate: "38deg" }],
            }}
          />
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              top: "30%",
              right: "-20%",
              width: "85%",
              borderTopWidth: 1,
              borderColor: "rgba(26,107,154,0.16)",
              borderStyle: "dashed",
              transform: [{ rotate: "-42deg" }],
            }}
          />

          {pins.map(({ item, position }) => (
            <Pin
              key={item.id}
              item={item}
              position={position}
              selected={item.id === selectedId}
              onPress={() => setSelectedId(item.id)}
            />
          ))}
        </Pressable>

        {/* Píldora de título flotante */}
        <SafeAreaView
          pointerEvents="box-none"
          edges={["top"]}
          style={{ position: "absolute", top: 0, left: 0, right: 0, alignItems: "center" }}
        >
          <Animated.View
            entering={FadeIn.duration(300)}
            style={{
              marginTop: 12,
              backgroundColor: Colors.card,
              borderRadius: 22,
              paddingHorizontal: 20,
              paddingVertical: 11,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.1,
              shadowRadius: 10,
              elevation: 5,
            }}
          >
            <Ionicons name="map" size={16} color={Colors.primary} />
            <Text style={{ fontSize: 14, fontFamily: "Poppins_600SemiBold", color: Colors.textPrimary }}>
              Mapa de experiencias
            </Text>
          </Animated.View>

          <Text
            style={{
              marginTop: 6,
              fontSize: 11,
              fontFamily: "Poppins_400Regular",
              color: Colors.textSecondary,
            }}
          >
            {destinations.length} actividades en la región Este
          </Text>
        </SafeAreaView>

        {selected && (
          <DestinationSheet
            item={selected}
            onClose={() => setSelectedId(null)}
            onOpen={() => router.push(`/destination/${selected.id}`)}
          />
        )}
      </LinearGradient>
    </View>
  );
}
