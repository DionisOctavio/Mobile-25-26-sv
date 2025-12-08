import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function HomeMiniTeacherCard({
  profesor,
  isFavorite,
  onToggleFavorite,
  onPress,
}) {
  const imageUri =
    profesor?.thumbnailUrlPublica ||
    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

  return (
    <TouchableOpacity onPress={onPress} style={styles.card} activeOpacity={0.9}>
      {/* ❤️ FAVORITO */}
      <TouchableOpacity
        style={styles.heart}
        onPress={(e) => {
          e.stopPropagation();
          onToggleFavorite();
        }}
      >
        <Ionicons
          name={isFavorite ? "heart" : "heart-outline"}
          size={17}
          color={"#FF4B8A"}
        />
      </TouchableOpacity>

      {/* FOTO */}
      <Image source={{ uri: imageUri }} style={styles.avatar} />

      {/* NOMBRE */}
      <Text numberOfLines={1} style={styles.name}>
        {profesor.nombre} {profesor.apellido}
      </Text>

      {/* BADGE */}
      {profesor.categoria && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{profesor.categoria}</Text>
        </View>
      )}

      {/* ⭐ RATING + € */}
      <View style={styles.bottomRow}>
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={13} color="#FFC107" />
          <Text style={styles.rating}>{profesor.valoracion || "0.0"}</Text>
        </View>

        <Text style={styles.price}>{profesor.precio_hora}€/h</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 130,
    borderRadius: 18,
    padding: 10,
    backgroundColor: "#FFF",
    marginRight: 12,
    elevation: 2,
    alignItems: "center",
    marginBottom: 12,
  },

  heart: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "white",
    borderRadius: 999,
    padding: 4,
    zIndex: 20,
  },

  avatar: {
    width: "100%",
    height: 100,
    borderRadius: 14,
    marginBottom: 8,
  },

  name: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
  },

  badge: {
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: "#F3E8FF",
  },
  badgeText: {
    fontSize: 10,
    color: "#7C3AED",
    fontWeight: "600",
  },

  bottomRow: {
    marginTop: 8,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  rating: {
    fontSize: 11,
    fontWeight: "600",
    marginLeft: 3,
    color: "#111827",
  },

  price: {
    fontSize: 12,
    fontWeight: "700",
    color: "#111827",
  },
});
