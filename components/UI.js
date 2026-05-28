// components/CategoryChip.js
import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { Colors } from "@constants/colors";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const iconMap = {
  grid: "grid-outline",
  leaf: "leaf-outline",
  umbrella: "umbrella-outline",
  restaurant: "restaurant-outline",
  museum: "business-outline",
};

export function CategoryChip({ label, icon, active, onPress }) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedTouchable
      onPress={onPress}
      onPressIn={() => (scale.value = withSpring(0.94))}
      onPressOut={() => (scale.value = withSpring(1))}
      activeOpacity={0.8}
      style={[
        animatedStyle,
        {
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
          paddingHorizontal: 16,
          paddingVertical: 10,
          borderRadius: 50,
          backgroundColor: active ? Colors.primary : Colors.card,
          borderWidth: 1.5,
          borderColor: active ? Colors.primary : Colors.border,
          marginRight: 10,
          shadowColor: active ? Colors.primary : "transparent",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: active ? 3 : 0,
        },
      ]}
    >
      <Ionicons
        name={iconMap[icon] || "grid-outline"}
        size={15}
        color={active ? "#fff" : Colors.textSecondary}
      />
      <Text
        style={{
          fontSize: 13,
          fontFamily: active ? "Poppins_600SemiBold" : "Poppins_400Regular",
          color: active ? "#fff" : Colors.textSecondary,
        }}
      >
        {label}
      </Text>
    </AnimatedTouchable>
  );
}

// ─── RatingBadge ─────────────────────────────────────────────────
import { View } from "react-native";

export function RatingBadge({ rating, size = "md" }) {
  const fontSize = size === "sm" ? 11 : 13;
  const iconSize = size === "sm" ? 12 : 14;
  const px = size === "sm" ? 8 : 10;
  const py = size === "sm" ? 4 : 6;

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        backgroundColor: "rgba(244,160,36,0.15)",
        borderRadius: 20,
        paddingHorizontal: px,
        paddingVertical: py,
      }}
    >
      <Ionicons name="star" size={iconSize} color={Colors.accent} />
      <Text
        style={{
          fontSize,
          fontFamily: "Poppins_600SemiBold",
          color: "#B37400",
        }}
      >
        {rating}
      </Text>
    </View>
  );
}

// ─── EmptyState ──────────────────────────────────────────────────
export function EmptyState({ icon = "compass-outline", title, description, action }) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
        gap: 16,
      }}
    >
      <View
        style={{
          width: 90,
          height: 90,
          borderRadius: 45,
          backgroundColor: Colors.primaryLight,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name={icon} size={40} color={Colors.primary} />
      </View>
      <Text
        style={{
          fontSize: 18,
          fontFamily: "Poppins_600SemiBold",
          color: Colors.textPrimary,
          textAlign: "center",
        }}
      >
        {title}
      </Text>
      {description && (
        <Text
          style={{
            fontSize: 14,
            fontFamily: "Poppins_400Regular",
            color: Colors.textSecondary,
            textAlign: "center",
            lineHeight: 22,
          }}
        >
          {description}
        </Text>
      )}
      {action}
    </View>
  );
}

// ─── ScreenContainer ─────────────────────────────────────────────
import { SafeAreaView } from "react-native-safe-area-context";

export function ScreenContainer({ children, style, edges = ["top"] }) {
  return (
    <SafeAreaView
      edges={edges}
      style={[
        {
          flex: 1,
          backgroundColor: Colors.background,
        },
        style,
      ]}
    >
      {children}
    </SafeAreaView>
  );
}
