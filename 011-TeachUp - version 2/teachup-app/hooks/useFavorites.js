import { useEffect, useState } from "react";
import { API } from "../api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = '@teachup_favorites';

export function useFavorites(userId = 1) {
  const [favorites, setFavorites] = useState([]); // [{id, usuario, profesor}]
  const [loading, setLoading] = useState(true);

  // 1. Cargar favoritos al iniciar
  const loadFavorites = async () => {
    try {
      // Intentar cargar desde el backend
      const res = await API.get(`/favoritos/usuario/${userId}`);
      setFavorites(res.data);
      
      // Guardar en AsyncStorage como backup
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(res.data));
    } catch (error) {
      console.log('Error loading favorites from API:', error.message);
      
      // Si falla, usar datos locales
      try {
        const localData = await AsyncStorage.getItem(STORAGE_KEY);
        if (localData) {
          setFavorites(JSON.parse(localData));
        }
      } catch (storageError) {
        console.log('Error loading from storage:', storageError.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, [userId]);

  // 2. Comprobar si un profesor está en favoritos
  const isFavorite = (profesorId) => {
    return favorites.some((f) => f.profesor?.id === profesorId || f.profesor_id === profesorId);
  };

  // 3. Añadir favorito
  const addFavorite = async (profesorId) => {
    try {
      await API.post("/favoritos", {
        usuario_id: userId,
        profesor_id: profesorId,
      });
      await loadFavorites();
    } catch (error) {
      console.log('Error adding favorite:', error.message);
      
      // Añadir localmente si falla
      const newFav = {
        id: Date.now(),
        usuario_id: userId,
        profesor_id: profesorId,
        profesor: { id: profesorId }
      };
      const updated = [...favorites, newFav];
      setFavorites(updated);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  };

  // 4. Quitar favorito
  const removeFavorite = async (profesorId) => {
    try {
      // Encontrar el ID del favorito
      const fav = favorites.find((f) => f.profesor?.id === profesorId || f.profesor_id === profesorId);
      if (fav) {
        await API.delete(`/favoritos/${fav.id}`);
        await loadFavorites();
      }
    } catch (error) {
      console.log('Error removing favorite:', error.message);
      
      // Eliminar localmente si falla
      const updated = favorites.filter(
        (f) => f.profesor?.id !== profesorId && f.profesor_id !== profesorId
      );
      setFavorites(updated);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  };

  // 5. Alternar corazón
  const toggleFavorite = async (profesorId) => {
    if (isFavorite(profesorId)) {
      return removeFavorite(profesorId);
    } else {
      return addFavorite(profesorId);
    }
  };

  // 6. Exportar lista de profesores favoritos
  const getFavoriteTeachers = () => {
    return favorites.map((f) => f.profesor).filter(Boolean);
  };

  return {
    favorites,
    loading,
    isFavorite,
    toggleFavorite,
    getFavoriteTeachers,
    reloadFavorites: loadFavorites,
  };
}
