import { AntDesign, MaterialIcons } from '@expo/vector-icons'
import { useIsFocused } from "@react-navigation/native"
import { Link } from "expo-router"
import { useEffect, useRef, useState } from "react"
import {
  Alert,
  Animated,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native"

interface Aluno {
  id: string
  name: string
  matricula: string
}

export default function ListaAlunos() {
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const telaFocada = useIsFocused()
  const scaleAnim = useRef(new Animated.Value(1)).current

  useEffect(() => {
    async function fetchAlunos() {
      const response = await fetch("http://10.21.144.201:3000/alunos")
      const body = await response.json()
      setAlunos(body)
    }
    fetchAlunos()
  }, [telaFocada])

  function confirmarExclusao(id: string) {
          Alert.alert(
              "Confirmar Exclusão",
              "Deseja realmente excluir este aluno?",
              [
                  { text: "Cancelar", style: "cancel" },
                  { text: "Excluir", style: "destructive", onPress: () => deletarAluno(id) }
              ]
          )
      }
  
      async function deletarAluno(id: string) {
          try {
              const response = await fetch(`http://10.21.144.201:3000/alunos/delete/${id}`, {
                  method: "DELETE"
              })
  
              if (response.ok) {
                  Alert.alert("Sucesso", "Chromebook excluído com sucesso!")
                  setAlunos(del => del.filter(aluno => aluno.id !== id))
              } else {
                  Alert.alert("Erro", "Não foi possível excluir o aluno!")
              }
          } catch (error) {
              Alert.alert("Erro", "Erro ao excluir: " + error)
          }
      }

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.92,
      useNativeDriver: true,
    }).start()
  }

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start()
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.titulo}>Lista de Alunos</Text>

        {alunos.map((aluno) => (
                <View key={aluno.id} style={styles.card}>
                    {/* Botão editar */}
                    <Link
                        href={{
                            pathname: "/alunos/[alunoId]/editarAlunos",
                            params: { alunoId: aluno.id }
                        }}
                        asChild
                    >
                        <TouchableOpacity style={styles.editButton}>
                            <AntDesign name="edit" size={20} color="#007AFF" />
                        </TouchableOpacity>
                    </Link>

                    {/* Botão excluir */}
                    <TouchableOpacity
                        style={[styles.editButton, { right: 50 }]}
                        onPress={() => confirmarExclusao(aluno.id)}
                    >
                        <MaterialIcons name="delete" size={20} color="#FF3B30" />
                    </TouchableOpacity>

                    {/* Card principal */}
                    <Link
                        href={{
                            pathname: "/alunos/[alunoId]/emprestimos",
                            params: { alunoId: aluno.id }
                        }}
                        asChild
                    >
                        <TouchableOpacity activeOpacity={0.7}>
                            <View style={{ paddingTop: 10 }}>
                                <Text style={styles.cardText}>ID: {aluno.id}</Text>
                                <Text style={styles.cardText}>Nome: {aluno.name}</Text>
                                <Text style={styles.cardText}>Nome: {aluno.matricula}</Text>
                            </View>
                        </TouchableOpacity>
                    </Link>
                </View>
            ))}
      </ScrollView>

      <Link href={"/alunos/criar"} asChild>
        <TouchableWithoutFeedback
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <Animated.View style={[styles.fab, { transform: [{ scale: scaleAnim }] }]}>
            <AntDesign name="plus" size={28} color="#fff" />
          </Animated.View>
        </TouchableWithoutFeedback>
      </Link>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
    alignItems: 'center', // centraliza os cards horizontalmente
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
    color: "#007AFF",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
    borderLeftWidth: 6,
    borderLeftColor: "#007AFF",
    borderWidth: 2,
    borderColor: "#000000",

    // Ajuste de proporção
    width: '100%',
    maxWidth: 400,
    minHeight: 130,
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#444",
    marginBottom: 6,
  },
  valor: {
    fontWeight: "400",
    color: "#111",
    fontSize: 16,
  },
  cardText: {
        fontSize: 18,
        fontWeight: "600",
        color: "#222"
    },
     editButton: {
        position: "absolute",
        top: 10,
        right: 10,
        zIndex: 2,
        padding: 6,
        backgroundColor: "#e6f0ff",
        borderRadius: 8,
    },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: "#007AFF",
    width: 70,
    height: 70,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    ...(Platform.OS === 'web' && {
      transition: 'all 0.2s ease-in-out',
      cursor: 'pointer',
    }),
  },
})
