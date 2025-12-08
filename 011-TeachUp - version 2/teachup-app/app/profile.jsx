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
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "expo-router";

export default function Profile() {
  const lastY = useRef(0);
  const { currentUser, logout } = useAuth();
  const router = useRouter();

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

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/role-selection');
          },
        },
      ]
    );
  };

  // DEBUG: Ver permisos actuales
  const showDebugInfo = () => {
    Alert.alert(
      'Debug Info',
      `Rol: ${currentUser?.role}\n\nPermisos:\n${currentUser?.permissions?.join('\n') || 'Sin permisos'}`,
      [{ text: 'OK' }]
    );
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'ADMIN':
        return '#EF4444';
      case 'PROFESOR':
        return '#10B981';
      case 'USER':
      default:
        return '#6366F1';
    }
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
            source={{ uri: currentUser?.avatar || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" }}
            style={styles.avatar}
          />

          <Text style={styles.name}>
            {currentUser?.nombre} {currentUser?.apellido}
          </Text>
          <Text style={styles.email}>{currentUser?.email}</Text>

          {/* Badge de Rol */}
          <View
            style={[
              styles.roleBadge,
              { backgroundColor: getRoleBadgeColor(currentUser?.role) },
            ]}
          >
            <Text style={styles.roleText}>{currentUser?.role || 'USER'}</Text>
          </View>
        </View>

        {/* 🔐 PERMISOS */}
        <View style={styles.permissionsCard}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={styles.cardTitle}>
              <Ionicons name="shield-checkmark" size={18} color="#6366F1" /> Permisos Activos
            </Text>
            <TouchableOpacity onPress={showDebugInfo}>
              <Ionicons name="information-circle" size={24} color="#6366F1" />
            </TouchableOpacity>
          </View>
          <View style={styles.permissionsList}>
            {currentUser?.permissions?.map((permission, index) => (
              <View key={index} style={styles.permissionChip}>
                <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                <Text style={styles.permissionText}>
                  {permission.replace(/_/g, ' ')}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* 📊 ESTADÍSTICAS */}
        <View style={styles.statsRow}>
          <StatCard number={12} label="Clases" />
          <StatCard number={5} label="Favoritos" />
          <StatCard number={0} label="Creados" />
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
          onPress={handleLogout}
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

function SettingItem({ icon, label, disabled, danger, onPress }) {
  return (
    <TouchableOpacity
      activeOpacity={disabled ? 1 : 0.7}
      style={styles.settingItem}
      onPress={onPress}
      disabled={disabled}
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
  roleBadge: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  roleText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFF',
  },

  /* 🔐 PERMISOS */
  permissionsCard: {
    marginTop: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 12,
  },
  permissionsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  permissionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  permissionText: {
    fontSize: 11,
    color: '#166534',
    fontWeight: '600',
    textTransform: 'capitalize',
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
