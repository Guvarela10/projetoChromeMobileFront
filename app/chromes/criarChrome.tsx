import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";

interface Chrome {
    serialNumber: string
    status: string
}

export default function CriarChrome() {
    const router = useRouter()
    const [chromes, setChromes] = useState<Chrome>({
        serialNumber: '',
        status: ''
    })

    async function salvarChrome() {
        const response = await fetch('http://10.21.144.201:3000/chromes', {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                serialNumber: chromes.serialNumber,
                status: chromes.status
            })
        })
        if (response.ok) {
            Alert.alert('Sucesso',
                'Chromebook cadastrado!',
                [
                    {
                        text: "OK", onPress: () => {
                            router.back()
                        }
                    }
                ]
            )
        } else {
            Alert.alert('Erro',
                'Chromebook não cadastrado!',
            )
        }
    }

    return (
        <>
            <View>
                <Text>
                    Número de Série do Chromebook: </Text>
                <TextInput placeholder="Digite o número de série:"
                    value={chromes.serialNumber}
                    onChangeText={(newSerial) => {
                        setChromes({ ...chromes, serialNumber: newSerial })
                    }}
                />
                <Text>
                    Status: </Text>
                <TextInput placeholder="Digite o status:"
                    value={chromes.status}
                    onChangeText={(newStatus) => {
                        setChromes({ ...chromes, status: newStatus })
                    }}
                />
            </View>
            <View>
                <Button onPress={salvarChrome} title="Salvar"></Button>
            </View>
        </>
    )
}