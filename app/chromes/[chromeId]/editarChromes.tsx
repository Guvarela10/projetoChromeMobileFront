import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Chrome {
  serialNumber: string;
}

export default function EditarChrome() {
  const router = useRouter();
  const [chromes, setChromes] = useState<Chrome>({
    serialNumber: "",
  });
  const { chromeId } = useLocalSearchParams();

   useEffect(() => {
      async function fetchChrome() {
        try {
          const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/chromes/${chromeId}`);
          const data = await response.json();
          setChromes({ serialNumber: data.serialNumber });
        } catch (error) {
          Alert.alert("Erro", "Não foi possível carregar os dados do aluno.");
        }
      }
  
      fetchChrome();
    }, [chromeId]);

  async function editarChrome() {
    const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/chromes/${chromeId}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        serialNumber: chromes.serialNumber,
      }),
    });

    if (response.ok) {
      Alert.alert("Sucesso", "Chromebook atualizado com sucesso!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } else {
      Alert.alert("Erro", "Não foi possível atualizar o Chromebook.");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Chromebook</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Número de Série:</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o número de série"
          placeholderTextColor="#888"
          value={chromes.serialNumber}
          onChangeText={(text) =>
            setChromes({ ...chromes, serialNumber: text })
          }
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={editarChrome}>
        <Text style={styles.buttonText}>Salvar Alterações</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#007AFF",
    textAlign: "center",
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    ...(Platform.OS === 'web' && {
      cursor: "pointer",
    }),
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
