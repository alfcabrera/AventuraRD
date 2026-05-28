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

	useEffect(() => {
		const timeout = setTimeout(() => {
			if (!onboardingCompleted) {
				router.replace("/onboarding");
			} else if (!isAuthenticated) {
				router.replace("/(auth)/login");
			} else {
				router.replace("/(tabs)");
			}
		}, 300);
		return () => clearTimeout(timeout);
	}, [onboardingCompleted, isAuthenticated]);

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
