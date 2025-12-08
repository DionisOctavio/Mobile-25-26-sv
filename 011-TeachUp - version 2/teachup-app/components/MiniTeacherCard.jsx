import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function MiniTeacherCard({
  profesor,
  isFavorite,
  onToggleFavorite,
  onPress,
}) {
  const imageUri =
    profesor?.thumbnailUrlPublica ||
    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={styles.card}
    >
      {/* FAVORITO */}
      <TouchableOpacity
        style={styles.heartBtn}
        onPress={(e) => {
          e.stopPropagation();
          onToggleFavorite();
        }}
      >
        <Ionicons
          name={isFavorite ? "heart" : "heart-outline"}
          size={18}
          color="#FF4B8A"
        />
      </TouchableOpacity>

      {/* FOTO */}
      <Image source={{ uri: imageUri }} style={styles.avatar} />

      {/* NOMBRE */}
      <Text numberOfLines={1} style={styles.name}>
        {profesor.nombre} {profesor.apellido}
      </Text>

      {/* BADGE */}
      {profesor.categoria ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{profesor.categoria}</Text>
        </View>
      ) : null}

      {/* BOTTOM ROW */}
      <View style={styles.bottomRow}>
        {/* Rating */}
        <View style={styles.rating}>
          <Ionicons name="star" size={14} color="#FFC107" />
          <Text style={styles.ratingText}>
            {profesor.valoracion ? profesor.valoracion.toFixed(1) : "0.0"}
          </Text>
        </View>

        {/* Precio */}
        <Text style={styles.price}>{profesor.precio_hora}€/h</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",              // ajuste perfecto
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 12,
    marginBottom: 16,
    
    // Sombra elegante
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,

    // Quitar margenes que rompen columnas
    marginRight: 0,
  },

  heartBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 10,

    backgroundColor: "white",
    borderRadius: 999,
    padding: 4,
  },

  avatar: {
    width: "100%",
    height: 100,
    borderRadius: 16,
    marginBottom: 10,
  },

  name: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },

  badge: {
    marginTop: 4,
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: "#F3E8FF",
  },

  badgeText: {
    fontSize: 11,
    color: "#7C3AED",
    fontWeight: "600",
  },

  bottomRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  rating: {
    flexDirection: "row",
    alignItems: "center",
  },

  ratingText: {
    marginLeft: 3,
    fontSize: 12,
    fontWeight: "600",
    color: "#111827",
  },

  price: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
  },
});
