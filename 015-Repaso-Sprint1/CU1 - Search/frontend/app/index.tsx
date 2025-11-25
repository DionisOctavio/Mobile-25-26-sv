import { useEffect, useState } from "react";
import { FlatList, Text, View, TextInput } from "react-native";

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
  const [search, setSearch] = useState("");

  const fetchCategorias = async () => {
    try {
      const response = await fetch("http://10.0.2.2:3000/categorias");
      const data = await response.json();
      setCategorias(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchLibros = async () => {
    try {
      // 1. Buscar si el texto coincide con el nombre de alguna categoría
      const searchLower = search.toLowerCase();
      const categoriaCoincidente = categorias.find((cat) =>
        cat.nombre.toLowerCase().includes(searchLower)
      );

      let url = "http://10.0.2.2:3000/libros?";

      if (categoriaCoincidente) {
        // Buscar por categoría
        url += `categoriaId=${categoriaCoincidente.id_categoria}`;
      } else if (search) {
        // Buscar por título
        url += `search=${search}`;
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
    fetchLibros();
  }, []);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22, marginBottom: 10 }}>Buscar Libros</Text>

      {/* Una única barra de búsqueda para todo */}
      <TextInput
        placeholder="Buscar por título o categoría..."
        value={search}
        onChangeText={setSearch}
        onSubmitEditing={fetchLibros}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 8,
          marginBottom: 20,
        }}
      />

      {/* Resultado */}
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