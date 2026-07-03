// app/index.js
import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useAppStore } from "@/store/useAppStore";
import { Colors } from "@constants/colors";

export default function Index() {
	const router = useRouter();
	const onboardingCompleted = useAppStore((s) => s.onboardingCompleted);
	const isAuthenticated = useAppStore((s) => s.isAuthenticated);
	const authLoaded = useAppStore((s) => s.authLoaded);

	useEffect(() => {
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
	}, [authLoaded, onboardingCompleted, isAuthenticated]);

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
