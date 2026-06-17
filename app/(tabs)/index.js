// app/(tabs)/index.js
import React, { useState } from "react";
import { View, Text, ScrollView, FlatList, TouchableOpacity, Image, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import { useAppStore } from "@/store/useAppStore";
import { destinations, categories } from "@/data/destinations";
import DestinationCard from "@components/DestinationCard";
import SearchBar from "@components/SearchBar";
import { CategoryChip } from "@components/UI";
import { Colors } from "@constants/colors";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
	const router = useRouter();
	const user = useAppStore((s) => s.user);
	const [selectedCategory, setSelectedCategory] = useState("all");

	const featured = destinations.filter((d) => d.featured);
	const recommended = selectedCategory === "all" ? destinations : destinations.filter((d) => d.category === selectedCategory);

	const greeting = () => {
		const hour = new Date().getHours();
		if (hour < 12) return "Buenos días";
		if (hour < 18) return "Buenas tardes";
		return "Buenas noches";
	};

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={["top"]}>
			<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
				{/* Header */}
				<Animated.View
					entering={FadeInDown.delay(50).springify()}
					style={{
						paddingHorizontal: 24,
						paddingTop: 20,
						paddingBottom: 16,
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "space-between",
					}}
				>
					<View>
						<Text style={{ fontSize: 14, fontFamily: "Poppins_400Regular", color: Colors.textSecondary }}>{greeting()}, 👋</Text>
						<Text style={{ fontSize: 22, fontFamily: "Poppins_700Bold", color: Colors.textPrimary }}>{user?.name?.split(" ")[0] || "Aventurero"}</Text>
					</View>
					<TouchableOpacity
						style={{
							width: 46,
							height: 46,
							borderRadius: 23,
							overflow: "hidden",
							borderWidth: 2,
							borderColor: Colors.primary,
						}}
						onPress={() => router.push("/(tabs)/profile")}
					>
						<Image source={{ uri: user?.avatar || "https://i.pravatar.cc/150?img=7" }} style={{ width: "100%", height: "100%" }} />
					</TouchableOpacity>
				</Animated.View>

				{/* Search bar */}
				<Animated.View entering={FadeInDown.delay(100).springify()} style={{ paddingHorizontal: 24, marginBottom: 24 }}>
					<SearchBar placeholder="¿A dónde quieres ir?" onPress={() => router.push("/(tabs)/explore")} editable={false} />
				</Animated.View>

				{/* Categories */}
				<Animated.View entering={FadeInRight.delay(150).springify()}>
					<View style={{ paddingHorizontal: 24, marginBottom: 12 }}>
						<Text style={{ fontSize: 18, fontFamily: "Poppins_700Bold", color: Colors.textPrimary }}>Categorías</Text>
					</View>
					<FlatList
						data={categories}
						key={(item) => item.id}
						keyExtractor={(item) => item.id}
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={{ paddingHorizontal: 24 }}
						renderItem={({ item }) => <CategoryChip label={item.label} icon={item.icon} active={selectedCategory === item.id} onPress={() => setSelectedCategory(item.id)} />}
					/>
				</Animated.View>

				{/* Featured destinations */}
				<View style={{ marginTop: 28 }}>
					<View
						style={{
							paddingHorizontal: 24,
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "center",
							marginBottom: 16,
						}}
					>
						<Text style={{ fontSize: 18, fontFamily: "Poppins_700Bold", color: Colors.textPrimary }}>Destacados</Text>
						<TouchableOpacity onPress={() => router.push("/(tabs)/explore")}>
							<Text style={{ fontSize: 13, fontFamily: "Poppins_500Medium", color: Colors.primary }}>Ver todos</Text>
						</TouchableOpacity>
					</View>
					<FlatList
						data={featured}
						keyExtractor={(item) => item.id}
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={{ paddingHorizontal: 24 }}
						renderItem={({ item, index }) => <DestinationCard item={item} index={index} onPress={() => router.push(`/destination/${item.id}`)} />}
					/>
				</View>

				{/* Recommended */}
				<View style={{ marginTop: 28, paddingHorizontal: 24 }}>
					<Text style={{ fontSize: 18, fontFamily: "Poppins_700Bold", color: Colors.textPrimary, marginBottom: 16 }}>{selectedCategory === "all" ? "Todos los destinos" : selectedCategory}</Text>
					{recommended.map((item, index) => (
						<DestinationCard key={item.id} item={item} index={index} variant="horizontal" onPress={() => router.push(`/destination/${item.id}`)} />
					))}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
