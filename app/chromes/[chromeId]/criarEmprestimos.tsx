import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { useIsFocused } from "@react-navigation/native";


interface Aluno {
    id: string
    name: string
    matricula: string
}

interface Emprestimo {
    alunoId: string,
    status: string
}

export default function CriarEmprestimo() {
    const router = useRouter()
    const { chromeId } = useLocalSearchParams()
    const { alunoId } = useLocalSearchParams()
    const telaFocada = useIsFocused()

    const [emprestimo, setEmprestimo] = useState<Emprestimo>({
        status: '',
        alunoId: ''
    })
    const [alunos, setAlunos] = useState<Aluno[]>([])

    const [selectedLanguage, setSelectedLanguage] = useState();

    useEffect(() => {
        async function fetchAlunos() {
            const response = await fetch("http://10.21.144.201:3000/alunos")
            const body = await response.json()
            setAlunos(body)
        }
        fetchAlunos()
    }, [telaFocada])



    async function salvarChrome() {
        const response = await fetch(`http://10.21.144.201:3000/chromes/${chromeId}/emprestimos`, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                status: emprestimo.status,
                alunoId: emprestimo.alunoId
            })
        })
        if (response.ok) {
            Alert.alert('Sucesso',
                'Emprestimo cadastrado!',
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
                'Emprestimo não cadastrado!',
            )
        }
    }

    return (
        <>
            {
                <View>
                    <Text>
                        Status: </Text>
                    <TextInput placeholder="Digite o número de série:"
                        value={emprestimo.status}
                        onChangeText={(newStatus) => {
                            setEmprestimo({ ...emprestimo, status: newStatus })
                        }}
                    />
                </View>

            }

            <Picker
                selectedValue={emprestimo.alunoId}
                onValueChange={(itemValue, itemIndex) =>
                    setEmprestimo({ ...emprestimo, alunoId: itemValue})
                }>
                {alunos.map((aluno) => (
                    <Picker.Item key={aluno.id} label={aluno.name} value={aluno.id} />
                ))}
            </Picker >
            <View>
                <Button onPress={salvarChrome} title="Salvar"></Button>
            </View>
        </>
    )
}