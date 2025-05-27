import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";

interface Chrome {
    serialNumber: string
}

export default function CriarChrome() {
    const router = useRouter()
    const [chromes, setChromes] = useState<Chrome>({
        serialNumber: ''
    })
    const { chromeId } = useLocalSearchParams()

    async function editarChrome() {
        const response = await fetch(`http://10.21.144.201:3000/chromes/${chromeId}`, {
            method: "PUT",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                serialNumber: chromes.serialNumber
            })
        })
        if (response.ok) {
            Alert.alert('Sucesso',
                'Chromebook atualizado',
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
                'Chromebook não atualizado!',
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
            </View>
            <View>
                <Button onPress={editarChrome} title="Salvar"></Button>
            </View>
        </>
    )
}

