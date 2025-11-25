import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { API } from "../api/api";
import { useFavorites } from "../hooks/useFavorites";
import { useRouter } from "expo-router";
import MiniTeacherCard from "../components/MiniTeacherCard";

export default function Search() {
  const [profesores, setProfesores] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  // FILTROS
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [modalidad, setModalidad] = useState("Todas");
  const [orderBy, setOrderBy] = useState("none");

  const slide = useRef(new Animated.Value(0)).current;

  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorites();
  const lastY = useRef(0);

  /*--------------- LOAD DATA ---------------*/
  useEffect(() => {
    API.get("/profesores").then((res) => setProfesores(res.data));
  }, []);

  /*--------------- BOTTOM SHEET ANIMATIONS ---------------*/
  const openFilters = () => {
    global.hideBottomNav?.();       // 👈 oculta navbar
    setFiltersOpen(true);
    Animated.timing(slide, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
    }).start();
  };

  const closeFilters = () => {
    Animated.timing(slide, {
      toValue: 0,
      duration: 220,
      useNativeDriver: true,
    }).start(() => {
      setFiltersOpen(false);
      global.showBottomNav?.();    // 👈 vuelve a mostrar navbar
    });
  };

  /*--------------- DYNAMIC CATEGORY LIST ---------------*/
  const categorias = useMemo(
    () => ["Todos", ...Array.from(new Set(profesores.map((p) => p.categoria)))],
    [profesores]
  );

  const modalidadesDisponibles = useMemo(() => {
    const setMod = new Set(profesores.map((p) => p.modalidad).filter(Boolean));
    return ["Todas", ...Array.from(setMod)];
  }, [profesores]);

  /*--------------- FILTERING ---------------*/
  const filtered = useMemo(() => {
    let list = [...profesores];

    const q = query.toLowerCase();
    if (q.trim()) {
      list = list.filter(
        (p) =>
          p.nombre.toLowerCase().includes(q) ||
          (p.descripcion || "").toLowerCase().includes(q) ||
          (p.categoria || "").toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== "Todos") {
      list = list.filter((p) => p.categoria === selectedCategory);
    }

    if (modalidad !== "Todas") {
      list = list.filter((p) => p.modalidad === modalidad);
    }

    switch (orderBy) {
      case "precio_asc":
        list.sort((a, b) => a.precio_hora - b.precio_hora);
        break;
      case "precio_desc":
        list.sort((a, b) => b.precio_hora - a.precio_hora);
        break;
      case "name_asc":
        list.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case "name_desc":
        list.sort((a, b) => b.nombre.localeCompare(a.nombre));
        break;
    }

    return list;
  }, [profesores, query, selectedCategory, modalidad, orderBy]);

  /* ICONOS */
  function getIconForCategory(cat) {
    switch (cat) {
      case "Inglés":
        return "language-outline";
      case "Programación":
        return "terminal-outline";
      case "Matemáticas":
        return "stats-chart-outline";
      case "Lengua":
        return "create-outline";
      case "Refuerzo":
        return "people-outline";
      default:
        return "ellipse-outline";
    }
  }

  return (
    <View style={styles.safe}>
      {/* ================================================= */}
      {/* ============== OVERLAY + BOTTOM SHEET ============ */}
      {/* ================================================= */}
      {filtersOpen && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={closeFilters}
        />
      )}

      {filtersOpen && (
        <Animated.View
          style={[
            styles.sheet,
            {
              transform: [
                {
                  translateY: slide.interpolate({
                    inputRange: [0, 1],
                    outputRange: [400, 0],
                  }),
                },
              ],
              zIndex: 400,
            },
          ]}
        >
          <Text style={styles.sheetTitle}>Filtros</Text>

          <Text style={styles.sheetSubtitle}>Ordenar por</Text>
          <View style={styles.rowChips}>
            {[
              { id: "precio_asc", label: "Precio ↑" },
              { id: "precio_desc", label: "Precio ↓" },
              { id: "name_asc", label: "A → Z" },
              { id: "name_desc", label: "Z → A" },
            ].map((opt) => (
              <TouchableOpacity
                key={opt.id}
                style={[
                  styles.chip,
                  orderBy === opt.id && styles.chipActive,
                ]}
                onPress={() => setOrderBy(opt.id)}
              >
                <Text
                  style={[
                    styles.chipText,
                    orderBy === opt.id && styles.chipTextActive,
                  ]}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sheetSubtitle}>Modalidad</Text>
          <View style={styles.rowChips}>
            {modalidadesDisponibles.map((m) => (
              <TouchableOpacity
                key={m}
                style={[
                  styles.chip,
                  modalidad === m && styles.chipActive,
                ]}
                onPress={() => setModalidad(m)}
              >
                <Text
                  style={[
                    styles.chipText,
                    modalidad === m && styles.chipTextActive,
                  ]}
                >
                  {m}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.applyBtn} onPress={closeFilters}>
            <Text style={styles.applyText}>Aplicar filtros</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setQuery("");
              setModalidad("Todas");
              setOrderBy("none");
              setSelectedCategory("Todos");
            }}
          >
            <Text style={styles.resetText}>Restablecer filtros</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* ================================================= */}
      {/* ============== MAIN CONTENT ===================== */}
      {/* ================================================= */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {/* TITLE */}
        <Text style={styles.title}>Encuentra tu profesor ideal</Text>

        {/* SEARCH + FILTER */}
        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={20} color="#9CA3AF" />
            <TextInput
              placeholder="Buscar..."
              placeholderTextColor="#9CA3AF"
              style={styles.searchInput}
              value={query}
              onChangeText={setQuery}
            />
          </View>

          <TouchableOpacity style={styles.filterButton} onPress={openFilters}>
            <Ionicons name="filter-outline" size={22} color="#1A1A2E" />
          </TouchableOpacity>
        </View>

        {/* CATEGORY CIRCLES */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
        >
          {categorias.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.catCircleWrapper,
                selectedCategory === cat && styles.catCircleWrapperActive,
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <View
                style={[
                  styles.catCircle,
                  selectedCategory === cat && styles.catCircleActive,
                ]}
              >
                <Ionicons
                  name={getIconForCategory(cat)}
                  size={20}
                  color={selectedCategory === cat ? "#fff" : "#1A1A2E"}
                />
              </View>
              <Text
                style={[
                  styles.catLabel,
                  selectedCategory === cat && styles.catLabelActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* GRID */}
        <View style={styles.grid}>
          {filtered.map((p) => (
            <MiniTeacherCard
              key={p.id}
              profesor={p}
              isFavorite={isFavorite(p.id)}
              onToggleFavorite={() => toggleFavorite(p.id)}
              onPress={() => router.push(`/detalle-profesor/${p.id}`)}
            />
          ))}
        </View>

        {filtered.length === 0 && (
          <Text style={styles.empty}>No se encontraron resultados 😔</Text>
        )}
      </ScrollView>
    </View>
  );
}

/* ================================================= */
/* ===================== ESTILOS =================== */
/* ================================================= */
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F5F5FF",
  },
  container: {
    paddingHorizontal: 18,
    paddingBottom: 150,
  },

  /* TITLE */
  title: {
    marginTop: 22,
    fontSize: 26,
    fontWeight: "900",
    color: "#111827",
  },

  /* SEARCH ROW */
  searchRow: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  searchInput: {
    marginLeft: 10,
    fontSize: 15,
    flex: 1,
  },
  filterButton: {
    marginLeft: 10,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 14,
    elevation: 2,
  },

  /* CATEGORY CIRCLES */
  categoryScroll: {
    marginTop: 18,
    marginBottom: 16,
    paddingVertical: 12,
  },
  catCircleWrapper: {
    alignItems: "center",
    marginRight: 14,
    width: 60,
  },
  catCircleWrapperActive: {
    transform: [{ scale: 1.05 }],
  },
  catCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  catCircleActive: {
    backgroundColor: "#1A1A2E",
  },
  catLabel: {
    marginTop: 6,
    fontSize: 10,
    color: "#6B7280",
    textAlign: "center",
  },
  catLabelActive: {
    fontWeight: "700",
    color: "#1A1A2E",
  },

  /* GRID */
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 16,
  },

  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#6B7280",
  },

  /* OVERLAY */
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.25)",
    zIndex: 100,
  },

  /* BOTTOM SHEET */
  sheet: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
    padding: 22,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    zIndex: 500,
    elevation: 50,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 12,
  },
  sheetSubtitle: {
    marginTop: 10,
    fontWeight: "700",
    color: "#1A1A2E",
    marginBottom: 6,
  },

  rowChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 999,
  },
  chipActive: {
    backgroundColor: "#1A1A2E",
  },
  chipText: {
    fontSize: 12,
    color: "#111",
  },
  chipTextActive: {
    color: "#fff",
    fontWeight: "700",
  },

  applyBtn: {
    backgroundColor: "#6D28D9",
    paddingVertical: 12,
    marginTop: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  applyText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  resetText: {
    marginTop: 12,
    textAlign: "center",
    fontWeight: "600",
    color: "#6B7280",
  },
});
