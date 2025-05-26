import { MaterialIcons } from "@expo/vector-icons"
import { useIsFocused } from "@react-navigation/native"
import { useLocalSearchParams } from "expo-router"
import { useEffect, useRef, useState } from "react"
import {
    Alert,
    Animated,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity
} from "react-native"

interface Emprestimo {
    id: string
    chromeId: string,
    status: string,
}

interface Chromes {
    id: string
    serialNumber: string
}

export default function ListaEmprestimos() {
    const [emprestimos, setEmprestimos] = useState<Emprestimo[]>([])
    const { alunoId } = useLocalSearchParams();
    const telaFocada = useIsFocused()
    const scaleAnim = useRef(new Animated.Value(1)).current
    const [chromes, setChromes] = useState<Chromes[]>([])


    useEffect(() => {
        async function fetchEmprestimos() {
            try {
                const response = await fetch(`http://192.168.15.37:3000/emprestimos/${alunoId}/`)
                const body = await response.json()
                setEmprestimos(body)
            } catch (error) {
                console.log(
                    "Não foi possível conectar ao servidor e puxar a lista de emprestimos: " +
                    error
                )
            }
        }
        fetchEmprestimos()
    }, [telaFocada])

    useEffect(() => {
        async function fetchChromes() {
            try {
                const response = await fetch(`http://192.168.15.37:3000/chromes`)
                const body = await response.json()
                setChromes(body)
            } catch (error) {
                console.log(
                    "Não foi possível conectar ao servidor e puxar a lista de emprestimos: " +
                    error
                )
            }
        }
        fetchChromes()
    }, [telaFocada])

    function confirmarExclusao(id: string) {
            Alert.alert(
                "Confirmar Exclusão",
                "Deseja realmente excluir este emprestimo?",
                [
                    { text: "Cancelar", style: "cancel" },
                    { text: "Excluir", style: "destructive", onPress: () => deletarEmprestimo(id) }
                ]
            )
        }
    
        async function deletarEmprestimo(id: string) {
            try {
                const response = await fetch(`http://192.168.15.37:3000/emprestimos/delete/${id}`, {
                    method: "DELETE"
                })

                // console.log('responde porra')
                // console.log(response)
    
                if (response.ok) {
                    Alert.alert("Sucesso", "Emprestimo excluído com sucesso!")
                    setEmprestimos(del => del.filter(emprestimo => emprestimo.id !== id))
                } else {
                    Alert.alert("Erro", "Não foi possível excluir o emprestimo!")
                }
            } catch (error) {
                Alert.alert("Erro", "Erro ao excluir: " + error)
            }
        }

    return (
        <>

            {emprestimos.map((emprestimo) => {
                const chrome = chromes.find(c => c.id === emprestimo.chromeId)
                return (
                    <TouchableOpacity key={emprestimo.id} style={styles.card} activeOpacity={0.7}>
                        <Text style={styles.cardText}>ID: {emprestimo.id}</Text>
                        <Text style={styles.cardText}>Status: {emprestimo.status}</Text>
                        <Text style={styles.cardText}>
                            Serial Number: {chrome ? chrome.serialNumber : 'Carregando...'}
                        </Text>
                        {/* Botão excluir */}
                        <TouchableOpacity
                            style={[styles.editButton, { right: 50 }]}
                            onPress={() => confirmarExclusao(emprestimo.id)}
                        >
                            <MaterialIcons name="delete" size={20} color="#FF3B30" />
                        </TouchableOpacity>
                    </TouchableOpacity>
                )
            })}


            {/* <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Lista de Emprestimos</Text>

                {emprestimos.map((emprestimo) => (
                    <TouchableOpacity key={emprestimo.id} style={styles.card} activeOpacity={0.7}>
                        <Text style={styles.cardText}>ID: {emprestimo.id}</Text>
                        <Text style={styles.cardText}>Chrome ID: {emprestimo.chromeId}</Text>
                        <Text style={styles.cardText}>Status: {emprestimo.status}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView> */}
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingBottom: 120, // pra não ficar embaixo do botão flutuante
        backgroundColor: "#f2f2f2"
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        marginBottom: 20,
        color: "#333"
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
        // força largura pra evitar mudanças de tamanho
        width: "100%"
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
        })
    }
})
