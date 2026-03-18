import { homeStyles } from "@/styles/homeStyle";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  // Estado que almacena el array de todas las notas
  // Any indica que es un array de cualquier tipo
  const [notes, setNotes] = useState<any[]>([]);

  // Funcion: Para cargar y ordenar las notas desde AsyncStorage
  const loadNotes = async () => {
    try {
      const storedNotes = await AsyncStorage.getItem("notas");
      // Si hay notas las convierte en JSON array, si no crea array vacio
      const parsedNotes = storedNotes ? JSON.parse(storedNotes) : [];

      // Ordena las notas con dos criterios:
      const sortedNotes = parsedNotes.sort((a: any, b: any) => {
        // Marcar como importante al inicio
        if (a.important && !b.important) return -1;
        if (!a.important && b.important) return 1;

        // Ordenar mas reciente a mas antigua
        const dateA = new Date(a.date.split("/").reverse().join("-"));
        const dateB = new Date(b.date.split("/").reverse().join("-"));
        return dateA.getTime() - dateB.getTime(); // Mas reciente primero
      });

      setNotes(sortedNotes);
    } catch (error) {
      console.log("error al cargar notas", error);
    }
  };

  // Funcion para marcar/desmarcar una nota como importante
  const toggleImportant = async (item: any) => {
    try {
      const storedNotes = await AsyncStorage.getItem("notas");
      const notes = storedNotes ? JSON.parse(storedNotes) : [];

      // Recorre el array y cambia el campo important solo en nota seleccionada
      // !n.important invierte el valor: true->false, false->true
      const updateNotes = notes.map((n: any) =>
        n.id === item.id ? { ...n, important: !n.important } : n,
      );

      // Guarda el array actualizado
      await AsyncStorage.setItem("notas", JSON.stringify(updateNotes));
      // Recarga notas para reflejar el cambio y preordenar
      loadNotes();
    } catch (error) {
      console.log("Error al marcar importante", error);
    }
  };

  // useFocusEffect: recarga notas cada vez que el usuario vuelve a esta pantalla
  // useCallBack: evita que la funcion se recree innecesariamente
  // El array vacio [] significa solo se crea una vez
  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, []),
  );

  // Funcion que define como se ve cada nota en la lista
  const renderNote = ({ item }: { item: any }) => {
    return (
      // Al presionar la tarjeta navega al detalle de la nota pasando su id como parametro
      <TouchableOpacity
        style={homeStyles.noteCard}
        onPress={() => router.push(`/detail-note?id=${item.id}`)}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Contenido nota: titulo, fecha y descripcion corta */}
          <View style={{ flex: 1 }}>
            <Text style={homeStyles.noteTitle}>{item.title}</Text>
            <Text style={homeStyles.noteDate}>{item.date}</Text>
            <Text style={homeStyles.noteShortDesc}>
              {item.shortdescription}
            </Text>
          </View>

          {/* Boton estrella para marcar/desmarcar como importante */}
          {/* Muestra estrella llena dorada si es importante, o estrella vacia
              en gris si no*/}
          <TouchableOpacity onPress={() => toggleImportant(item)}>
            <Ionicons
              name={item.important ? "star" : "star-outline"}
              size={24}
              color={item.important ? "#FFD700" : "#ccc"}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={homeStyles.main}>
      <Text style={homeStyles.title}>My Notes</Text>

      {/* Boton para navegar a la pantalla de crear nota */}
      <TouchableOpacity
        style={homeStyles.buttonAdd}
        onPress={() => router.push("/create-note")}
      >
        <Text style={homeStyles.textButtonAdd}>Add a Note</Text>
      </TouchableOpacity>

      {/* FlatList: renderiza la lista de notas de forma optimizada
          Solo se renderiza los elementos visibles en pantalla
          mejora el rendimiento */}
      <FlatList
        data={notes} // Array de notas a mostrar
        keyExtractor={(item) => item.id} // Clave unica para cada elemento
        renderItem={renderNote} // Funcion que renderiza cada nota
        contentContainerStyle={homeStyles.listContainer} // Estilo del contenedor
      />
    </View>
  );
}
