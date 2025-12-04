import React, { useEffect, useRef } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter, usePathname } from "expo-router";
import { BlurView } from "expo-blur";

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  // ⭐ Animaciones globales
  useEffect(() => {
    global.showBottomNav = () =>
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

    global.hideBottomNav = () =>
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 90,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
  }, []);

  const isActive = (route) => pathname === route;

  const Tab = ({ icon, label, route }) => (
    <TouchableOpacity style={styles.tab} onPress={() => router.push(route)}>
      <Ionicons
        name={icon}
        size={23}
        color={isActive(route) ? "#1F2937" : "#6B7280"}
      />
      <Text style={[styles.label, isActive(route) && styles.labelActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <BlurView intensity={50} tint="light" style={styles.blur} />

      <View style={styles.tabsRow}>
        <Tab icon="home-outline" label="Inicio" route="/" />
        <Tab icon="search-outline" label="Buscar" route="/search" />

        {/* 🔥 BOTÓN CENTRAL ESTILO TIKTOK */}
        <TouchableOpacity
          style={styles.centerButton}
          onPress={() => router.push("/add-profesor")}
        >
          <Ionicons name="add" size={30} color="#FFF" />
        </TouchableOpacity>

        <Tab icon="heart-outline" label="Favoritos" route="/favorites" />
        <Tab icon="person-outline" label="Perfil" route="/profile" />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 85,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    overflow: "hidden",
    justifyContent: "center",
  },

  blur: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.8)", // más sólido
  },

  tabsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingTop: 10,
  },

  tab: {
    alignItems: "center",
    justifyContent: "center",
    width: 60,
  },

  label: {
    fontSize: 11,
    marginTop: 3,
    color: "#6B7280",
  },

  labelActive: {
    color: "#1F2937",
    fontWeight: "700",
  },

  /* 🔥 BOTÓN CENTRAL ESTILO TIKTOK */
  centerButton: {
    width: 70,
    height: 40,
    backgroundColor: "#FF4B8A",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -10, // pequeño efecto flotante
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
});
