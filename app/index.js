// app/index.js
import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter, useRootNavigationState } from "expo-router";
import { useAppStore } from "@/store/useAppStore";
import { Colors } from "@constants/colors";

export default function Index() {
	const router = useRouter();
	const onboardingCompleted = useAppStore((s) => s.onboardingCompleted);
	const isAuthenticated = useAppStore((s) => s.isAuthenticated);
	const authLoaded = useAppStore((s) => s.authLoaded);

	// El <Stack> del root layout termina de montarse DESPUÉS de que corra este
	// efecto (en React los efectos de los hijos se ejecutan antes que los del
	// padre). Sin esta guarda, expo-router lanza "Attempted to navigate before
	// mounting the Root Layout component". `key` solo existe cuando el navegador
	// ya está listo; al estarlo, el componente re-renderiza y el efecto reintenta.
	const rootNavigationState = useRootNavigationState();
	const navigatorReady = !!rootNavigationState?.key;

	useEffect(() => {
		if (!navigatorReady) return;
		// Esperamos a que Firebase restaure (o no) la sesión antes de decidir,
		// para no mandar a login a un usuario que sí tiene sesión activa.
		if (!authLoaded) return;
		if (!onboardingCompleted) {
			router.replace("/onboarding");
		} else if (!isAuthenticated) {
			router.replace("/(auth)/login");
		} else {
			router.replace("/(tabs)");
		}
	}, [navigatorReady, authLoaded, onboardingCompleted, isAuthenticated]);

	return (
		<View
			style={{
				flex: 1,
				backgroundColor: Colors.primary,
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<ActivityIndicator size="large" color="#fff" />
		</View>
	);
}
