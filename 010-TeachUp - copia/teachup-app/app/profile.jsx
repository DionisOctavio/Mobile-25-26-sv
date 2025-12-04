import React, { useRef } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { user } from "../hooks/useUser";

export default function Profile() {
  const lastY = useRef(0);

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
        scrollEventThrottle={16}
        onScroll={handleScroll}
      >

        {/* ⭐ CABECERA / HERO */}
        <View style={styles.heroCard}>
          <Image
            source={{ uri: user.avatar || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" }}
            style={styles.avatar}
          />

          <Text style={styles.name}>
            {user.nombre} {user.apellido}
          </Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>

        {/* 📊 ESTADÍSTICAS */}
        <View style={styles.statsRow}>
          <StatCard number={12} label="Clases" />
          <StatCard number={5} label="Favoritos" />
          <StatCard number={0} label="Cursos creados" />
        </View>

        {/* ⚙️ SECCIÓN AJUSTES */}
        <Text style={styles.sectionTitle}>Cuenta</Text>
        <SettingItem icon="person-circle-outline" label="Editar perfil" disabled />
        <SettingItem icon="key-outline" label="Cambiar contraseña" disabled />
        <SettingItem icon="mail-outline" label="Notificaciones" disabled />

        <Text style={styles.sectionTitle}>Preferencias</Text>
        <SettingItem icon="moon-outline" label="Modo oscuro" disabled />
        <SettingItem icon="language-outline" label="Idioma" disabled />
        <SettingItem icon="shield-checkmark-outline" label="Privacidad" disabled />

        <Text style={styles.sectionTitle}>Información</Text>
        <SettingItem icon="help-circle-outline" label="Ayuda y soporte" disabled />
        <SettingItem icon="information-circle-outline" label="Sobre TeachUp" disabled />

        <SettingItem
          icon="log-out-outline"
          label="Cerrar sesión"
          danger
        />
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------------------------------------------- */
/* 🟣 COMPONENTES                                  */
/* ---------------------------------------------- */

function StatCard({ number, label }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statNumber}>{number}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function SettingItem({ icon, label, disabled, danger }) {
  return (
    <TouchableOpacity
      activeOpacity={disabled ? 1 : 0.7}
      style={styles.settingItem}
    >
      <Ionicons
        name={icon}
        size={22}
        color={danger ? "#EF4444" : "#1A1A2E"}
      />
      <Text
        style={[
          styles.settingLabel,
          danger && { color: "#EF4444" },
          disabled && { opacity: 0.5 },
        ]}
      >
        {label}
      </Text>

      <Ionicons
        name="chevron-forward"
        size={18}
        color="#9CA3AF"
        style={{ marginLeft: "auto" }}
      />
    </TouchableOpacity>
  );
}

/* ---------------------------------------------- */
/* 🎨 ESTILOS                                      */
/* ---------------------------------------------- */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F5F5FF",
  },

  container: {
    paddingHorizontal: 20,
    paddingBottom: 80,
  },

  /* ⭐ HERO */
  heroCard: {
    marginTop: 20,
    backgroundColor: "#EEF0FF",
    paddingVertical: 30,
    borderRadius: 26,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 12,
    backgroundColor: "#E5E7EB",
  },
  name: {
    fontSize: 26,
    fontWeight: "900",
    color: "#1A1A2E",
  },
  email: {
    marginTop: 4,
    fontSize: 14,
    color: "#6B7280",
  },

  /* 📊 STATS */
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 26,
  },
  statCard: {
    flex: 1,
    backgroundColor: "white",
    paddingVertical: 18,
    marginHorizontal: 6,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1A1A2E",
  },
  statLabel: {
    marginTop: 4,
    fontSize: 12,
    color: "#6B7280",
  },

  /* ⚙️ SETTINGS */
  sectionTitle: {
    marginTop: 34,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: "800",
    color: "#1A1A2E",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
  },
  settingLabel: {
    fontSize: 15,
    marginLeft: 12,
    color: "#1A1A2E",
  },
});
