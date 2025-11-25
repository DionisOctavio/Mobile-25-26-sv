import React, { useState, useEffect } from "react";
import {
  ScrollView,
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { API } from "../api/api";
import { useRouter } from "expo-router";

const CATEGORIAS = [
  "Inglés",
  "Matemáticas",
  "Programación",
  "Lengua",
  "Refuerzo",
  "Historia",
];

const MODALIDADES = ["online", "presencial", "mixto"];

export default function AddProfesor() {
  const router = useRouter();

  useEffect(() => {
    global.hideBottomNav?.();
    return () => global.showBottomNav?.();
  }, []);

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    descripcion: "",
    categoria: "",
    precio_hora: "",
    telefono: "",
    email: "",
    titulo_curso: "",
    experiencia_anios: "",
    estudios: "",
    modalidad: "",
    ubicacion: "",
    disponibilidad: "",
    idiomas: "",
    habilidades: "",
  });

  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 0.8,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (err) {
      console.log("❌ Error seleccionando imagen:", err);
    }
  };

  const handleSubmit = async () => {
    try {
      setUploading(true);

      if (!form.nombre || !form.categoria || !form.precio_hora) {
        Alert.alert("Faltan datos", "Nombre, categoría y precio son obligatorios.");
        return;
      }

      if (!image) {
        Alert.alert("Imagen requerida", "Selecciona una imagen del profesor.");
        return;
      }

      // -----------------------
      // 1) PRESIGNED URL
      // -----------------------
      const filename = `${Date.now()}.jpg`;

      let presigned = null;
      try {
        presigned = await API.post("/uploads/presign", {
          filename,
          type: "image/jpeg",
        });
      } catch (err) {
        Alert.alert("Error", "No se pudo obtener URL de subida.");
        return;
      }

      const uploadUrl = presigned.data.uploadUrl;
      const key = presigned.data.key;

      // -----------------------
      // 2) SUBIR A S3
      // -----------------------

      const file = await fetch(image);
      const blob = await file.blob();

      const upload = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": "image/jpeg" },
        body: blob,
      });


      if (!upload.ok) {
        const text = await upload.text();
        throw new Error("Error al subir la imagen a S3");
      }

      // -----------------------
      // 3) CREAR PROFESOR
      // -----------------------
      const payload = {
        ...form,
        precio_hora: Number(form.precio_hora),
        experiencia_anios: form.experiencia_anios
          ? Number(form.experiencia_anios)
          : null,
        thumbnailKey: key,
      };


      try {
        const createRes = await API.post("/profesores", payload);
      } catch (err) {
        Alert.alert("Error", "No se pudo crear el profesor en el servidor.");
        return;
      }

      Alert.alert("¡Listo!", "El profesor se creó correctamente.");
      router.push("/");
    } catch (err) {
      Alert.alert("Error", "Algo salió mal.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} color="#1A1A2E" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Nuevo Profesor</Text>
          <View style={{ width: 28 }} />
        </View>

        <Section title="Identidad del profesor">
          <Input label="Nombre" value={form.nombre} onChange={(v) => handleChange("nombre", v)} />
          <Input label="Apellido" value={form.apellido} onChange={(v) => handleChange("apellido", v)} />

          <Text style={styles.label}>Categoría</Text>
          <View style={styles.chipsRow}>
            {CATEGORIAS.map((cat) => {
              const active = form.categoria === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => handleChange("categoria", cat)}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={[styles.label, { marginTop: 12 }]}>Modalidad</Text>
          <View style={styles.chipsRow}>
            {MODALIDADES.map((mod) => {
              const active = form.modalidad === mod;
              return (
                <TouchableOpacity
                  key={mod}
                  style={[styles.chipSmall, active && styles.chipActive]}
                  onPress={() => handleChange("modalidad", mod)}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>
                    {mod}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Section>

        <Section title="Información profesional">
          <Input label="Título del curso" value={form.titulo_curso} onChange={(v) => handleChange("titulo_curso", v)} />
          <Input label="Estudios" value={form.estudios} onChange={(v) => handleChange("estudios", v)} />
          <Input label="Años de experiencia" keyboard="numeric" value={form.experiencia_anios} onChange={(v) => handleChange("experiencia_anios", v)} />
          <Input label="Precio/hora (€)" keyboard="numeric" value={form.precio_hora} onChange={(v) => handleChange("precio_hora", v)} />
          <Input label="Descripción" value={form.descripcion} multiline big onChange={(v) => handleChange("descripcion", v)} />
        </Section>

        <Section title="Contacto">
          <Input label="Teléfono" value={form.telefono} onChange={(v) => handleChange("telefono", v)} />
          <Input label="Email" value={form.email} onChange={(v) => handleChange("email", v)} />
          <Input label="Ubicación" value={form.ubicacion} onChange={(v) => handleChange("ubicacion", v)} />
          <Input label="Disponibilidad" value={form.disponibilidad} onChange={(v) => handleChange("disponibilidad", v)} />
          <Input label="Idiomas" value={form.idiomas} onChange={(v) => handleChange("idiomas", v)} />
          <Input label="Habilidades" value={form.habilidades} onChange={(v) => handleChange("habilidades", v)} />
        </Section>

        <Section title="Imagen del profesor">
          <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
            <Ionicons name="image-outline" size={22} color="#6B7280" />
            <Text style={styles.imagePickerText}>
              {image ? "Cambiar imagen" : "Seleccionar imagen"}
            </Text>
          </TouchableOpacity>

          {image && <Image source={{ uri: image }} style={styles.previewImage} />}
        </Section>

        <View style={{ height: 100 }} />
      </ScrollView>

      <TouchableOpacity style={styles.fab} disabled={uploading} onPress={handleSubmit}>
        <Ionicons name="checkmark" size={24} color="#FFF" />
        <Text style={styles.fabText}>{uploading ? "Creando..." : "Crear profesor"}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

function Section({ title, children }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Input({ label, value, onChange, multiline, big, keyboard }) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        keyboardType={keyboard || "default"}
        style={[
          styles.input,
          multiline && { height: big ? 120 : 80, textAlignVertical: "top" },
        ]}
        multiline={multiline}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F5F5FF",
  },
  container: {
    padding: 22,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 26,
    fontWeight: "900",
    color: "#1A1A2E",
  },
  section: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 26,
    marginBottom: 22,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1A1A2E",
    marginBottom: 16,
  },
  label: {
    fontWeight: "700",
    color: "#1A1A2E",
    marginBottom: 4,
    fontSize: 14,
  },
  input: {
    backgroundColor: "#F1F2F6",
    padding: 14,
    borderRadius: 14,
    fontSize: 14,
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 10,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#E5E7EB",
  },
  chipSmall: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: "#E5E7EB",
  },
  chipActive: {
    backgroundColor: "#6D28D9",
  },
  chipText: {
    color: "#1A1A2E",
    fontWeight: "600",
  },
  chipTextActive: {
    color: "#FFF",
  },
  imagePicker: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    backgroundColor: "#EFEFFF",
    borderRadius: 16,
  },
  imagePickerText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#4C4C7A",
  },
  previewImage: {
    width: "100%",
    height: 260,
    borderRadius: 20,
    marginTop: 14,
  },
  fab: {
    position: "absolute",
    bottom: 26,
    alignSelf: "center",
    flexDirection: "row",
    gap: 8,
    backgroundColor: "#6D28D9",
    paddingVertical: 14,
    paddingHorizontal: 26,
    borderRadius: 50,
    elevation: 5,
  },
  fabText: {
    color: "#FFF",
    fontWeight: "800",
    fontSize: 16,
  },
});
