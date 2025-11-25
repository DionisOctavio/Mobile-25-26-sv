import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { Picker } from "@react-native-picker/picker";

type Libro = {
  id_libro: number;
  titulo: string;
  autor: string;
  paginas: number;
};

type Categoria = {
  id_categoria: number;
  nombre: string;
};

export default function Index() {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [selectedCategoria, setSelectedCategoria] = useState("");

  const fetchCategorias = async () => {
    try {
      const response = await fetch("http://10.0.2.2:3000/categorias");
      const data = await response.json();
      setCategorias(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchLibros = async (categoriaId?: string) => {
    try {
      let url = "http://10.0.2.2:3000/libros";

      // Si se selecciona una categoría → filtra
      if (categoriaId) {
        url += `?categoriaId=${categoriaId}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      setLibros(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCategorias();
    fetchLibros(); // cargar todos al principio
  }, []);

  // Cuando cambia la categoría, vuelve a pedir datos
  useEffect(() => {
    fetchLibros(selectedCategoria);
  }, [selectedCategoria]);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22, marginBottom: 10 }}>Libros por Categoría</Text>

      {/* SELECT de categorías */}
      <Picker
        selectedValue={selectedCategoria}
        onValueChange={(value) => setSelectedCategoria(value)}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          marginBottom: 20,
        }}
      >
        <Picker.Item label="Todas las categorías" value="" />

        {categorias.map((cat) => (
          <Picker.Item
            key={cat.id_categoria}
            label={cat.nombre}
            value={cat.id_categoria.toString()}
          />
        ))}
      </Picker>

      {/* LISTA DE LIBROS */}
      <FlatList
        data={libros}
        keyExtractor={(item) => item.id_libro.toString()}
        renderItem={({ item }) => (
          <Text style={{ fontSize: 16, marginBottom: 5 }}>
            {item.titulo} ({item.autor}) - {item.paginas} páginas
          </Text>
        )}
      />
    </View>
  );
}
