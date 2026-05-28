// app/(tabs)/_layout.js
import { Tabs } from "expo-router";
import { View, Text, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@constants/colors";

function TabIcon({ name, label, focused }) {
	return (
		<View style={{ alignItems: "center", justifyContent: "center", gap: 3, paddingTop: 8 }}>
			<View
				style={{
					width: focused ? 40 : 28,
					height: 28,
					borderRadius: 14,
					backgroundColor: focused ? Colors.primaryLight : "transparent",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<Ionicons name={name} size={22} color={focused ? Colors.primary : Colors.textMuted} />
			</View>
			<Text
				style={{
					fontSize: 10,
					fontFamily: focused ? "Poppins_600SemiBold" : "Poppins_400Regular",
					color: focused ? Colors.primary : Colors.textMuted,
				}}
			>
				{label}
			</Text>
		</View>
	);
}

export default function TabsLayout() {
	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarStyle: {
					backgroundColor: Colors.card,
					borderTopColor: Colors.border,
					borderTopWidth: 1,
					height: Platform.OS === "ios" ? 85 : 65,
					paddingBottom: Platform.OS === "ios" ? 20 : 10,
					shadowColor: "#000",
					shadowOffset: { width: 0, height: -4 },
					shadowOpacity: 0.06,
					shadowRadius: 12,
					elevation: 10,
				},
				tabBarShowLabel: false,
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					tabBarIcon: ({ focused }) => <TabIcon name={focused ? "home" : "home-outline"} label="Inicio" focused={focused} />,
				}}
			/>
			<Tabs.Screen
				name="explore"
				options={{
					tabBarIcon: ({ focused }) => <TabIcon name={focused ? "compass" : "compass-outline"} label="Explorar" focused={focused} />,
				}}
			/>
			<Tabs.Screen
				name="favorites"
				options={{
					tabBarIcon: ({ focused }) => <TabIcon name={focused ? "heart" : "heart-outline"} label="Favoritos" focused={focused} />,
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					tabBarIcon: ({ focused }) => <TabIcon name={focused ? "person" : "person-outline"} label="Perfil" focused={focused} />,
				}}
			/>
		</Tabs>
	);
}
