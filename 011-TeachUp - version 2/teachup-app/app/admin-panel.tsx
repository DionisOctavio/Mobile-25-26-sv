import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { PERMISSIONS } from '../constants/permissions';
import { API } from '../api/api';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function AdminPanelScreen() {
  const { can, currentUser } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProfesores: 0,
    activos: 0,
    inactivos: 0,
    categorias: {},
  });
  const [profesores, setProfesores] = useState([]);

  useEffect(() => {
    if (can(PERMISSIONS.ADMIN_PANEL_VIEW)) {
      loadData();
    }
  }, []);

  const loadData = async () => {
    try {
      const response = await API.get('/profesores');
      const data = response.data;

      setProfesores(data);

      // Calcular estadísticas
      const activos = data.filter((p) => p.activo !== false).length;
      const categorias = {};

      data.forEach((p) => {
        if (p.categoria) {
          categorias[p.categoria] = (categorias[p.categoria] || 0) + 1;
        }
      });

      setStats({
        totalProfesores: data.length,
        activos,
        inactivos: data.length - activos,
        categorias,
      });
    } catch (error) {
      console.log('Error loading data:', error.message);
      // Usar datos vacíos si falla
      setProfesores([]);
      setStats({
        totalProfesores: 0,
        activos: 0,
        inactivos: 0,
        categorias: {},
      });
    } finally {
      setLoading(false);
    }
  };

  // Verificar permiso
  if (!can(PERMISSIONS.ADMIN_PANEL_VIEW)) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.noAccessContainer}>
          <Ionicons name="lock-closed" size={64} color="#EF4444" />
          <Text style={styles.noAccessTitle}>Acceso Denegado</Text>
          <Text style={styles.noAccessText}>
            No tienes permisos para acceder al panel de administración
          </Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366F1" />
          <Text style={styles.loadingText}>Cargando datos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Panel Admin</Text>
          <Text style={styles.headerSubtitle}>
            Bienvenido, {currentUser?.nombre}
          </Text>
        </View>
        <View style={styles.adminBadge}>
          <Ionicons name="shield-checkmark" size={24} color="#FFF" />
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Estadísticas */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Estadísticas Generales</Text>

          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { borderLeftColor: '#6366F1' }]}>
              <Ionicons name="people" size={24} color="#6366F1" />
              <Text style={styles.statNumber}>{stats.totalProfesores}</Text>
              <Text style={styles.statLabel}>Total Profesores</Text>
            </View>

            <View style={[styles.statCard, { borderLeftColor: '#10B981' }]}>
              <Ionicons name="checkmark-circle" size={24} color="#10B981" />
              <Text style={styles.statNumber}>{stats.activos}</Text>
              <Text style={styles.statLabel}>Activos</Text>
            </View>

            <View style={[styles.statCard, { borderLeftColor: '#EF4444' }]}>
              <Ionicons name="close-circle" size={24} color="#EF4444" />
              <Text style={styles.statNumber}>{stats.inactivos}</Text>
              <Text style={styles.statLabel}>Inactivos</Text>
            </View>
          </View>
        </View>

        {/* Categorías */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Por Categoría</Text>
          <View style={styles.categoryList}>
            {Object.entries(stats.categorias).map(([categoria, count]) => (
              <View key={categoria} style={styles.categoryItem}>
                <View style={styles.categoryInfo}>
                  <Ionicons name="folder" size={20} color="#6366F1" />
                  <Text style={styles.categoryName}>{categoria}</Text>
                </View>
                <View style={styles.categoryCount}>
                  <Text style={styles.categoryCountText}>{count}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Acciones Rápidas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/create-item')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#6366F1' }]}>
              <Ionicons name="add-circle" size={28} color="#FFF" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Crear Profesor</Text>
              <Text style={styles.actionDescription}>
                Añadir un nuevo profesor al sistema
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#CBD5E1" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/search')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#10B981' }]}>
              <Ionicons name="create" size={28} color="#FFF" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Gestionar Profesores</Text>
              <Text style={styles.actionDescription}>
                Editar o desactivar profesores existentes
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#CBD5E1" />
          </TouchableOpacity>
        </View>

        {/* Lista de Profesores Recientes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Profesores Recientes</Text>
            <TouchableOpacity onPress={() => router.push('/search')}>
              <Text style={styles.seeAllText}>Ver todos →</Text>
            </TouchableOpacity>
          </View>

          {profesores.slice(0, 5).map((profesor) => (
            <TouchableOpacity
              key={profesor.id}
              style={styles.profesorItem}
              onPress={() => router.push(`/detalle-profesor/${profesor.id}`)}
            >
              <View style={styles.profesorInfo}>
                <Text style={styles.profesorName}>
                  {profesor.nombre} {profesor.apellido}
                </Text>
                <Text style={styles.profesorCategory}>{profesor.categoria}</Text>
              </View>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: profesor.activo === false ? '#EF4444' : '#10B981' },
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>

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
    paddingVertical: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  adminBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  statsSection: {
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '600',
  },
  statsGrid: {
    gap: 12,
  },
  statCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
    flex: 1,
  },
  statLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  categoryList: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    overflow: 'hidden',
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryName: {
    fontSize: 15,
    color: '#1E293B',
    fontWeight: '500',
  },
  categoryCount: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryCountText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6366F1',
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 13,
    color: '#64748B',
  },
  profesorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  profesorInfo: {
    flex: 1,
  },
  profesorName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  profesorCategory: {
    fontSize: 13,
    color: '#64748B',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
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
