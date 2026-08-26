// app/index.js
import { useEffect } from "react";
import { View, Text, Image } from "react-native";
import { useRouter, useRootNavigationState } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
	FadeIn,
	FadeInDown,
	useAnimatedStyle,
	useSharedValue,
	withDelay,
	withRepeat,
	withSequence,
	withTiming,
} from "react-native-reanimated";
import { useAppStore } from "@/store/useAppStore";
import { Colors } from "@constants/colors";

// Punto suspensivo del indicador de carga: late en bucle con un desfase por
// índice para producir el efecto de onda del wireframe "Intro".
function LoadingDot({ index }) {
	const opacity = useSharedValue(0.35);

	useEffect(() => {
		opacity.value = withDelay(
			index * 180,
			withRepeat(withSequence(withTiming(1, { duration: 420 }), withTiming(0.35, { duration: 420 })), -1, false)
		);
	}, []);

	const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

	return (
		<Animated.View
			style={[
				{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: "rgba(255,255,255,0.9)" },
				style,
			]}
		/>
	);
}

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
		<LinearGradient
			colors={[Colors.gradientStart, Colors.gradientEnd]}
			start={{ x: 0, y: 0 }}
			end={{ x: 1, y: 1 }}
			style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
		>
			<Animated.View
				entering={FadeIn.duration(500)}
				style={{
					width: 84,
					height: 84,
					borderRadius: 22,
					backgroundColor: Colors.white,
					alignItems: "center",
					justifyContent: "center",
					shadowColor: "#000",
					shadowOffset: { width: 0, height: 8 },
					shadowOpacity: 0.18,
					shadowRadius: 18,
					elevation: 10,
				}}
			>
				<Image
					source={require("../assets/splash-icon.png")}
					style={{ width: 52, height: 52 }}
					resizeMode="contain"
				/>
			</Animated.View>

			<Animated.Text
				entering={FadeInDown.delay(180).duration(500)}
				style={{
					marginTop: 22,
					fontSize: 30,
					fontFamily: "Poppins_700Bold",
					color: Colors.white,
					letterSpacing: 0.3,
				}}
			>
				AventuraRD
			</Animated.Text>

			<Animated.Text
				entering={FadeInDown.delay(320).duration(500)}
				style={{
					marginTop: 4,
					fontSize: 14,
					fontFamily: "Poppins_400Regular",
					color: "rgba(255,255,255,0.88)",
				}}
			>
				Descubre experiencias auténticas
			</Animated.Text>

			<View style={{ position: "absolute", bottom: 64, flexDirection: "row", gap: 7 }}>
				{[0, 1, 2].map((i) => (
					<LoadingDot key={i} index={i} />
				))}
			</View>
		</LinearGradient>
	);
}
