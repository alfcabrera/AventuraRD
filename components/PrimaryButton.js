// components/PrimaryButton.js
import React from "react";
import { TouchableOpacity, Text, ActivityIndicator, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { Colors } from "@constants/colors";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function PrimaryButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = "filled", // "filled" | "outline" | "ghost"
  size = "md", // "sm" | "md" | "lg"
  icon,
  style,
  textStyle,
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const sizeStyles = {
    sm: { paddingVertical: 10, paddingHorizontal: 20, fontSize: 13 },
    md: { paddingVertical: 14, paddingHorizontal: 24, fontSize: 15 },
    lg: { paddingVertical: 18, paddingHorizontal: 32, fontSize: 17 },
  };

  const variantStyles = {
    filled: {
      button: {
        backgroundColor: disabled ? "#9CA3AF" : Colors.primary,
        borderWidth: 0,
      },
      text: { color: "#FFFFFF" },
    },
    outline: {
      button: {
        backgroundColor: "transparent",
        borderWidth: 2,
        borderColor: Colors.primary,
      },
      text: { color: Colors.primary },
    },
    ghost: {
      button: {
        backgroundColor: "transparent",
        borderWidth: 0,
      },
      text: { color: Colors.primary },
    },
  };

  const currentSize = sizeStyles[size];
  const currentVariant = variantStyles[variant];

  return (
    <AnimatedTouchable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      activeOpacity={0.9}
      style={[
        animatedStyle,
        {
          borderRadius: 14,
          paddingVertical: currentSize.paddingVertical,
          paddingHorizontal: currentSize.paddingHorizontal,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          shadowColor: variant === "filled" ? Colors.primary : "transparent",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: variant === "filled" ? 4 : 0,
        },
        currentVariant.button,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "filled" ? "#FFF" : Colors.primary}
        />
      ) : (
        <>
          {icon && <View>{icon}</View>}
          <Text
            style={[
              {
                fontSize: currentSize.fontSize,
                fontFamily: "Poppins_600SemiBold",
                letterSpacing: 0.3,
              },
              currentVariant.text,
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </AnimatedTouchable>
  );
}
