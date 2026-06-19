// components/SearchBar.js
import React, { useState } from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@constants/colors";

export default function SearchBar({
  placeholder = "Buscar destinos...",
  value,
  onChangeText,
  onPress,
  editable = true,
  style,
}) {
  const [focused, setFocused] = useState(false);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.8 : 1}
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: Colors.card,
          borderRadius: 14,
          paddingHorizontal: 16,
          paddingVertical: 14,
          gap: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: focused ? 0.12 : 0.06,
          shadowRadius: 8,
          elevation: 3,
          borderWidth: focused ? 1.5 : 1,
          borderColor: focused ? Colors.primary : Colors.border,
        },
        style,
      ]}
    >
      <Ionicons
        name="search-outline"
        size={20}
        color={focused ? Colors.primary : Colors.textMuted}
      />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={Colors.textMuted}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        editable={editable}
        pointerEvents={onPress ? "none" : "auto"}
        style={{
          flex: 1,
          fontSize: 14,
          color: Colors.textPrimary,
          fontFamily: "Poppins_400Regular",
          padding: 0,
          margin: 0,
        }}
      />
      {value?.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText?.("")}>
          <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}
