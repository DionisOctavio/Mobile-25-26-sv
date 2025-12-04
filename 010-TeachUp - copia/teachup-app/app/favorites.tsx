import React, { useRef } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  StyleSheet,
  View,
  Image,
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { useFavorites } from "../hooks/useFavorites";
import TeacherCard from "../components/TeacherCard";
import Ionicons from "@expo/vector-icons/Ionicons";

/* ----------------------------------------- */
/* TIPADO DEL PROFESOR                       */
/* ----------------------------------------- */
export interface Profesor {
  id: number;
  nombre: string;
  categoria?: string;
  descripcion?: string;
  precio_hora?: number;
  experiencia?: number;

  thumbnailUrlPublica?: string;
  foto?: string;
  foto_url?: string;
  avatar?: string;
  imagen?: string;
  profileImage?: string;
}

/* ----------------------------------------- */
/* NORMALIZADOR → Respeta la URL del backend */
/* ----------------------------------------- */
function normalizeTeacherImage(p: Profesor): Profesor {
  if (p.thumbnailUrlPublica) return p;

  const fallback =
    p.foto ||
    p.foto_url ||
    p.avatar ||
    p.imagen ||
    p.profileImage ||
    "";

  return {
    ...p,
    thumbnailUrlPublica: fallback,
  };
}

/* ----------------------------------------- */
/* FAVORITES PAGE                            */
/* ----------------------------------------- */
export default function Favorites() {
  const { getFavoriteTeachers, isFavorite, toggleFavorite } = useFavorites();
  const favTeachers: Profesor[] = getFavoriteTeachers();

  const lastY = useRef<number>(0);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;

    if (y <= 5) {
      global.showBottomNav?.();
      lastY.current = y;
      return;
    }
    if (y > lastY.current + 2) global.hideBottomNav?.();
    else if (y < lastY.current - 2) global.showBottomNav?.();

    lastY.current = y;
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* ⭐ CABECERA PREMIUM */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Ionicons name="heart" size={30} color="#FF4B8A" />
            <Text style={styles.headerTitle}>Favoritos</Text>
          </View>

          <Text style={styles.headerSubtitle}>
            Tus profesores guardados con ❤️
          </Text>
        </View>

        {/* 💙 ESTADO VACÍO */}
        {favTeachers.length === 0 && (
          <View style={styles.emptyContainer}>
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/512/4076/4076505.png",
              }}
              style={styles.emptyImage}
            />
            <Text style={styles.emptyTitle}>No tienes favoritos aún</Text>
            <Text style={styles.emptySubtitle}>
              Guarda profesores con ❤️ y aparecerán aquí.
            </Text>
          </View>
        )}

        {/* ❤️ LISTA DE FAVORITOS */}
        <View style={styles.listContainer}>
          {favTeachers.map((p) => {
            const normalized = normalizeTeacherImage(p);

            return (
              <Animated.View
                key={p.id}
                style={{
                  marginBottom: 20,
                }}
              >
                <TeacherCard
                  profesor={normalized}
                  isFavorite={isFavorite(p.id)}
                  onToggleFavorite={() => toggleFavorite(p.id)}
                />
              </Animated.View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ----------------------------------------- */
/* ESTILOS                                   */
/* ----------------------------------------- */
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F5F5FF",
  },

  container: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 140,
  },

  /* ⭐ CABECERA */
  header: {
    marginTop: 10,
    marginBottom: 25,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    marginLeft: 10,
    fontSize: 30,
    fontWeight: "900",
    color: "#1A1A2E",
  },
  headerSubtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 2,
  },

  /* 📌 LISTA */
  listContainer: {
    marginTop: 10,
  },

  /* 💙 ESTADO VACÍO */
  emptyContainer: {
    alignItems: "center",
    marginTop: 60,
  },
  emptyImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
    opacity: 0.9,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1A1A2E",
  },
  emptySubtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    maxWidth: 260,
    lineHeight: 18,
  },
});
