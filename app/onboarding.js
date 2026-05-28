// app/onboarding.js
import React, { useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  FadeIn,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppStore } from "@/store/useAppStore";
import { onboardingSlides } from "@/data/destinations";
import PrimaryButton from "@components/PrimaryButton";
import { Colors } from "@constants/colors";

const { width, height } = Dimensions.get("window");

const gradients = [
  [Colors.gradientStart, Colors.gradientEnd],
  ["#1A6B9A", "#0D3B5E"],
  ["#F4A024", "#E05D00"],
];

function OnboardingSlide({ item, index }) {
  return (
    <Animated.View
      entering={FadeIn.delay(200)}
      style={{ width, alignItems: "center", justifyContent: "center", paddingHorizontal: 40 }}
    >
      {/* Icon circle */}
      <View
        style={{
          width: 140,
          height: 140,
          borderRadius: 70,
          backgroundColor: "rgba(255,255,255,0.2)",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 40,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.2,
          shadowRadius: 20,
        }}
      >
        <View
          style={{
            width: 110,
            height: 110,
            borderRadius: 55,
            backgroundColor: "rgba(255,255,255,0.3)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name={item.icon} size={52} color="#fff" />
        </View>
      </View>

      <Text
        style={{
          fontSize: 30,
          fontFamily: "Poppins_700Bold",
          color: "#fff",
          textAlign: "center",
          marginBottom: 20,
          lineHeight: 40,
        }}
      >
        {item.title}
      </Text>
      <Text
        style={{
          fontSize: 16,
          fontFamily: "Poppins_400Regular",
          color: "rgba(255,255,255,0.85)",
          textAlign: "center",
          lineHeight: 26,
        }}
      >
        {item.description}
      </Text>
    </Animated.View>
  );
}

export default function OnboardingScreen() {
  const router = useRouter();
  const setOnboardingCompleted = useAppStore((s) => s.setOnboardingCompleted);
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < onboardingSlides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = async () => {
    await setOnboardingCompleted();
    router.replace("/(auth)/login");
  };

  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const isLast = currentIndex === onboardingSlides.length - 1;
  const gradient = gradients[currentIndex] || gradients[0];

  return (
    <LinearGradient colors={gradient} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Skip button */}
        <TouchableOpacity
          onPress={handleFinish}
          style={{ position: "absolute", top: 56, right: 24, zIndex: 10 }}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Poppins_500Medium",
              color: "rgba(255,255,255,0.85)",
            }}
          >
            Saltar
          </Text>
        </TouchableOpacity>

        {/* Slides */}
        <View style={{ flex: 1, justifyContent: "center" }}>
          <FlatList
            ref={flatListRef}
            data={onboardingSlides}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleScroll}
            renderItem={({ item, index }) => (
              <OnboardingSlide item={item} index={index} />
            )}
          />
        </View>

        {/* Bottom section */}
        <View style={{ paddingHorizontal: 32, paddingBottom: 48, gap: 32 }}>
          {/* Pagination dots */}
          <View style={{ flexDirection: "row", justifyContent: "center", gap: 8 }}>
            {onboardingSlides.map((_, index) => (
              <View
                key={index}
                style={{
                  height: 8,
                  width: index === currentIndex ? 28 : 8,
                  borderRadius: 4,
                  backgroundColor:
                    index === currentIndex
                      ? "#fff"
                      : "rgba(255,255,255,0.4)",
                }}
              />
            ))}
          </View>

          <TouchableOpacity
            onPress={handleNext}
            style={{
              backgroundColor: "#fff",
              borderRadius: 16,
              paddingVertical: 18,
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.2,
              shadowRadius: 16,
              elevation: 8,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Poppins_600SemiBold",
                color: gradient[0],
              }}
            >
              {isLast ? "¡Empecemos!" : "Continuar"}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
