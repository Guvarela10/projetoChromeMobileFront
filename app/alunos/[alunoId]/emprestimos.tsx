import { useIsFocused } from "@react-navigation/native"
import { useLocalSearchParams } from "expo-router"
import { useEffect, useRef, useState } from "react"
import {
    Animated,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity
} from "react-native"

interface Emprestimo {
    id: string
    chromeId: string,
    status: string
}

export default function ListaEmprestimos() {
    const [emprestimos, setEmprestimos] = useState<Emprestimo[]>([])
    const { alunoId } = useLocalSearchParams();
    const telaFocada = useIsFocused()
    const scaleAnim = useRef(new Animated.Value(1)).current


    useEffect(() => {
        async function fetchEmprestimos() {
            try {
                const response = await fetch(`http://10.21.144.201:3000/emprestimos/${alunoId}/`)
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
        <>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Lista de Emprestimos</Text>

                {emprestimos.map((emprestimo) => (
                    <TouchableOpacity key={emprestimo.id} style={styles.card} activeOpacity={0.7}>
                        <Text style={styles.cardText}>ID: {emprestimo.id}</Text>
                        <Text style={styles.cardText}>Chrome ID: {emprestimo.chromeId}</Text>
                        <Text style={styles.cardText}>Status: {emprestimo.status}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
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
