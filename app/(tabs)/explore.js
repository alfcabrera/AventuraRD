// app/(tabs)/explore.js
import React, { useState, useMemo } from "react";
import { View, Text, FlatList, TouchableOpacity, Dimensions, Image } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";
import { destinations, categories } from "@/data/destinations";
import SearchBar from "@components/SearchBar";
import { CategoryChip, RatingBadge } from "@components/UI";
import { Colors } from "@constants/colors";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48 - 12) / 2;

function GridCard({ item, onPress, index }) {
	return (
		<Animated.View entering={FadeInDown.delay(index * 60).springify()} style={{ width: CARD_WIDTH }}>
			<TouchableOpacity
				onPress={onPress}
				activeOpacity={0.92}
				style={{
					backgroundColor: Colors.card,
					borderRadius: 18,
					overflow: "hidden",
					shadowColor: "#000",
					shadowOffset: { width: 0, height: 3 },
					shadowOpacity: 0.08,
					shadowRadius: 10,
					elevation: 4,
					marginBottom: 12,
				}}
			>
				<Image source={item.image} style={{ width: "100%", height: 140 }} resizeMode="cover" />
				<View style={{ padding: 12 }}>
					<Text style={{ fontSize: 14, fontFamily: "Poppins_600SemiBold", color: Colors.textPrimary, marginBottom: 4 }} numberOfLines={1}>
						{item.title}
					</Text>
					<View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 8 }}>
						<Ionicons name="location-sharp" size={11} color={Colors.textSecondary} />
						<Text style={{ fontSize: 11, fontFamily: "Poppins_400Regular", color: Colors.textSecondary }} numberOfLines={1}>
							{item.location.split(",")[0]}
						</Text>
					</View>
					<View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
						<RatingBadge rating={item.rating} size="sm" />
						<Text style={{ fontSize: 14, fontFamily: "Poppins_700Bold", color: Colors.primary }}>${item.price}</Text>
					</View>
				</View>
			</TouchableOpacity>
		</Animated.View>
	);
}

export default function ExploreScreen() {
	const router = useRouter();
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [isGrid, setIsGrid] = useState(true);

	const filtered = useMemo(() => {
		return destinations.filter((d) => {
			const matchSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase()) || d.location.toLowerCase().includes(searchQuery.toLowerCase());
			const matchCategory = selectedCategory === "all" || d.category === selectedCategory;
			return matchSearch && matchCategory;
		});
	}, [searchQuery, selectedCategory]);

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={["top"]}>
			{/* Header */}
			<View style={{ paddingHorizontal: 24, paddingTop: 20, paddingBottom: 16 }}>
				<Text style={{ fontSize: 24, fontFamily: "Poppins_700Bold", color: Colors.textPrimary, marginBottom: 16 }}>Explorar</Text>
				<SearchBar placeholder="Buscar destinos, lugares..." value={searchQuery} onChangeText={setSearchQuery} />
			</View>

			{/* Categories + toggle */}
			<View style={{ marginBottom: 16 }}>
				<View style={{ flexDirection: "row", alignItems: "center" }}>
					<FlatList
						data={categories}
						key={(item) => item.id}
						keyExtractor={(item) => item.id}
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={{ paddingHorizontal: 24, paddingRight: 8 }}
						style={{ flex: 1 }}
						renderItem={({ item }) => <CategoryChip label={item.label} icon={item.icon} active={selectedCategory === item.id} onPress={() => setSelectedCategory(item.id)} />}
					/>
				</View>
			</View>

			{/* Results count */}
			<View style={{ paddingHorizontal: 24, marginBottom: 12 }}>
				<Text style={{ fontSize: 13, fontFamily: "Poppins_400Regular", color: Colors.textSecondary }}>
					{filtered.length} destino{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
				</Text>
			</View>

			{/* Grid / List */}
			{isGrid ? (
				<FlatList
					data={filtered}
					key={(item) => item.id}
					keyExtractor={(item) => item.id}
					numColumns={2}
					contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}
					columnWrapperStyle={{ gap: 12 }}
					showsVerticalScrollIndicator={false}
					renderItem={({ item, index }) => <GridCard item={item} index={index} onPress={() => router.push(`/destination/${item.id}`)} />}
					ListEmptyComponent={() => (
						<View style={{ alignItems: "center", paddingTop: 60, gap: 12 }}>
							<Ionicons name="search-outline" size={48} color={Colors.textMuted} />
							<Text style={{ fontSize: 16, fontFamily: "Poppins_600SemiBold", color: Colors.textPrimary }}>Sin resultados</Text>
							<Text style={{ fontSize: 14, fontFamily: "Poppins_400Regular", color: Colors.textSecondary, textAlign: "center" }}>Intenta con otros términos de búsqueda</Text>
						</View>
					)}
				/>
			) : (
				<FlatList
					data={filtered}
					key={(item) => item.id}
					keyExtractor={(item) => item.id}
					contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24, gap: 12 }}
					showsVerticalScrollIndicator={false}
					renderItem={({ item, index }) => (
						<Animated.View entering={FadeInDown.delay(index * 60).springify()}>
							<TouchableOpacity
								onPress={() => router.push(`/destination/${item.id}`)}
								activeOpacity={0.92}
								style={{
									flexDirection: "row",
									backgroundColor: Colors.card,
									borderRadius: 16,
									overflow: "hidden",
									shadowColor: "#000",
									shadowOffset: { width: 0, height: 2 },
									shadowOpacity: 0.07,
									shadowRadius: 8,
									elevation: 3,
								}}
							>
								<Image source={item.image} style={{ width: 100, height: 100 }} resizeMode="cover" />
								<View style={{ flex: 1, padding: 14, justifyContent: "space-between" }}>
									<View>
										<Text style={{ fontSize: 15, fontFamily: "Poppins_600SemiBold", color: Colors.textPrimary }} numberOfLines={1}>
											{item.title}
										</Text>
										<View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 }}>
											<Ionicons name="location-sharp" size={12} color={Colors.textSecondary} />
											<Text style={{ fontSize: 12, color: Colors.textSecondary, fontFamily: "Poppins_400Regular" }} numberOfLines={1}>
												{item.location}
											</Text>
										</View>
									</View>
									<View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
										<RatingBadge rating={item.rating} size="sm" />
										<Text style={{ fontSize: 15, fontFamily: "Poppins_700Bold", color: Colors.primary }}>${item.price}</Text>
									</View>
								</View>
							</TouchableOpacity>
						</Animated.View>
					)}
				/>
			)}
		</SafeAreaView>
	);
}
