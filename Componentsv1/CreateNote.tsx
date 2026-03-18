import { createNoteStyle } from "@/styles/createNoteStyle";
// Async permite guardar datos localmente en el dispositivo como una db
import AsyncStorage from "@react-native-async-storage/async-storage";

// DateTimePicker componente para seleccionar fechas en calendar
import DateTimePicker from "@react-native-community/datetimepicker";

// UseRouter; hook de expo router para navegar entre pabtallas
import { useRouter } from "expo-router";

// useState: hook de react para manejar estado de componente
import { useState } from "react";

// Componentes nativos de React Native
import {
  Alert,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function CreateNote() {
  // Hook navegacion entre pantallas
  const router = useRouter();

  // Estados para cada campo de formulario
  const [title, setTitle] = useState("");
  const [shortdescription, setShortdescription] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  // Controla si el calendario esta visible
  const [showDatePicker, setshowDatePicker] = useState(false);
  // Fecha seleccionada como objeto date
  const [selectedDate, setselectedDate] = useState(new Date());

  // Funcion que abre el selector de fecha (calendar)
  const showDatePickerHandler = () => {
    setshowDatePicker(true);
  };

  // Funcion que ejecuta cuando el usuario selecciona o cancela fecha
  const onDateChange = (event: any, date?: Date) => {
    // En Ios lo mantiene abierto, en Android automaticamente
    setshowDatePicker(Platform.OS === "ios");

    // Solo actualiza fecha si el usuario no cancelo
    if (event.type !== "dismissed" && date) {
      setselectedDate(date);
      // Convierte el objeto date a formato ESP
      setDate(date.toLocaleDateString("es-ES"));
    }
  };

  // Funcion para guardar nota en AsyncStorage
  const safeNote = async () => {
    // Validacion; Verifica todos los campos llenos
    if (!title || !shortdescription || !date || !description) {
      Alert.alert("Error", "Debe llenar todos los campos.");
      return; // Detiene ejecucion si hay campos vacios
    }

    try {
      // Crea el objeto de la nueva nota
      const newNote = {
        id: Date.now().toString(), // ID unico basado en timestamp actual
        title,
        shortdescription,
        date,
        description,
      };

      // Obtiene las notas existentes de AsyncStorage
      const storedNotes = await AsyncStorage.getItem("notas");
      // Si hay notas convierte en JSON array y si crea un vacio
      const notes = storedNotes ? JSON.parse(storedNotes) : [];

      // Agrega la nueva nota al array
      notes.push(newNote);
      // Guarda el array actualizado en AsyncStorage como JSON
      await AsyncStorage.setItem("notas", JSON.stringify(notes));

      //limpiar los campos despues de guardar
      setTitle("");
      setShortdescription("");
      setDate("");
      setDescription("");
      Alert.alert("Nota guardada", "Tu nota se ha guardado exitosamente!!");
      // Navega de regreso a la pagina principal
      router.push("/");
    } catch (error) {
      console.error("Error al guardar la nota:", error);
      Alert.alert("Error", "No se pudo guardar la nota.");
    }
  };

  return (
    // ScrollView permite hacer scroll si hay contenido larga
    <ScrollView contentContainerStyle={createNoteStyle.scrollContainer}>
      <View style={createNoteStyle.main}>
        <Text style={createNoteStyle.title}>Create a Note</Text>

        <View style={createNoteStyle.card}>
          {/* Campo para titulo*/}
          <TextInput
            placeholder="Title"
            placeholderTextColor="slategray"
            value={title}
            onChangeText={setTitle} // Actualiza estado cada vez que el usuario escribe
            style={createNoteStyle.input}
          />
          {/* Campo para descripcion corta*/}
          <TextInput
            placeholder="Shortdescription"
            placeholderTextColor="slategray"
            value={shortdescription}
            onChangeText={setShortdescription}
            style={createNoteStyle.input}
          />
          {/* Boton que abre selector fecha al presionar*/}
          <TouchableOpacity
            style={createNoteStyle.input}
            onPress={showDatePickerHandler}
          >
            {/* Campo fecha solo lectura, se llena con DatePiker*/}
            <TextInput
              style={{ marginTop: 10 }}
              placeholder="Date"
              placeholderTextColor="slategray"
              value={date}
              onChangeText={setDate}
              editable={false} // Solo lectura, fecha selecciona con el calendar
            />
          </TouchableOpacity>
          {/*Selector de fecha nativo,
             solo se muestra showdatepicker cuando es true
          */}
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate} // Fecha actual seleccionada
              mode="date" // Solo seleccion fecha sin hora
              display="default" // Estilo nativo del dispositivo
              onChange={onDateChange} // Funcion que se ejecuta al seleccionar
              minimumDate={new Date()} // No permite seleccionar fechas pasadas
            />
          )}
          {/* Campo para la descripción larga */}
          <TextInput
            placeholder="Description"
            placeholderTextColor="slategray"
            value={description}
            onChangeText={setDescription}
            style={createNoteStyle.input}
          />
          {/* Boton para guardar nota */}
          <TouchableOpacity style={createNoteStyle.button} onPress={safeNote}>
            <Text style={createNoteStyle.buttonText}>Make a Note</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
