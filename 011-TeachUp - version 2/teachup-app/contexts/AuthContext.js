import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '../api/api';
import { ROLE_PERMISSIONS } from '../constants/permissions';

const AuthContext = createContext();

const STORAGE_KEY = '@teachup_user';

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar usuario al iniciar la app
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userJson = await AsyncStorage.getItem(STORAGE_KEY);
      if (userJson) {
        const user = JSON.parse(userJson);
        setCurrentUser(user);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectUser = async (userId) => {
    try {
      // Obtener usuario del backend
      const response = await API.get(`/usuarios/${userId}`);
      const userData = response.data;

      // Construir objeto de usuario con permisos según su rol
      const roleName = userData.rol?.nombre || 'USER';
      
      console.log('👤 Usuario desde backend:', userData);
      console.log('🎭 Rol detectado:', roleName);
      console.log('🔑 Permisos asignados:', ROLE_PERMISSIONS[roleName]);
      
      const permissions = ROLE_PERMISSIONS[roleName] || ROLE_PERMISSIONS.USER;

      const user = {
        id: userData.id,
        nombre: userData.nombre,
        apellido: userData.apellido,
        email: userData.email,
        avatar: `https://i.pravatar.cc/300?u=${userData.id}`,
        role: roleName,
        permissions: permissions,
      };

      // Guardar en AsyncStorage
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      setCurrentUser(user);

      console.log('✅ Usuario configurado:', user);

      return user;
    } catch (error) {
      console.log('Error selecting user:', error.message);
      console.log('⚠️ Usando datos mock para userId:', userId);
      
      // Si falla, usar datos mock basados en el userId
      const mockUsers = {
        1: { nombre: 'Admin', apellido: 'Demo', email: 'admin@teachup.com', role: 'ADMIN' },
        2: { nombre: 'Profesor', apellido: 'Demo', email: 'profesor@teachup.com', role: 'PROFESOR' },
        3: { nombre: 'Usuario', apellido: 'Demo', email: 'user@teachup.com', role: 'USER' },
      };
      
      const mockData = mockUsers[userId] || mockUsers[3];
      const roleName = mockData.role;
      const permissions = ROLE_PERMISSIONS[roleName] || ROLE_PERMISSIONS.USER;
      
      const user = {
        id: userId,
        nombre: mockData.nombre,
        apellido: mockData.apellido,
        email: mockData.email,
        avatar: `https://i.pravatar.cc/300?u=${userId}`,
        role: roleName,
        permissions: permissions,
      };
      
      console.log('✅ Usuario mock configurado:', user);
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      setCurrentUser(user);
      
      return user;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setCurrentUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Función global can() para verificar permisos
  const can = (permissionCode) => {
    if (!currentUser || !currentUser.permissions) {
      return false;
    }
    return currentUser.permissions.includes(permissionCode);
  };

  const value = {
    currentUser,
    loading,
    selectUser,
    logout,
    can,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Exportar la función can globalmente
export const can = (permissionCode) => {
  // Esta es una versión que puede ser usada fuera de componentes
  // pero requiere que el contexto esté disponible
  return false; // Por defecto sin acceso
};
