import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { API } from '../api/api';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function RoleSelectionScreen() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState(false);
  const { selectUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    loadUsuarios();
  }, []);

  const loadUsuarios = async () => {
    try {
      const response = await API.get('/usuarios');
      setUsuarios(response.data);
    } catch (error) {
      console.error('Error loading usuarios:', error);
      
      // Si falla, usar datos mock
      const mockUsuarios = [
        {
          id: 1,
          nombre: 'Admin',
          apellido: 'Demo',
          email: 'admin@teachup.com',
          rol: { id: 1, nombre: 'ADMIN', descripcion: 'Administrador del sistema' }
        },
        {
          id: 2,
          nombre: 'Profesor',
          apellido: 'Demo',
          email: 'profesor@teachup.com',
          rol: { id: 2, nombre: 'PROFESOR', descripcion: 'Profesor de TeachUp' }
        },
        {
          id: 3,
          nombre: 'Usuario',
          apellido: 'Demo',
          email: 'user@teachup.com',
          rol: { id: 3, nombre: 'USER', descripcion: 'Usuario estándar' }
        }
      ];
      
      setUsuarios(mockUsuarios);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUser = async (userId) => {
    try {
      setSelecting(true);
      await selectUser(userId);
      router.replace('/');
    } catch (error) {
      console.error('Error selecting user:', error);
      alert('Error al seleccionar usuario');
    } finally {
      setSelecting(false);
    }
  };

  const getRoleIcon = (roleName) => {
    switch (roleName) {
      case 'ADMIN':
        return 'shield-checkmark';
      case 'PROFESOR':
        return 'school';
      case 'USER':
      default:
        return 'person';
    }
  };

  const getRoleColor = (roleName) => {
    switch (roleName) {
      case 'ADMIN':
        return '#FF6B6B';
      case 'PROFESOR':
        return '#4ECDC4';
      case 'USER':
      default:
        return '#95E1D3';
    }
  };

  const getRoleDescription = (roleName) => {
    switch (roleName) {
      case 'ADMIN':
        return 'Acceso completo al sistema, crear y gestionar profesores';
      case 'PROFESOR':
        return 'Editar información propia y gestionar clases';
      case 'USER':
      default:
        return 'Explorar profesores y gestionar favoritos';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366F1" />
          <Text style={styles.loadingText}>Cargando usuarios...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="person-circle" size={64} color="#6366F1" />
          </View>
          <Text style={styles.title}>¡Bienvenido a TeachUp!</Text>
          <Text style={styles.subtitle}>
            Selecciona tu perfil para comenzar
          </Text>
        </View>

        {/* Usuario Cards */}
        <View style={styles.cardsContainer}>
          {usuarios.map((usuario) => {
            const roleName = usuario.rol?.nombre || 'USER';
            const roleColor = getRoleColor(roleName);
            const roleIcon = getRoleIcon(roleName);

            return (
              <TouchableOpacity
                key={usuario.id}
                style={[styles.card, { borderColor: roleColor }]}
                onPress={() => handleSelectUser(usuario.id)}
                disabled={selecting}
                activeOpacity={0.7}
              >
                <View style={[styles.cardIcon, { backgroundColor: roleColor }]}>
                  <Ionicons name={roleIcon} size={32} color="#FFF" />
                </View>

                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>
                    {usuario.nombre} {usuario.apellido}
                  </Text>
                  <View style={[styles.roleBadge, { backgroundColor: roleColor }]}>
                    <Text style={styles.roleText}>{roleName}</Text>
                  </View>
                  <Text style={styles.cardDescription}>
                    {getRoleDescription(roleName)}
                  </Text>
                  <Text style={styles.cardEmail}>{usuario.email}</Text>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={24}
                  color="#CBD5E1"
                  style={styles.cardArrow}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        {selecting && (
          <View style={styles.selectingOverlay}>
            <ActivityIndicator size="large" color="#6366F1" />
            <Text style={styles.selectingText}>Iniciando sesión...</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748B',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
  },
  cardsContainer: {
    gap: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 6,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  roleText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  cardDescription: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 4,
  },
  cardEmail: {
    fontSize: 12,
    color: '#94A3B8',
    fontStyle: 'italic',
  },
  cardArrow: {
    marginLeft: 8,
  },
  selectingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748B',
    fontWeight: '600',
  },
});
