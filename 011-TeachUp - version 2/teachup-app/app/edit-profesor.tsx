import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { API } from "../api/api";
import { useAuth } from "../contexts/AuthContext";
import { PERMISSIONS } from "../constants/permissions";

export default function EditProfesor() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { can } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Campos del formulario
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    titulo_curso: "",
    descripcion: "",
    categoria: "",
    precio_hora: "",
    telefono: "",
    email: "",
    experiencia_anios: "",
    estudios: "",
    modalidad: "",
    ubicacion: "",
    disponibilidad: "",
    idiomas: "",
    habilidades: "",
    imagen_url: "",
    video_presentacion_url: "",
  });

  // Verificar permisos
  useEffect(() => {
    if (!can(PERMISSIONS.ITEM_EDIT)) {
      Alert.alert("Sin permisos", "No tienes permiso para editar profesores");
      router.back();
    }
  }, []);

  // Cargar datos del profesor
  useEffect(() => {
    const loadProfesor = async () => {
      try {
        const res = await API.get(`/profesores/${id}`);
        const profesor = res.data;

        setForm({
          nombre: profesor.nombre || "",
          apellido: profesor.apellido || "",
          titulo_curso: profesor.titulo_curso || "",
          descripcion: profesor.descripcion || "",
          categoria: profesor.categoria || "",
          precio_hora: profesor.precio_hora?.toString() || "",
          telefono: profesor.telefono || "",
          email: profesor.email || "",
          experiencia_anios: profesor.experiencia_anios?.toString() || "",
          estudios: profesor.estudios || "",
          modalidad: profesor.modalidad || "",
          ubicacion: profesor.ubicacion || "",
          disponibilidad: profesor.disponibilidad || "",
          idiomas: profesor.idiomas || "",
          habilidades: profesor.habilidades || "",
          imagen_url: profesor.imagen_url || "",
          video_presentacion_url: profesor.video_presentacion_url || "",
        });
      } catch (err) {
        console.log("❌ Error cargando profesor:", err.message);
        Alert.alert("Error", "No se pudo cargar el profesor");
        router.back();
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProfesor();
    }
  }, [id]);

  // Guardar cambios
  const handleSave = async () => {
    // Validaciones básicas
    if (!form.nombre.trim() || !form.titulo_curso.trim() || !form.categoria.trim()) {
      Alert.alert("Campos requeridos", "Nombre, Título del curso y Categoría son obligatorios");
      return;
    }

    setSaving(true);

    try {
      // Preparar datos (convertir strings a números donde corresponda)
      const data = {
        ...form,
        precio_hora: form.precio_hora ? parseFloat(form.precio_hora) : null,
        experiencia_anios: form.experiencia_anios ? parseInt(form.experiencia_anios) : null,
      };

      await API.patch(`/profesores/${id}`, data);

      Alert.alert("¡Éxito!", "Profesor actualizado correctamente", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (err) {
      console.log("❌ Error guardando profesor:", err.message);
      Alert.alert("Error", "No se pudo guardar los cambios");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#FF2D8D" />
        <Text style={styles.loadingText}>Cargando datos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Profesor</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Información Personal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Información Personal</Text>

          <Text style={styles.label}>Nombre *</Text>
          <TextInput
            style={styles.input}
            value={form.nombre}
            onChangeText={(text) => setForm({ ...form, nombre: text })}
            placeholder="Nombre del profesor"
          />

          <Text style={styles.label}>Apellido</Text>
          <TextInput
            style={styles.input}
            value={form.apellido}
            onChangeText={(text) => setForm({ ...form, apellido: text })}
            placeholder="Apellido del profesor"
          />

          <Text style={styles.label}>Teléfono</Text>
          <TextInput
            style={styles.input}
            value={form.telefono}
            onChangeText={(text) => setForm({ ...form, telefono: text })}
            placeholder="+34 600 000 000"
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={form.email}
            onChangeText={(text) => setForm({ ...form, email: text })}
            placeholder="email@ejemplo.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Información Profesional */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💼 Información Profesional</Text>

          <Text style={styles.label}>Título del Curso *</Text>
          <TextInput
            style={styles.input}
            value={form.titulo_curso}
            onChangeText={(text) => setForm({ ...form, titulo_curso: text })}
            placeholder="Ej: Matemáticas Avanzadas"
          />

          <Text style={styles.label}>Categoría *</Text>
          <TextInput
            style={styles.input}
            value={form.categoria}
            onChangeText={(text) => setForm({ ...form, categoria: text })}
            placeholder="Ej: Matemáticas, Inglés, Programación..."
          />

          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={form.descripcion}
            onChangeText={(text) => setForm({ ...form, descripcion: text })}
            placeholder="Describe tu experiencia y enfoque educativo..."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <Text style={styles.label}>Años de Experiencia</Text>
          <TextInput
            style={styles.input}
            value={form.experiencia_anios}
            onChangeText={(text) => setForm({ ...form, experiencia_anios: text })}
            placeholder="5"
            keyboardType="numeric"
          />

          <Text style={styles.label}>Estudios</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={form.estudios}
            onChangeText={(text) => setForm({ ...form, estudios: text })}
            placeholder="Licenciatura, Máster, Certificaciones..."
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* Clases */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💰 Información de Clases</Text>

          <Text style={styles.label}>Precio por Hora (€)</Text>
          <TextInput
            style={styles.input}
            value={form.precio_hora}
            onChangeText={(text) => setForm({ ...form, precio_hora: text })}
            placeholder="25"
            keyboardType="decimal-pad"
          />

          <Text style={styles.label}>Modalidad</Text>
          <TextInput
            style={styles.input}
            value={form.modalidad}
            onChangeText={(text) => setForm({ ...form, modalidad: text })}
            placeholder="online / presencial / mixto"
          />

          <Text style={styles.label}>Ubicación</Text>
          <TextInput
            style={styles.input}
            value={form.ubicacion}
            onChangeText={(text) => setForm({ ...form, ubicacion: text })}
            placeholder="Madrid, Barcelona..."
          />

          <Text style={styles.label}>Disponibilidad</Text>
          <TextInput
            style={styles.input}
            value={form.disponibilidad}
            onChangeText={(text) => setForm({ ...form, disponibilidad: text })}
            placeholder="Lunes a Viernes, 10:00-18:00"
          />
        </View>

        {/* Habilidades e Idiomas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🌐 Habilidades e Idiomas</Text>

          <Text style={styles.label}>Idiomas</Text>
          <TextInput
            style={styles.input}
            value={form.idiomas}
            onChangeText={(text) => setForm({ ...form, idiomas: text })}
            placeholder="Español, Inglés, Francés..."
          />

          <Text style={styles.label}>Habilidades</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={form.habilidades}
            onChangeText={(text) => setForm({ ...form, habilidades: text })}
            placeholder="Paciencia, Comunicación, Creatividad..."
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* Multimedia */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎬 Multimedia</Text>

          <Text style={styles.label}>URL Imagen</Text>
          <TextInput
            style={styles.input}
            value={form.imagen_url}
            onChangeText={(text) => setForm({ ...form, imagen_url: text })}
            placeholder="https://ejemplo.com/imagen.jpg"
            autoCapitalize="none"
          />

          <Text style={styles.label}>URL Video de Presentación</Text>
          <TextInput
            style={styles.input}
            value={form.video_presentacion_url}
            onChangeText={(text) => setForm({ ...form, video_presentacion_url: text })}
            placeholder="https://youtube.com/watch?v=..."
            autoCapitalize="none"
          />
        </View>

        {/* Botón Guardar */}
        <TouchableOpacity
          style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={24} color="#fff" />
              <Text style={styles.saveBtnText}>Guardar Cambios</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8FF",
  },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F8FF",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },

  backBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    padding: 20,
  },

  section: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 16,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginTop: 12,
    marginBottom: 6,
  },

  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: "#333",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },

  textArea: {
    minHeight: 100,
    paddingTop: 14,
  },

  saveBtn: {
    backgroundColor: "#FF2D8D",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    borderRadius: 16,
    marginTop: 20,
    gap: 8,
  },

  saveBtnDisabled: {
    backgroundColor: "#CCC",
  },

  saveBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});
