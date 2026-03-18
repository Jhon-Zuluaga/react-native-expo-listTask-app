// Importa el stack de expo-router para navegacion entre pantalla
import { Stack } from "expo-router";

// Componente principal que define la estructura 
// de navegacion de toda la app
export default function RootLayout() {
  return (
    // Stack: contenedor principal de navegacion
    // ScreenOptions: opciones globales que aplican todas las pantallas
    // headerShown: false -> oculta el header en todas las pantallas por defecto
    <Stack screenOptions={{ headerShown: false }}>

      {/* Pantalla principal home -> archivo app/index.tsx*/}
      <Stack.Screen
        name="index"
        options={{
          title: "Home",
          headerLeft: () => null,
        }}
      />

      {/* Pantalla de crear nota - archivo app/create-note.tsx*/}
      <Stack.Screen
        name="create-note"
        options={{ animation: "slide_from_right" }}
      />

      {/* Pantalla de detalle nota - archivo app/detail-note.tsx*/ }
      <Stack.Screen
        name="detail-note"
        options={{ animation: "slide_from_bottom" }}
      />
    </Stack>
  );
}
