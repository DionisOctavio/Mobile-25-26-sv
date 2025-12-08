import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function TeacherCard({ profesor, isFavorite, onToggleFavorite }) {
  const router = useRouter();

  const imageUri =
    profesor.thumbnailUrlPublica ||
    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";


  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => router.push(`/detalle-profesor/${profesor.id}`)}
    >
      <LinearGradient
        colors={["#FDE7FF", "#E5EEFF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        {/* ❤️ FAVORITO */}
        <TouchableOpacity
          style={styles.heartButton}
          onPress={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
        >
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={22}
            color="#FF4F7D"
          />
        </TouchableOpacity>

        {/* CONTENIDO */}
        <View style={styles.row}>

          {/* FOTO */}
          <View style={styles.avatarWrapper}>
            <Image source={{ uri: imageUri }} style={styles.avatar} />
          </View>

          {/* INFO */}
          <View style={{ flex: 1, marginLeft: 16 }}>

            {/* BADGE */}
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{profesor.categoria}</Text>
            </View>

            {/* NOMBRE */}
            <Text style={styles.name}>
              {profesor.nombre} {profesor.apellido}
            </Text>

            {/* DESCRIPCIÓN / TÍTULO */}
            {profesor.descripcion ? (
              <Text numberOfLines={2} style={styles.description}>
                {profesor.descripcion}
              </Text>
            ) : profesor.titulo_curso ? (
              <Text numberOfLines={2} style={styles.description}>
                {profesor.titulo_curso}
              </Text>
            ) : null}

            {/* RATING / ESTUDIANTES */}
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={16} color="#FFC107" />
              <Text style={styles.ratingText}>{profesor.valoracion || 0}.0</Text>
              <Text style={styles.studentsText}>
                {profesor.experiencia_anios
                  ? `${profesor.experiencia_anios} años exp.`
                  : ""}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 28,
    padding: 20,
    marginBottom: 26,
    shadowColor: "#000",
    shadowOpacity: 0.10,
    shadowRadius: 25,
    elevation: 6,
    minHeight: 150,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatarWrapper: {
    width: 78,
    height: 78,
    borderRadius: 26,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },

  avatar: {
    width: 70,
    height: 70,
    borderRadius: 22,
  },

  heartButton: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 100,
    shadowColor: "#FF4F7D",
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 10,
  },

  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 5,
    backgroundColor: "#F2D7FF",
    borderRadius: 18,
    marginBottom: 8,
  },

  badgeText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#7A37FF",
  },

  name: {
    fontSize: 19,
    fontWeight: "800",
    color: "#1A1A2E",
    marginBottom: 4,
  },

  description: {
    fontSize: 14,
    color: "#3D3D3D",
    opacity: 0.85,
    lineHeight: 18,
    marginBottom: 8,
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    color: "#1A1A2E",
    fontWeight: "700",
  },

  studentsText: {
    marginLeft: 12,
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
  },
});
