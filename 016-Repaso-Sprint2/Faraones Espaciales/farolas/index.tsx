import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";

const BASE_URL = "http://10.0.2.2:3000";

type Libro = {
  id_libro: number;
  titulo: string;
};

type ReservaJoin = {
  fecha: string;
  usuario: {
    id_usuario: number;
    nombre: string;
  };
};

export default function App() {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [reservas, setReservas] = useState<ReservaJoin[]>([]);
  const [selectedLibro, setSelectedLibro] = useState<Libro | null>(null);

  // 1️⃣ Cargar libros base
  const fetchLibros = async () => {
    const res = await fetch(`${BASE_URL}/libros`);
    const data = await res.json();
    setLibros(data);
  };

  // 2️⃣ Cuando pulso un libro → traer join
  const fetchReservasLibro = async (id_libro: number) => {
    const res = await fetch(`${BASE_URL}/reservas/libro/${id_libro}`);
    const data = await res.json();
    setReservas(data);
  };

  useEffect(() => {
    fetchLibros();
  }, []);

  // Render libro (FlatList 1)
  const renderLibro = ({ item }: { item: Libro }) => {
    const activo = selectedLibro?.id_libro === item.id_libro;

    return (
      <TouchableOpacity
        style={[styles.chip, activo && styles.chipActiva]}
        onPress={() => {
          setSelectedLibro(item);
          fetchReservasLibro(item.id_libro);
        }}
      >
        <Text>{item.titulo}</Text>
      </TouchableOpacity>
    );
  };

  // Render reserva (FlatList 2)
  const renderReserva = ({ item }: { item: ReservaJoin }) => (
    <View style={styles.cardReserva}>
      <Text style={styles.textoPrincipal}>{item.usuario.nombre}</Text>
      <Text style={styles.textoSecundario}>Fecha: {item.fecha}</Text>
    </View>
  );

  return (
    <View style={styles.contenedor}>
      <Text style={styles.tituloPantalla}>Libros y Reservas (JOIN)</Text>

      {/* 1️⃣ Lista de libros */}
      <FlatList
        data={libros}
        horizontal
        keyExtractor={(item) => item.id_libro.toString()}
        renderItem={renderLibro}
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 16 }}
      />

      {/* 2️⃣ Lista de reservas de ese libro */}
      <FlatList
        data={reservas}
        keyExtractor={(item) => item.usuario.id_usuario.toString()}
        renderItem={renderReserva}
      />
    </View>
  );
}

// estilos
const styles = StyleSheet.create({
  contenedor: { flex: 1, padding: 16, backgroundColor: "white" },
  tituloPantalla: { fontSize: 22, fontWeight: "bold", marginBottom: 12 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  chipActiva: {
    backgroundColor: "#ddd",
    borderColor: "black",
  },
  cardReserva: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  textoPrincipal: { fontSize: 18, fontWeight: "bold" },
  textoSecundario: { fontSize: 12, color: "#666", marginTop: 4 },
});