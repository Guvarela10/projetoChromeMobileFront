import { useRouter } from "expo-router";
import { useState } from "react";
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
    name: string;
    matricula: string;
}

export default function CriarAluno() {
    const router = useRouter();
    const [alunos, setAlunos] = useState<Aluno>({
        name: '',
        matricula: ''
    });

    async function salvarAluno() {
        const response = await fetch('http://10.21.144.201:3000/alunos', {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                name: alunos.name,
                matricula: alunos.matricula
            })
        });

        console.log('responde prr', response)

        if (response.ok) {
            Alert.alert('Sucesso', 'Aluno cadastrado!', [
                { text: "OK", onPress: () => router.back() }
            ]);
        } else {
            Alert.alert('Erro', 'Aluno não cadastrado!');
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Cadastrar Aluno</Text>

            <Text style={styles.label}>Nome do Aluno:</Text>
            <TextInput
                style={styles.input}
                placeholder="Digite o nome do aluno"
                placeholderTextColor="#aaa"
                value={alunos.name}
                onChangeText={(text) =>
                    setAlunos({ ...alunos, name: text })
                }
            />

            <Text style={styles.label}>Matrícula do Aluno:</Text>
            <TextInput
                style={styles.input}
                placeholder="Digite a matrícula do aluno"
                placeholderTextColor="#aaa"
                value={alunos.matricula}
                onChangeText={(text) =>
                    setAlunos({ ...alunos, matricula: text })
                }
            />

            <TouchableOpacity style={styles.button} onPress={salvarAluno}>
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
