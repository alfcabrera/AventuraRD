// app/_layout.js
import { useEffect } from "react";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { useAppStore } from "@/store/useAppStore";
import "../global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const loadFavorites = useAppStore((s) => s.loadFavorites);
  const loadAuthState = useAppStore((s) => s.loadAuthState);
  const loadOnboardingState = useAppStore((s) => s.loadOnboardingState);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    async function init() {
      await Promise.all([loadFavorites(), loadAuthState(), loadOnboardingState()]);
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
      }
    }
    init();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="destination/[id]"
          options={{
            presentation: "card",
            animation: "slide_from_right",
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
