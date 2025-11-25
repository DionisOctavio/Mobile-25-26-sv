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

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await fetch("http://10.0.2.2:3000/categorias");
        setCategorias(await res.json());
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategorias();
  }, []);

  useEffect(() => {
    const fetchLibros = async () => {
      try {
        const res = await fetch("http://10.0.2.2:3000/libros");
        setLibros(await res.json());
      } catch (error) {
        console.error(error);
      }
    };

    fetchLibros();
  }, []);

  useEffect(() => {
    const fetchLibrosFiltrados = async () => {
      try {
        const url = selectedCategoria
          ? `http://10.0.2.2:3000/libros?categoriaId=${selectedCategoria}`
          : "http://10.0.2.2:3000/libros";

        const res = await fetch(url);
        setLibros(await res.json());
      } catch (error) {
        console.error(error);
      }
    };

    fetchLibrosFiltrados();
  }, [selectedCategoria]);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22, marginBottom: 10 }}>
        Libros por Categoría
      </Text>

      {/* Picker de categorías */}
      <Picker
        selectedValue={selectedCategoria}
        onValueChange={setSelectedCategoria}
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
            value={String(cat.id_categoria)}
          />
        ))}
      </Picker>

      {/* Lista de libros */}
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
