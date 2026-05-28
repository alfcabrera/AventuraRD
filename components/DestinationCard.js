// components/DestinationCard.js
import React from "react";
import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  FadeInDown,
} from "react-native-reanimated";
import { Colors } from "@constants/colors";
import { useAppStore } from "@/store/useAppStore";

const { width } = Dimensions.get("window");

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function DestinationCard({
  item,
  onPress,
  variant = "vertical", // "vertical" | "horizontal" | "compact"
  index = 0,
}) {
  const scale = useSharedValue(1);
  const { toggleFavorite, isFavorite } = useAppStore();
  const favorited = isFavorite(item.id);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 20, stiffness: 400 });
  };
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 20, stiffness: 400 });
  };

  const difficultyColor = {
    Fácil: Colors.success,
    Moderado: Colors.accent,
    Difícil: Colors.danger,
  }[item.difficulty] || Colors.textMuted;

  if (variant === "horizontal") {
    return (
      <AnimatedTouchable
        entering={FadeInDown.delay(index * 80).springify()}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.95}
        style={[
          animatedStyle,
          {
            flexDirection: "row",
            backgroundColor: Colors.card,
            borderRadius: 16,
            marginBottom: 12,
            overflow: "hidden",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 3,
          },
        ]}
      >
        <Image
          source={{ uri: item.image }}
          style={{ width: 110, height: 110 }}
          resizeMode="cover"
        />
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
              <Text
                style={{
                  fontSize: 10,
                  color: Colors.primary,
                  fontFamily: "Poppins_600SemiBold",
                }}
              >
                {item.category}
              </Text>
            </View>
            <Text
              style={{
                fontSize: 15,
                fontFamily: "Poppins_600SemiBold",
                color: Colors.textPrimary,
                marginBottom: 4,
              }}
              numberOfLines={1}
            >
              {item.title}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Ionicons name="location-sharp" size={12} color={Colors.textSecondary} />
              <Text
                style={{
                  fontSize: 12,
                  color: Colors.textSecondary,
                  fontFamily: "Poppins_400Regular",
                }}
                numberOfLines={1}
              >
                {item.location}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Ionicons name="star" size={13} color={Colors.accent} />
              <Text style={{ fontSize: 13, color: Colors.textPrimary, fontFamily: "Poppins_600SemiBold" }}>
                {item.rating}
              </Text>
            </View>
            <Text style={{ fontSize: 15, color: Colors.primary, fontFamily: "Poppins_700Bold" }}>
              ${item.price}
            </Text>
          </View>
        </View>
      </AnimatedTouchable>
    );
  }

  // Vertical card (default)
  return (
    <AnimatedTouchable
      entering={FadeInDown.delay(index * 100).springify()}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.95}
      style={[
        animatedStyle,
        {
          width: variant === "compact" ? 180 : width * 0.7,
          marginRight: 16,
          backgroundColor: Colors.card,
          borderRadius: 20,
          overflow: "hidden",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 5,
        },
      ]}
    >
      <View style={{ position: "relative" }}>
        <Image
          source={{ uri: item.image }}
          style={{ width: "100%", height: variant === "compact" ? 130 : 200 }}
          resizeMode="cover"
        />
        {/* Rating Badge */}
        <View
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            backgroundColor: "rgba(0,0,0,0.55)",
            borderRadius: 20,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 10,
            paddingVertical: 5,
            gap: 4,
          }}
        >
          <Ionicons name="star" size={12} color="#F4A024" />
          <Text style={{ color: "#fff", fontSize: 12, fontFamily: "Poppins_600SemiBold" }}>
            {item.rating}
          </Text>
        </View>
        {/* Favorite button */}
        <TouchableOpacity
          onPress={() => toggleFavorite(item)}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            backgroundColor: "rgba(255,255,255,0.9)",
            borderRadius: 20,
            width: 36,
            height: 36,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons
            name={favorited ? "heart" : "heart-outline"}
            size={18}
            color={favorited ? Colors.danger : Colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      <View style={{ padding: 14 }}>
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
          style={{
            fontSize: 16,
            fontFamily: "Poppins_600SemiBold",
            color: Colors.textPrimary,
            marginBottom: 6,
          }}
          numberOfLines={1}
        >
          {item.title}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 10 }}>
          <Ionicons name="location-sharp" size={13} color={Colors.textSecondary} />
          <Text
            style={{ fontSize: 12, color: Colors.textSecondary, fontFamily: "Poppins_400Regular" }}
            numberOfLines={1}
          >
            {item.location}
          </Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={{ fontSize: 18, color: Colors.primary, fontFamily: "Poppins_700Bold" }}>
            ${item.price}
            <Text style={{ fontSize: 12, color: Colors.textMuted, fontFamily: "Poppins_400Regular" }}>
              {" "}/ persona
            </Text>
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Ionicons name="time-outline" size={12} color={Colors.textMuted} />
            <Text style={{ fontSize: 12, color: Colors.textMuted, fontFamily: "Poppins_400Regular" }}>
              {item.duration}
            </Text>
          </View>
        </View>
      </View>
    </AnimatedTouchable>
  );
}
