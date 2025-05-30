import { MaterialIcons } from "@expo/vector-icons"
import { useIsFocused } from "@react-navigation/native"
import { useLocalSearchParams } from "expo-router"
import { useEffect, useState } from "react"
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
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
    const [chromes, setChromes] = useState<Chromes[]>([])

    useEffect(() => {
        async function fetchEmprestimos() {
            try {
                const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/emprestimos/${alunoId}/`)
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
                const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/chromes`)
                const body = await response.json()
                setChromes(body)
            } catch (error) {
                console.log(
                    "Não foi possível conectar ao servidor e puxar a lista de Chromebooks: " +
                    error
                )
            }
        }
        fetchChromes()
    }, [telaFocada])

    function confirmarDesativacao(id: string) {
        Alert.alert(
            "Confirmar Desativação",
            "Deseja realmente desativar este empréstimo?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Sim", onPress: () => desativarEmprestimo(id) }
            ]
        )
    }

    async function desativarEmprestimo(id: string) {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/emprestimos/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "desativado" }),
            })

            if (response.ok) {
                Alert.alert("Sucesso", "Empréstimo desativado com sucesso!")
                setEmprestimos(prev =>
                    prev.map(e =>
                        e.id === id ? { ...e, status: "desativado" } : e
                    )
                )
            } else {
                Alert.alert("Erro", "Não foi possível desativar o empréstimo.")
            }
        } catch (error) {
            Alert.alert("Erro", "Erro ao desativar: " + error)
        }
    }

    function confirmarExclusao(id: string) {
        Alert.alert(
            "Confirmar Exclusão",
            "Deseja realmente excluir este empréstimo?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Excluir", style: "destructive", onPress: () => deletarEmprestimo(id) }
            ]
        )
    }

    async function deletarEmprestimo(id: string) {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/emprestimos/delete/${id}`, {
                method: "DELETE"
            })

            if (response.ok) {
                Alert.alert("Sucesso", "Empréstimo excluído com sucesso!")
                setEmprestimos(del => del.filter(emprestimo => emprestimo.id !== id))
            } else {
                Alert.alert("Erro", "Não foi possível excluir o empréstimo!")
            }
        } catch (error) {
            Alert.alert("Erro", "Erro ao excluir: " + error)
        }
    }

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text> </Text>
                <Text> </Text>
                <Text style={styles.titulo}>Lista de Empréstimos</Text>

                {emprestimos.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Nenhum empréstimo cadastrado.{"\n"}Clique no botão + para adicionar.</Text>
                    </View>
                ) : (
                    emprestimos.map((emprestimo) => {
                        const chrome = chromes.find(c => c.id === emprestimo.chromeId)

                        return (
                            <View key={emprestimo.id} style={styles.card}>
                                <TouchableOpacity
                                    style={[styles.editButton, { right: 10 }]}
                                    onPress={() => confirmarExclusao(emprestimo.id)}
                                >
                                    <MaterialIcons name="delete" size={20} color="#FF3B30" />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    style={{ paddingTop: 10 }}
                                    onPress={() => confirmarDesativacao(emprestimo.id)}
                                >
                                    <View>
                                        <Text style={styles.cardText}>ID: {emprestimo.id}</Text>
                                        <Text style={styles.cardText}>Status: {emprestimo.status}</Text>
                                        <Text style={styles.cardText}>
                                            Serial Number: {chrome ? chrome.serialNumber : 'Carregando...'}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        )
                    })

                )}
            </ScrollView>
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
        alignItems: 'center',
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
    emptyContainer: {
        alignItems: "center",
        marginTop: 50,
        paddingHorizontal: 20,
    },
    emptyText: {
        fontSize: 18,
        textAlign: "center",
        color: "#666",
    },
})
