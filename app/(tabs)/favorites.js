// app/(tabs)/favorites.js
import React from "react";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown, Layout } from "react-native-reanimated";
import { useAppStore } from "@/store/useAppStore";
import { EmptyState } from "@components/UI";
import PrimaryButton from "@components/PrimaryButton";
import { Colors } from "@constants/colors";

function FavoriteCard({ item, onPress, onRemove, index }) {
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 60).springify()}
      layout={Layout.springify()}
    >
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.92}
        style={{
          flexDirection: "row",
          backgroundColor: Colors.card,
          borderRadius: 18,
          overflow: "hidden",
          marginBottom: 14,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.07,
          shadowRadius: 10,
          elevation: 4,
        }}
      >
        <Image
          source={item.image}
          style={{ width: 100, height: 110 }}
          resizeMode="cover"
        />
        <View style={{ flex: 1, padding: 14, justifyContent: "space-between" }}>
          <View>
            <View
              style={{
                backgroundColor: Colors.primaryLight,
                borderRadius: 6,
                paddingHorizontal: 8,
                paddingVertical: 3,
                alignSelf: "flex-start",
                marginBottom: 6,
              }}
            >
              <Text style={{ fontSize: 10, color: Colors.primary, fontFamily: "Poppins_600SemiBold" }}>
                {item.category}
              </Text>
            </View>
            <Text
              style={{ fontSize: 15, fontFamily: "Poppins_600SemiBold", color: Colors.textPrimary, marginBottom: 4 }}
              numberOfLines={1}
            >
              {item.title}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Ionicons name="location-sharp" size={12} color={Colors.textSecondary} />
              <Text style={{ fontSize: 12, color: Colors.textSecondary, fontFamily: "Poppins_400Regular" }} numberOfLines={1}>
                {item.location}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Ionicons name="star" size={13} color={Colors.accent} />
              <Text style={{ fontSize: 13, fontFamily: "Poppins_600SemiBold", color: Colors.textPrimary }}>
                {item.rating}
              </Text>
            </View>
            <Text style={{ fontSize: 15, fontFamily: "Poppins_700Bold", color: Colors.primary }}>
              ${item.price}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={onRemove}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: "rgba(239,68,68,0.1)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="heart" size={16} color={Colors.danger} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function FavoritesScreen() {
  const router = useRouter();
  const { favorites, toggleFavorite } = useAppStore();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={["top"]}>
      <View style={{ paddingHorizontal: 24, paddingTop: 20, paddingBottom: 16 }}>
        <Text style={{ fontSize: 24, fontFamily: "Poppins_700Bold", color: Colors.textPrimary }}>
          Mis Favoritos
        </Text>
        {favorites.length > 0 && (
          <Text style={{ fontSize: 14, fontFamily: "Poppins_400Regular", color: Colors.textSecondary, marginTop: 4 }}>
            {favorites.length} destino{favorites.length !== 1 ? "s" : ""} guardado{favorites.length !== 1 ? "s" : ""}
          </Text>
        )}
      </View>

      {favorites.length === 0 ? (
        <EmptyState
          icon="heart-outline"
          title="Sin favoritos aún"
          description="Guarda los destinos que más te gusten para encontrarlos rápido aquí."
          action={
            <PrimaryButton
              title="Explorar destinos"
              onPress={() => router.push("/(tabs)/explore")}
              style={{ marginTop: 8 }}
            />
          }
        />
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <FavoriteCard
              item={item}
              index={index}
              onPress={() => router.push(`/destination/${item.id}`)}
              onRemove={() => toggleFavorite(item)}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}
