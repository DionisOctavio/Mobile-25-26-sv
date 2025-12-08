import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { PERMISSIONS } from '../constants/permissions';
import { API } from '../api/api';
import Ionicons from '@expo/vector-icons/Ionicons';

const CATEGORIAS = ['Programación', 'Matemáticas', 'Idiomas', 'Refuerzo', 'Música', 'Arte'];

export default function CreateItemScreen() {
  const { can, currentUser } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    titulo_curso: '',
    descripcion: '',
    categoria: '',
    precio_hora: '',
    telefono: '',
    email: '',
    experiencia_anios: '',
    estudios: '',
    modalidad: '',
    ubicacion: '',
    disponibilidad: '',
    idiomas: '',
    habilidades: '',
    imagen_url: '',
    video_presentacion_url: '',
  });

  // Verificar permiso
  if (!can(PERMISSIONS.ITEM_CREATE)) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.noAccessContainer}>
          <Ionicons name="lock-closed" size={64} color="#EF4444" />
          <Text style={styles.noAccessTitle}>Acceso Denegado</Text>
          <Text style={styles.noAccessText}>
            No tienes permisos para crear profesores
          </Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleCreate = async () => {
    // Validaciones
    if (!formData.nombre || !formData.titulo_curso || !formData.categoria) {
      Alert.alert('Error', 'Por favor completa Nombre, Título del curso y Categoría (campos obligatorios)');
      return;
    }

    try {
      setLoading(true);

      const profesorData = {
        nombre: formData.nombre,
        apellido: formData.apellido || undefined,
        titulo_curso: formData.titulo_curso,
        descripcion: formData.descripcion || undefined,
        categoria: formData.categoria,
        precio_hora: formData.precio_hora ? parseFloat(formData.precio_hora) : undefined,
        telefono: formData.telefono || undefined,
        email: formData.email || undefined,
        experiencia_anios: formData.experiencia_anios ? parseInt(formData.experiencia_anios) : undefined,
        estudios: formData.estudios || undefined,
        modalidad: formData.modalidad || undefined,
        ubicacion: formData.ubicacion || undefined,
        disponibilidad: formData.disponibilidad || undefined,
        idiomas: formData.idiomas || undefined,
        habilidades: formData.habilidades || undefined,
        imagen_url: formData.imagen_url || undefined,
        video_presentacion_url: formData.video_presentacion_url || undefined,
      };

      await API.post('/profesores', profesorData);
      
      Alert.alert('¡Éxito!', 'Profesor creado correctamente', [
        { text: 'OK', onPress: () => router.replace('/') },
      ]);
    } catch (error) {
      console.log('❌ Error creando profesor:', error.message);
      Alert.alert('Error', 'No se pudo crear el profesor. Verifica los datos e intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Crear Profesor</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Nombre */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Nombre <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={formData.nombre}
            onChangeText={(text) => setFormData({ ...formData, nombre: text })}
            placeholder="Ej: Juan"
            placeholderTextColor="#94A3B8"
          />
        </View>

        {/* Apellido */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Apellido <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={formData.apellido}
            onChangeText={(text) => setFormData({ ...formData, apellido: text })}
            placeholder="Ej: Pérez"
            placeholderTextColor="#94A3B8"
          />
        </View>

        {/* Título */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Título del Curso <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={formData.titulo_curso}
            onChangeText={(text) => setFormData({ ...formData, titulo_curso: text })}
            placeholder="Ej: Matemáticas Avanzadas, Inglés B2..."
            placeholderTextColor="#94A3B8"
          />
        </View>

        {/* Categoría */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Categoría <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.categoryGrid}>
            {CATEGORIAS.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryChip,
                  formData.categoria === cat && styles.categoryChipSelected,
                ]}
                onPress={() => setFormData({ ...formData, categoria: cat })}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    formData.categoria === cat && styles.categoryChipTextSelected,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Descripción */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.descripcion}
            onChangeText={(text) => setFormData({ ...formData, descripcion: text })}
            placeholder="Describe la experiencia del profesor..."
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Precio */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Precio por hora (€)</Text>
          <TextInput
            style={styles.input}
            value={formData.precio_hora}
            onChangeText={(text) => setFormData({ ...formData, precio_hora: text })}
            placeholder="Ej: 25"
            placeholderTextColor="#94A3B8"
            keyboardType="decimal-pad"
          />
        </View>

        {/* Experiencia */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Años de experiencia</Text>
          <TextInput
            style={styles.input}
            value={formData.experiencia_anios}
            onChangeText={(text) => setFormData({ ...formData, experiencia_anios: text })}
            placeholder="Ej: 5"
            placeholderTextColor="#94A3B8"
            keyboardType="numeric"
          />
        </View>

        {/* URL Video */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>URL del video (YouTube)</Text>
          <TextInput
            style={styles.input}
            value={formData.video_presentacion_url}
            onChangeText={(text) => setFormData({ ...formData, video_presentacion_url: text })}
            placeholder="https://youtube.com/watch?v=..."
            placeholderTextColor="#94A3B8"
            autoCapitalize="none"
          />
        </View>

        {/* URL Imagen */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>URL de la imagen</Text>
          <TextInput
            style={styles.input}
            value={formData.imagen_url}
            onChangeText={(text) => setFormData({ ...formData, imagen_url: text })}
            placeholder="https://ejemplo.com/imagen.jpg"
            placeholderTextColor="#94A3B8"
            autoCapitalize="none"
          />
        </View>

        {/* Teléfono */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Teléfono</Text>
          <TextInput
            style={styles.input}
            value={formData.telefono}
            onChangeText={(text) => setFormData({ ...formData, telefono: text })}
            placeholder="+34 600 000 000"
            placeholderTextColor="#94A3B8"
            keyboardType="phone-pad"
          />
        </View>

        {/* Email */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            placeholder="email@ejemplo.com"
            placeholderTextColor="#94A3B8"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Estudios */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Estudios</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.estudios}
            onChangeText={(text) => setFormData({ ...formData, estudios: text })}
            placeholder="Licenciatura, Máster, Certificaciones..."
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* Modalidad */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Modalidad</Text>
          <TextInput
            style={styles.input}
            value={formData.modalidad}
            onChangeText={(text) => setFormData({ ...formData, modalidad: text })}
            placeholder="online / presencial / mixto"
            placeholderTextColor="#94A3B8"
          />
        </View>

        {/* Ubicación */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Ubicación</Text>
          <TextInput
            style={styles.input}
            value={formData.ubicacion}
            onChangeText={(text) => setFormData({ ...formData, ubicacion: text })}
            placeholder="Madrid, Barcelona..."
            placeholderTextColor="#94A3B8"
          />
        </View>

        {/* Disponibilidad */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Disponibilidad</Text>
          <TextInput
            style={styles.input}
            value={formData.disponibilidad}
            onChangeText={(text) => setFormData({ ...formData, disponibilidad: text })}
            placeholder="Lunes a Viernes, 10:00-18:00"
            placeholderTextColor="#94A3B8"
          />
        </View>

        {/* Idiomas */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Idiomas</Text>
          <TextInput
            style={styles.input}
            value={formData.idiomas}
            onChangeText={(text) => setFormData({ ...formData, idiomas: text })}
            placeholder="Español, Inglés, Francés..."
            placeholderTextColor="#94A3B8"
          />
        </View>

        {/* Habilidades */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Habilidades</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.habilidades}
            onChangeText={(text) => setFormData({ ...formData, habilidades: text })}
            placeholder="Paciencia, Comunicación, Creatividad..."
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* Botón Crear */}
        <TouchableOpacity
          style={[styles.createButton, loading && styles.createButtonDisabled]}
          onPress={handleCreate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={24} color="#FFF" />
              <Text style={styles.createButtonText}>Crear Profesor</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  imageSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  required: {
    color: '#EF4444',
  },
  imagePicker: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
  },
  imagePlaceholderText: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 8,
  },
  inputGroup: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: '#1E293B',
  },
  textArea: {
    height: 100,
    paddingTop: 14,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
  },
  categoryChipSelected: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  categoryChipText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  categoryChipTextSelected: {
    color: '#FFF',
  },
  createButton: {
    backgroundColor: '#6366F1',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
  },
  createButtonDisabled: {
    backgroundColor: '#94A3B8',
  },
  createButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noAccessContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  noAccessTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginTop: 16,
    marginBottom: 8,
  },
  noAccessText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
