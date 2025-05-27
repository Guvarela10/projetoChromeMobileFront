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

interface Chrome {
    serialNumber: string;
}

export default function CriarChrome() {
    const router = useRouter();
    const [chromes, setChromes] = useState<Chrome>({
        serialNumber: ''
    });

    async function salvarChrome() {
        const response = await fetch('http://192.168.15.37:3000/chromes', {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                serialNumber: chromes.serialNumber
            })
        });

        if (response.ok) {
            Alert.alert('Sucesso', 'Chromebook cadastrado!', [
                { text: "OK", onPress: () => router.back() }
            ]);
        } else {
            Alert.alert('Erro', 'Chromebook não cadastrado!');
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Cadastrar Chromebook</Text>

            <Text style={styles.label}>Número de Série:</Text>
            <TextInput
                style={styles.input}
                placeholder="Digite o número de série"
                placeholderTextColor="#aaa"
                value={chromes.serialNumber}
                onChangeText={(text) => setChromes({ ...chromes, serialNumber: text })}
            />

            <TouchableOpacity style={styles.button} onPress={salvarChrome}>
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
