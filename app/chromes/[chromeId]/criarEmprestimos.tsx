import { Picker } from '@react-native-picker/picker';
import { useIsFocused } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

interface Aluno {
    id: string;
    name: string;
    matricula: string;
}

interface Emprestimo {
    alunoId: string;
    status: string;
}

export default function CriarEmprestimo() {
    const router = useRouter();
    const { chromeId } = useLocalSearchParams();
    const telaFocada = useIsFocused();

    const [emprestimo, setEmprestimo] = useState<Emprestimo>({
        status: '',
        alunoId: ''
    });

    const [alunos, setAlunos] = useState<Aluno[]>([]);

    useEffect(() => {
        async function fetchAlunos() {
            const response = await fetch("http://192.168.15.37:3000/alunos");
            const body = await response.json();
            setAlunos(body);
            if (body.length > 0) {
                setEmprestimo((prev) => ({ ...prev, alunoId: body[0].id }));
            }
        }
        fetchAlunos();
    }, [telaFocada]);

    async function salvarEmprestimo() {
        const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/chromes/${chromeId}/emprestimos`, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                status: emprestimo.status,
                alunoId: emprestimo.alunoId
            })
        });

        if (response.ok) {
            Alert.alert('Sucesso', 'Empréstimo cadastrado!', [
                { text: "OK", onPress: () => router.back() }
            ]);
        } else {
            Alert.alert('Erro', 'Empréstimo não cadastrado!');
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Cadastrar Empréstimo</Text>

            <Text style={styles.label}>Status do Empréstimo:</Text>
            <TextInput
                style={styles.input}
                placeholder="Digite o status (Ex: ativo)"
                placeholderTextColor="#aaa"
                value={emprestimo.status}
                onChangeText={(text) =>
                    setEmprestimo({ ...emprestimo, status: text })
                }
            />

            <Text style={styles.label}>Selecionar Aluno:</Text>
            <View style={styles.pickerWrapper}>
                <Picker
                    selectedValue={emprestimo.alunoId}
                    onValueChange={(value) =>
                        setEmprestimo({ ...emprestimo, alunoId: value })
                    }
                    style={styles.picker}
                >
                    {alunos.map((aluno) => (
                        <Picker.Item key={aluno.id} label={aluno.name} value={aluno.id} />
                    ))}
                </Picker>
            </View>

            <TouchableOpacity style={styles.button} onPress={salvarEmprestimo}>
                <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: '#f2f2f2',
        justifyContent: 'center',
    },
    title: {
        fontSize: 26,
        fontWeight: '700',
        marginBottom: 24,
        color: '#007AFF',
        textAlign: 'center'
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#333'
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 14,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 20
    },
    pickerWrapper: {
        backgroundColor: '#fff',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 24
    },
    picker: {
        width: '100%',
        height: 50
    },
    button: {
        backgroundColor: '#007AFF',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        ...(Platform.OS === 'web' && {
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out',
        })
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700'
    }
});
