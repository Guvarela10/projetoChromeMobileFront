import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { Link } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    Alert,
    Animated,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";

interface Chrome {
    id: string;
    serialNumber: string;
    isBorrowed: boolean;
}

export default function ListaChromes() {
    const [chromes, setChromes] = useState<Chrome[]>([]);
    const telaFocada = useIsFocused();
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        fetchChromes();
    }, [telaFocada]);

    async function fetchChromes() {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/chromes`);
            const body = await response.json();
            setChromes(body);
        } catch (error) {
            console.log("Erro ao buscar chromes: " + error);
        }
    }

    function confirmarExclusao(id: string) {
        Alert.alert(
            "Confirmar Exclusão",
            "Deseja realmente excluir este Chromebook?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Excluir", style: "destructive", onPress: () => deletarChrome(id) }
            ]
        );
    }

    async function deletarChrome(id: string) {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/chromes/delete/${id}`, {
                method: "DELETE"
            });

            if (response.ok) {
                Alert.alert("Sucesso", "Chromebook excluído com sucesso!");
                setChromes(del => del.filter(chrome => chrome.id !== id));
            } else {
                Alert.alert("Erro", "Não foi possível excluir o Chromebook!");
            }
        } catch (error) {
            Alert.alert("Erro", "Erro ao excluir: " + error);
        }
    }

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.92,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
        }).start();
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text> </Text>
                <Text> </Text>
                <Text style={styles.titulo}>Lista de Chromebooks</Text>

                {chromes.length === 0 ? (
                    <View style={styles.semDados}>
                        <Text style={styles.semDadosTexto}>
                            Nenhum Chromebook cadastrado.{"\n"}Clique no botão + para adicionar.
                        </Text>
                    </View>
                ) : (
                    chromes.map((chrome) => (
                        <View key={chrome.id} style={styles.card}>
                            {/* Bolinha de status */}
                            <View
                                style={[
                                    styles.statusDot,
                                    { backgroundColor: chrome.isBorrowed ? "#FF3B30" : "#34C759" } 
                                    // vermelho se emprestado (true), verde se disponível (false)
                                ]}
                            />

                            <Link
                                href={{
                                    pathname: "/chromes/[chromeId]/editarChromes",
                                    params: { chromeId: chrome.id }
                                }}
                                asChild
                            >
                                <TouchableOpacity style={styles.editButton}>
                                    <AntDesign name="edit" size={20} color="#007AFF" />
                                </TouchableOpacity>
                            </Link>

                            <TouchableOpacity
                                style={[styles.editButton, { right: 50 }]}
                                onPress={() => confirmarExclusao(chrome.id)}
                            >
                                <MaterialIcons name="delete" size={20} color="#FF3B30" />
                            </TouchableOpacity>

                            <Link
                                href={{
                                    pathname: "/chromes/[chromeId]/criarEmprestimos",
                                    params: { chromeId: chrome.id }
                                }}
                                asChild
                            >
                                <TouchableOpacity activeOpacity={0.7}>
                                    <View style={{ paddingTop: 10 }}>
                                        <Text style={styles.cardText}>ID: {chrome.id}</Text>
                                        <Text style={styles.cardText}>Serial Number: {chrome.serialNumber}</Text>
                                    </View>
                                </TouchableOpacity>
                            </Link>
                        </View>
                    ))
                )}
            </ScrollView>

            <Link href={"/chromes/criarChrome"} asChild>
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
    );
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
    statusDot: {
        position: 'absolute',
        top: 12,
        left: 12,
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        zIndex: 10,
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
    semDados: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 40,
    },
    semDadosTexto: {
        fontSize: 18,
        color: "#666",
        textAlign: "center",
        paddingHorizontal: 20,
        lineHeight: 26,
    },
});
