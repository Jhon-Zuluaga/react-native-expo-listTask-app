import { StyleSheet } from "react-native";

export const homeStyles = StyleSheet.create({
  main: {
    flex: 1,
    paddingTop: 60,
  },
  title: {
    marginTop: 60,
    textAlign: "center",
    fontSize: 24,
    fontStyle: "italic",
    fontWeight: "600",
  },
  buttonAdd: {
    backgroundColor: "#FB4E4E",
    marginHorizontal: 20,
    borderRadius: 20,
    paddingVertical: 5,
    marginTop: 30,
  },
  textButtonAdd: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
  },
  listContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  noteCard: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 15,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  noteDate: {
    fontSize: 14,
    color: "#888",
    marginBottom: 5,
  },
  noteShortDesc: {
    fontSize: 16,
    color: "#666",
  },
});
