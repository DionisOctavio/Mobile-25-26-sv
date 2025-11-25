import { useEffect, useState } from "react";
import { API } from "../api/api";

export function useFavorites(userId = 1) {
  const [favorites, setFavorites] = useState([]); // [{id, usuario, profesor}]

  // 1. Cargar favoritos al iniciar
  const loadFavorites = async () => {
    const res = await API.get(`/favoritos/${userId}`);
    setFavorites(res.data);
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  // 2. Comprobar si un profesor está en favoritos
  const isFavorite = (profesorId) => {
    return favorites.some((f) => f.profesor.id === profesorId);
  };

  // 3. Añadir favorito
  const addFavorite = async (profesorId) => {
    await API.post("/favoritos", {
      usuario_id: userId,
      profesor_id: profesorId,
    });

    await loadFavorites();
  };

  // 4. Quitar favorito
  const removeFavorite = async (profesorId) => {
    await API.delete("/favoritos", {
      data: { usuario_id: userId, profesor_id: profesorId },
    });

    await loadFavorites();
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
    return favorites.map((f) => f.profesor);
  };

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    getFavoriteTeachers,
    reloadFavorites: loadFavorites,
  };
}
