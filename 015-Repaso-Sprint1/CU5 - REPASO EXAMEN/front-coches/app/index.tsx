import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { Picker } from "@react-native-picker/picker";

type Coche = {
  id: number;
  matricula: string;
  marca: string;
  modelo: string;
  fecha_matriculacion: string;
  categoria: { id: number; nombre: string };
};

type Categoria = {
  id: number;
  nombre: string;
};

export default function Index() {
  const [coches, setCoches] = useState<Coche[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [selectedCategoria, setSelectedCategoria] = useState("");

  useEffect(() => {
    const cargarCategorias = async () => {
      const res = await fetch("http://10.0.2.2:3000/categorias");
      setCategorias(await res.json());
    };
    const cargarCoches = async () => {
      const res = await fetch("http://10.0.2.2:3000/coches");
      setCoches(await res.json());
    };
    cargarCategorias();
    cargarCoches();
  }, []);

  useEffect(() => {
    const cargarFiltrado = async () => {
      const url = selectedCategoria
        ? `http://10.0.2.2:3000/coches?categoriaId=${selectedCategoria}`
        : "http://10.0.2.2:3000/coches";

      const res = await fetch(url);
      setCoches(await res.json());
    };
    cargarFiltrado();
  }, [selectedCategoria]);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22, marginBottom: 10 }}>Coches por Categoría</Text>

      <Picker
        selectedValue={selectedCategoria}
        onValueChange={setSelectedCategoria}
        style={{ marginBottom: 20 }}
      >
        <Picker.Item label="Todas las categorías" value="" />
        {categorias.map((c) => (
          <Picker.Item key={c.id} label={c.nombre} value={String(c.id)} />
        ))}
      </Picker>

      <FlatList
        data={coches}
        keyExtractor={(c) => c.id.toString()}
        renderItem={({ item }) => (
          <Text style={{ fontSize: 16, marginBottom: 10 }}>
            {item.marca} {item.modelo}  
            {"\n"}{item.matricula}
            {"\n"}{item.fecha_matriculacion}
            {"\n"}Categoría: {item.categoria?.nombre}
          </Text>
        )}
      />
    </View>
  );
}
