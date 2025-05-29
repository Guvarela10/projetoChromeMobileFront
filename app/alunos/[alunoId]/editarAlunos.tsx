import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Aluno {
  name: string;
  matricula: string;
}

export default function EditarAluno() {
  const router = useRouter();
  const [alunos, setAlunos] = useState<Aluno>({
    name: "",
    matricula: "",
  });
  const { alunoId } = useLocalSearchParams();

  async function editarAluno() {
    const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/alunos/${alunoId}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        name: alunos.name,
        matricula: alunos.matricula,
      }),
    });

    if (response.ok) {
      Alert.alert("Sucesso", "Aluno atualizado com sucesso!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } else {
      Alert.alert("Erro", "Não foi possível atualizar o aluno.");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Aluno</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nome:</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o nome"
          placeholderTextColor="#888"
          value={alunos.name}
          onChangeText={(text) => setAlunos({ ...alunos, name: text })}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Matrícula:</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite a matrícula"
          placeholderTextColor="#888"
          value={alunos.matricula}
          onChangeText={(text) => setAlunos({ ...alunos, matricula: text })}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={editarAluno}>
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
    ...(Platform.OS === "web" && {
      cursor: "pointer",
    }),
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
