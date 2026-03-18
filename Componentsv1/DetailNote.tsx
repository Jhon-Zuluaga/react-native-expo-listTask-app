import { detailNoteStyle } from "@/styles/detailNoteStyle";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Print from "expo-print";
import { router, useLocalSearchParams } from "expo-router";
import * as Sharing from "expo-sharing";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function DetailNote() {
  // Obtiene el parametro "id" de URL (detail-note?id=123)
  const { id } = useLocalSearchParams();

  // Estado que almacena la nota completa cargada de AsyncStorage
  const [note, setNote] = useState<any>(null);

  // Controla si la pantalla esta en modo edicion o modo vista
  const [isEditing, setIsEditing] = useState(false);

  // Estados para cada campo editable de la nota
  const [title, setTitle] = useState("");
  const [shortdescription, setShortdescription] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  // Controla si el selector de fecha esta visible
  const [showDatePicker, setShowDatePicker] = useState(false);
  // Fecha seleccionada como objeto date para el datetimepicker
  const [selectedDate, setSelectedDate] = useState(new Date());

  // UseEffect - Carga nota cuando el componente se monta o
  // cuando cambia el id
  useEffect(() => {
    const loadNote = async () => {
      const storedNotes = await AsyncStorage.getItem("notas");
      const notes = storedNotes ? JSON.parse(storedNotes) : [];

      // Busca la nota cuyo id coincide con el id por parametro
      const found = notes.find((n: any) => n.id === id);
      setNote(found);

      //Si encontro la nota, carga sus valores en estados de edicion
      if (found) {
        setTitle(found.title);
        setShortdescription(found.shortdescription);
        setDate(found.date);
        setDescription(found.description);
      }
    };
    loadNote();
  }, [id]); // Se re-ejecuta si cambia el id

  // Funcion que ejecuta cuando el usuario selecciona o cancela fecha
  const onDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (event.type !== "dismissed" && date) {
      setSelectedDate(date);
      setDate(date.toLocaleDateString("es-ES")); // Convierte formato a DD-MM-YY
    }
  };

  // Funcion que exporta la nota como PDF
  const exportPDF = async () => {
    try {
      const html = `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; padding: 30px; color: #333; }
              h1 { color: #4A90E2; border-bottom: 2px solid #4A90E2; padding-bottom: 10px; }
              .date { color: #888; font-size: 14px; margin-bottom: 20px; }
              .shortdesc { font-style: italic; color: #555; margin-bottom: 20px; }
              .description { font-size: 16px; line-height: 1.6; }
            </style>
          </head>
          <body>
            <h1>${note?.title}</h1>
            <p class="date">📅 ${note?.date}</p>
            <p class="shortdesc">${note?.shortdescription}</p>
            <p class="description">${note?.description}</p>
          </body>
        </html>
      `;
      // Convierte HTML a PDF y obtiene su ruta temporal
      const { uri } = await Print.printToFileAsync({ html });
      // Abre el menu de compartir del dispositivo con el PDF generado
      await Sharing.shareAsync(uri, {
        mimeType: "application/pdf",
        dialogTitle: "Compartir nota",
      });
    } catch (error) {
      console.error("Error al exportar PDF:", error);
      Alert.alert("Error", "No se pudo exportar el PDF.");
    }
  };

  // Funcion para guardar cambios de la nota editada
  const editNote = async () => {
    // Validacion: Ningun campo puede estar vacio
    if (!title || !shortdescription || !date || !description) {
      Alert.alert("Error", "Debe rellenar todos los campos");
      return;
    }

    try {
      const storedNotes = await AsyncStorage.getItem("notas");
      const notes = storedNotes ? JSON.parse(storedNotes) : [];

      // Recorre el array y reemplaza la nota con el id coinciente por
      // La version editada. El operador {..n} copia todos los campos y
      // Luego sobreeescribe los editados
      const updateNotes = notes.map((n: any) =>
        n.id === note.id
          ? { ...n, title, shortdescription, date, description }
          : n,
      );

      // Guarda el array actualizado
      await AsyncStorage.setItem("notas", JSON.stringify(updateNotes));

      // Actualiza el estado local de la nota para reflejar cambios en pantalla
      setNote({ ...note, title, shortdescription, date, description });
      // Sale del modo edicion
      setIsEditing(false);
      Alert.alert("Nota actualizada", "Tu nota se ha actualizado con éxito!");
    } catch (error) {
      console.error("Error al editar la nota:", error);
      Alert.alert("Error", "No se pudo editar la nota.");
    }
  };

  // Funcion: Eliminar nota con confirmacion previa
  const deleteNote = async () => {
    Alert.alert(
      "IMPORTANTE",
      "Estás seguro que deseas eliminar esta nota?",
      [
        {
          text: "Cancelar",
          style: "cancel", // estilo gris de cancelacion
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              //Obtener notas guardadas
              const storedNotes = await AsyncStorage.getItem("notas");
              const notes = storedNotes ? JSON.parse(storedNotes) : [];

              //Filtra para eliminar la nota con el id coincidente
              const updateNotes = notes.filter((n: any) => n.id !== note.id);

              //Guarda la lista actualizada en AsyncStorage
              await AsyncStorage.setItem("notas", JSON.stringify(updateNotes));
              Alert.alert("Nota eliminada", "Nota eliminada con éxito.");

              // Regresa a la pantalla principal despues de eliminar
              router.push("/");
            } catch (error) {
              console.error("Error al eliminar la nota:", error);
              Alert.alert("Error", "No se pudo eliminar la nota.");
            }
          },
        },
      ],
      { cancelable: false }, // No se puede cerrar tocando fuera del alert
    );
  };

  return (
    <ScrollView contentContainerStyle={detailNoteStyle.scrollContainer}>
      <View style={detailNoteStyle.card}>
        <Text style={detailNoteStyle.title}>Note</Text>
        {/* fila superior: titulo + botons de accion*/}
        <View
          style={{
            justifyContent: "space-between",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {/* Muestra TextInput en modo edición o Text en modo visualización */}
          {isEditing ? (
            <TextInput
              style={detailNoteStyle.description}
              value={title}
              onChangeText={setTitle}
              placeholder="Título"
            />
          ) : (
            <Text style={detailNoteStyle.description}>{note?.title}</Text>
          )}
          {/* Botones de acción: exportar PDF, editar/cerrar y eliminar */}
          <View style={{ flexDirection: "row", gap: 10, marginTop: 25 }}>
            {/* Boton exportar PDF */}
            <TouchableOpacity onPress={exportPDF}>
              <Ionicons name="document" size={24} color="#4A90E2" />
            </TouchableOpacity>

            {/* Boton editar: muestra "close" si esta editando
                o "pencil" si no */}
            <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
              <Ionicons
                name={isEditing ? "close" : "pencil"}
                size={24}
                color="#4A90E2"
              />
            </TouchableOpacity>

            {/* Boton eliminar */}
            <TouchableOpacity onPress={deleteNote}>
              <Ionicons name="trash" size={24} color="#FB4E4E" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Contenido: Muestra formulario en edicion
            o texto en visualizacion */}
        {isEditing ? (
          <>
            {/* Campo descripcion corta */}
            <TextInput
              style={detailNoteStyle.date}
              value={shortdescription}
              onChangeText={setShortdescription}
              placeholder="Descripción corta"
            />

            {/* Campo fecha: al presionar abre calendario */}
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <TextInput
                style={detailNoteStyle.date}
                value={date}
                placeholder="Fecha"
                editable={false}
              />
            </TouchableOpacity>

            {/* Selector fecha nativo, visible solo cuando
                ShowDatePicker es true*/}
            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="default"
                onChange={onDateChange}
                minimumDate={new Date()}
              />
            )}

            {/* Campo descripcion larga, multiline permite 
                multipline lineas */}
            <TextInput
              style={detailNoteStyle.description}
              value={description}
              onChangeText={setDescription}
              placeholder="Descripción"
              multiline
            />

            {/* Boton para guardar los cambios */}
            <TouchableOpacity
              onPress={editNote}
              style={{
                marginTop: 15,
                backgroundColor: "#4A90E2",
                padding: 12,
                borderRadius: 8,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>
                Guardar cambios
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* Modo visualizacion: muestra datos de la nota */}
            <Text style={detailNoteStyle.date}>{note?.date}</Text>
            <Text style={detailNoteStyle.description}>{note?.description}</Text>
          </>
        )}
      </View>
    </ScrollView>
  );
}
