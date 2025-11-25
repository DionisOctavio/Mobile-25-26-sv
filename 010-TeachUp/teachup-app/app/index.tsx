import React, { useEffect, useState, useRef } from "react";
import {
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { API } from "../api/api";
import TeacherCard from "../components/TeacherCard";
import HomeMiniTeacherCard from "../components/HomeMiniTeacherCard";
import { useFavorites } from "../hooks/useFavorites";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";

export default function Home() {
  const [profesores, setProfesores] = useState([]);
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorites();
  const lastY = useRef(0);

  useEffect(() => {
    API.get("/profesores").then((res) => {
      const list = [...res.data].sort(() => Math.random() - 0.5);
      setProfesores(list);
    });
  }, []);

  const recomendados = profesores.slice(0, 6);
  const destacado = recomendados[0] || null;
  const otrosRecomendados = recomendados.slice(1);

  const programacion = profesores.filter((p) => p.categoria === "Programación").slice(0, 6);
  const refuerzo = profesores.filter((p) => p.categoria === "Refuerzo").slice(0, 6);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
        scrollEventThrottle={16}
        onScroll={(e) => {
          const y = e.nativeEvent.contentOffset.y;

          // ⭐ Si estás arriba del todo, barra SIEMPRE visible
          if (y <= 5) {
            global.showBottomNav?.();
            lastY.current = y;
            return;
          }

          // Ocultar si bajas
          if (y > lastY.current + 2) global.hideBottomNav?.();

          // Mostrar si subes
          else if (y < lastY.current - 2) global.showBottomNav?.();

          lastY.current = y;
        }}
      >
        {/* HERO */}
        <View style={styles.hero}>
          <View style={{ flex: 1 }}>
            <Text style={styles.heroHello}>¡Hola, Octavio! 👋</Text>
            <Text style={styles.heroTitle}>Explora. Aprende. Mejora.</Text>
            <Text style={styles.heroSubtitle}>
              Encuentra profes expertos listos para ayudarte hoy mismo.
            </Text>
          </View>

          <View style={styles.heroAvatar}>
            <Text style={styles.heroAvatarText}>TU</Text>
          </View>
        </View>

        {/* DESTACADO */}
        {destacado && (
          <View style={{ marginTop: 30 }}>
            <Text style={styles.sectionTitle}>Profesor destacado</Text>

            <TeacherCard
              profesor={destacado}
              isFavorite={isFavorite(destacado.id)}
              onToggleFavorite={() => toggleFavorite(destacado.id)}
            />
          </View>
        )}

        {/* RECOMENDADOS */}
        {otrosRecomendados.length > 0 && (
          <View style={{ marginTop: 22 }}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recomendados para ti</Text>

              <TouchableOpacity onPress={() => router.push("/search")}>
                <Text style={styles.moreLink}>Ver todos →</Text>
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {otrosRecomendados.map((p) => (
                <HomeMiniTeacherCard
                  key={p.id}
                  profesor={p}
                  isFavorite={isFavorite(p.id)}
                  onToggleFavorite={() => toggleFavorite(p.id)}
                  onPress={() => router.push(`/detalle-profesor/${p.id}`)}
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* PROGRAMACIÓN */}
        {programacion.length > 0 && (
          <View style={{ marginTop: 24 }}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Programación</Text>

              <TouchableOpacity
                onPress={() => router.push("/search?cat=Programación")}
              >
                <Text style={styles.moreLink}>Ver más</Text>
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {programacion.map((p) => (
                <HomeMiniTeacherCard
                  key={p.id}
                  profesor={p}
                  isFavorite={isFavorite(p.id)}
                  onToggleFavorite={() => toggleFavorite(p.id)}
                  onPress={() => router.push(`/detalle-profesor/${p.id}`)}
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* REFUERZO */}
        {refuerzo.length > 0 && (
          <View style={{ marginTop: 24, marginBottom: 50 }}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Refuerzo académico</Text>

              <TouchableOpacity onPress={() => router.push("/search?cat=Refuerzo")}>
                <Text style={styles.moreLink}>Ver más</Text>
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {refuerzo.map((p) => (
                <HomeMiniTeacherCard
                  key={p.id}
                  profesor={p}
                  isFavorite={isFavorite(p.id)}
                  onToggleFavorite={() => toggleFavorite(p.id)}
                  onPress={() => router.push(`/detalle-profesor/${p.id}`)}
                />
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F5F5FF",
  },
  container: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },

  hero: {
    marginTop: 16,
    padding: 20,
    borderRadius: 26,
    backgroundColor: "#EEF0FF",
    flexDirection: "row",
    alignItems: "center",
  },
  heroHello: {
    fontSize: 16,
    color: "#6B7280",
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: "#111827",
    marginTop: 4,
  },
  heroSubtitle: {
    marginTop: 6,
    fontSize: 13,
    color: "#6B7280",
  },
  heroAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FF4B8A",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 14,
  },
  heroAvatarText: {
    color: "white",
    fontWeight: "800",
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
    sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#111827",
    marginTop: 22,
    marginBottom: 12,   // ← añade este margen extra
  },
  moreLink: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6D28D9",
  },
});
