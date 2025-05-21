import { AntDesign } from '@expo/vector-icons'
import { useIsFocused } from "@react-navigation/native"
import { Link } from "expo-router"
import { useEffect, useRef, useState } from "react"
import {
  Animated,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
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
      console.log('to aqui antes pora')
      const response = await fetch("http://10.21.144.201:3000/alunos")
      const body = await response.json()
      console.log("body", body)
      setAlunos(body)
    }
    fetchAlunos()
  }, [telaFocada])

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
          <Link
            key={aluno.id}
            href={{
              pathname: "/alunos/[alunoId]/emprestimos",
              params: { alunoId: aluno.id }
            }}
          >
            <View style={styles.card}>
              <Text style={styles.label}>
                Nome: <Text style={styles.valor}>{aluno.name}</Text>
              </Text>
              <Text style={styles.label}>
                Matrícula: <Text style={styles.valor}>{aluno.matricula}</Text>
              </Text>
              <Text style={styles.label}>
                ID: <Text style={styles.valor}>{aluno.id}</Text>
              </Text>
            </View>
          </Link>
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
