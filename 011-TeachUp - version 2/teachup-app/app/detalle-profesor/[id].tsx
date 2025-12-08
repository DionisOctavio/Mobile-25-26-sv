import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import YoutubePlayer from "react-native-youtube-iframe";
import { API } from "../../api/api";
import { useFavorites } from "../../hooks/useFavorites";
import { useAuth } from "../../contexts/AuthContext";
import { PERMISSIONS } from "../../constants/permissions";

/* ============================================================
      EXTRAER ID DE YOUTUBE
============================================================ */
function getYoutubeId(url) {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([^?&]+)/
  );
  return match ? match[1] : null;
}

export default function DetalleProfesor() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const { isFavorite, toggleFavorite } = useFavorites();
  const { can, currentUser } = useAuth();
  const [profesor, setProfesor] = useState(null);
  const [loading, setLoading] = useState(true);

  // ⭐ TAB por defecto → SOBRE MÍ
  const [tab, setTab] = useState("sobre");

  // 🐛 DEBUG - Verificar permisos
  useEffect(() => {
    console.log('🔍 DetalleProfesor - Estado de permisos:');
    console.log('   Usuario actual:', currentUser?.nombre);
    console.log('   Rol:', currentUser?.rol?.nombre);
    console.log('   Permisos:', currentUser?.permissions);
    console.log('   can(ITEM_EDIT):', can(PERMISSIONS.ITEM_EDIT));
    console.log('   can(ITEM_DEACTIVATE):', can(PERMISSIONS.ITEM_DEACTIVATE));
  }, [currentUser]);


  /* =======================================================
        CARGA + OCULTAR NAV
  ======================================================= */
  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get(`/profesores/${id}`);
        setProfesor(res.data);
      } catch (err) {
        console.log("❌ Error cargando profesor:", err.message);
        // Podrías mostrar un mensaje al usuario aquí
      } finally {
        setLoading(false);
      }
    };

    load();

    global.hideBottomNav?.();
    global.hideFloatingButton?.();

    return () => {
      global.showBottomNav?.();
      global.showFloatingButton?.();
    };
  }, []);

  /* =======================================================
        DESACTIVAR PROFESOR (ADMIN)
  ======================================================= */
  const handleDeactivate = () => {
    Alert.alert(
      'Desactivar Profesor',
      '¿Estás seguro de que quieres desactivar este profesor?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Desactivar',
          style: 'destructive',
          onPress: async () => {
            try {
              await API.patch(`/profesores/${id}`, { activo: false });
              Alert.alert('Éxito', 'Profesor desactivado', [
                { text: 'OK', onPress: () => router.back() },
              ]);
            } catch (error) {
              console.log('Error:', error.message);
              Alert.alert('Error', 'No se pudo desactivar el profesor. Verifica que el backend esté corriendo.');
            }
          },
        },
      ]
    );
  };

  /* =======================================================
        LOADING
  ======================================================= */
  if (loading || !profesor) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#FF2D8D" />
      </View>
    );
  }

  /* =======================================================
        IMAGEN SEGURA
  ======================================================= */
  const imageUri =
    profesor?.thumbnailUrlPublica ||
    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

  const videoId = getYoutubeId(profesor.video_presentacion_url);

  return (
    <View style={{ flex: 1, backgroundColor: "#F8F8FF" }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 200 }}
      >
        {/* 🔙 VOLVER */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#333" />
        </TouchableOpacity>

        {/* ❤️ FAVORITO */}
        <TouchableOpacity
          style={styles.favoriteBtn}
          onPress={() => toggleFavorite(profesor.id)}
        >
          <Ionicons
            name={isFavorite(profesor.id) ? "heart" : "heart-outline"}
            size={28}
            color="#FF2D8D"
          />
        </TouchableOpacity>

        {/* 🛠️ BOTONES ADMIN (EDITAR Y DESACTIVAR) */}
        {can(PERMISSIONS.ITEM_EDIT) && (
          <TouchableOpacity
            style={[styles.adminBtn, { right: 70 }]}
            onPress={() => router.push(`/edit-profesor?id=${profesor.id}`)}
          >
            <Ionicons name="create-outline" size={24} color="#6366F1" />
          </TouchableOpacity>
        )}

        {can(PERMISSIONS.ITEM_DEACTIVATE) && (
          <TouchableOpacity
            style={[styles.adminBtn, { right: 120 }]}
            onPress={handleDeactivate}
          >
            <Ionicons name="trash-outline" size={24} color="#EF4444" />
          </TouchableOpacity>
        )}

        {/* 🖼 HERO */}
        <Image source={{ uri: imageUri }} style={styles.heroImage} />

        {/* 🧊 TARJETA PRINCIPAL */}
        <View style={styles.card}>
          <Text style={styles.name}>
            {profesor.nombre} {profesor.apellido}
          </Text>

          <View style={styles.badge}>
            <Text style={styles.badgeText}>{profesor.categoria}</Text>
          </View>

          <Text style={styles.desc}>{profesor.descripcion}</Text>

          {/* ⭐ MÉTRICAS */}
          <View style={styles.metricsRow}>
            <Metric number={profesor.experiencia_anios || 0} label="Años exp." />
            <Metric number={profesor.valoracion || 0} label="Valoración" />
            <Metric number={profesor.precio_hora} label="€/hora" />
          </View>

          {/* ⭐ RATING */}
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={22} color="#FFC107" />
            <Text style={styles.ratingNum}>{profesor.valoracion || 0}.0</Text>
          </View>

          {/* 🧭 TABS */}
          <View style={styles.tabs}>
            <TabButton
              label="Lecciones"
              active={tab === "lecciones"}
              onPress={() => setTab("lecciones")}
            />
            <TabButton
              label="Reseñas"
              active={tab === "resenas"}
              onPress={() => setTab("resenas")}
            />
            <TabButton
              label="Sobre mí"
              active={tab === "sobre"}
              onPress={() => setTab("sobre")}
            />
          </View>

          {/* =====================================================
                TAB LECCIONES
          ====================================================== */}
          {tab === "lecciones" && (
            <View style={styles.tabContent}>
              {videoId ? (
                <>
                  <YoutubePlayer height={220} play={false} videoId={videoId} />
                  <Text style={styles.videoCaption}>
                    Vídeo de presentación
                  </Text>
                </>
              ) : (
                <Text style={styles.noVideoText}>
                  Este perfil no tiene vídeo de presentación, pero seguro que
                  está encantado de conocerte en persona.
                </Text>
              )}
            </View>
          )}

          {/* =====================================================
                TAB RESEÑAS
          ====================================================== */}
          {tab === "resenas" && (
            <View style={styles.tabContent}>
              <Text style={styles.placeholder}>Aún no hay reseñas.</Text>
            </View>
          )}

          {/* =====================================================
                TAB SOBRE MÍ
          ====================================================== */}
          {tab === "sobre" && (
            <View style={styles.tabContent}>
              <InfoRow label="Ubicación" value={profesor.ubicacion} />
              <InfoRow label="Modalidad" value={profesor.modalidad} />
              <InfoRow label="Disponibilidad" value={profesor.disponibilidad} />
              <InfoRow label="Idiomas" value={profesor.idiomas} />
              <InfoRow label="Habilidades" value={profesor.habilidades} />
              <InfoRow label="Email" value={profesor.email} />
              <InfoRow label="Teléfono" value={profesor.telefono} />
            </View>
          )}
        </View>
      </ScrollView>

      {/* 🟣 FOOTER */}
      <View style={styles.footer}>
        <Text style={styles.footerPrice}>{profesor.precio_hora}€/hora</Text>

        <TouchableOpacity style={styles.reserveBtn}>
          <Text style={styles.reserveText}>Reservar clase</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* =======================================================
      COMPONENTES REUTILIZABLES
======================================================= */

function Metric({ number, label }) {
  return (
    <View style={styles.metricBlock}>
      <Text style={styles.metricNumber}>{number}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

function TabButton({ label, active, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.tabBtn, active && styles.tabBtnActive]}
    >
      <Text style={[styles.tabText, active && styles.tabTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function InfoRow({ label, value }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value || "—"}</Text>
    </View>
  );
}

/* =======================================================
      ESTILOS
======================================================= */

const styles = StyleSheet.create({
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },

  heroImage: { width: "100%", height: 330 },

  backBtn: {
    position: "absolute",
    top: 45,
    left: 20,
    zIndex: 100,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 30,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  favoriteBtn: {
    position: "absolute",
    top: 45,
    right: 20,
    zIndex: 100,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 30,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  adminBtn: {
    position: "absolute",
    top: 45,
    zIndex: 100,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 30,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  card: {
    marginTop: -40,
    marginHorizontal: 20,
    backgroundColor: "#fff",
    padding: 22,
    borderRadius: 34,
    elevation: 10,
  },

  name: { fontSize: 28, fontWeight: "900", color: "#1A1A2E" },

  desc: { marginTop: 6, fontSize: 15, color: "#444", lineHeight: 20 },

  badge: {
    backgroundColor: "#E7D7FF",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },

  badgeText: { color: "#7D2AFF", fontWeight: "700" },

  metricsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },

  metricBlock: { alignItems: "center" },
  metricNumber: { fontSize: 18, fontWeight: "900", color: "#222" },
  metricLabel: { color: "#777", marginTop: 3 },

  ratingRow: { flexDirection: "row", alignItems: "center", marginTop: 14 },
  ratingNum: { fontSize: 18, fontWeight: "900", marginLeft: 6 },

  /* 🎬 VIDEO */
  videoCaption: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
  },

  noVideoText: {
    backgroundColor: "#FFE4EE",
    padding: 18,
    borderRadius: 14,
    textAlign: "center",
    color: "#C2185B",
    fontWeight: "600",
    marginBottom: 20,
  },

  /* TABS */
  tabs: {
    flexDirection: "row",
    marginTop: 30,
    backgroundColor: "#F0F0F5",
    borderRadius: 16,
  },

  tabBtn: { flex: 1, padding: 12, alignItems: "center" },
  tabBtnActive: { backgroundColor: "#FF2D8D", borderRadius: 16 },
  tabText: { fontWeight: "600", color: "#888" },
  tabTextActive: { color: "#fff" },

  tabContent: { marginTop: 20 },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
  },

  infoLabel: { fontWeight: "700", color: "#444" },
  infoValue: { color: "#777" },

  /* FOOTER */
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
    padding: 22,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    elevation: 20,
  },

  footerPrice: { fontSize: 20, fontWeight: "900", color: "#111" },

  reserveBtn: {
    backgroundColor: "#FF2D8D",
    paddingVertical: 14,
    paddingHorizontal: 26,
    borderRadius: 16,
  },

  reserveText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },
});
