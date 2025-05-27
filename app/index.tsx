import { StyleSheet, Text, View } from "react-native";

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo(a) ao sistema para gerenciar Chromebooks!</Text>
      <Text style={styles.subtitle}>Use a barra abaixo para navegar 🧭</Text>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Developed by Gustavo</Text>
      </View>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {

    alignItems: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#555",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#f2f2f2",
    paddingVertical: 12,
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  footerText: {
    color: "#666",
    fontSize: 14,
  },
});
