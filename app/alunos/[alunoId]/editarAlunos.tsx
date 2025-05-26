import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";

interface Aluno {
    name: string,
    matricula: string
}

export default function CriarAluno() {
    const router = useRouter()
    const [alunos, setAlunos] = useState<Aluno>({
        name: '',
        matricula: ''
    })
    const { alunoId } = useLocalSearchParams()

    async function editarAluno() {
        const response = await fetch(`http://192.168.15.37:3000/alunos/${alunoId}`, {
            method: "PUT",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                name: alunos.name,
                matricula: alunos.matricula
            })
        })
        if (response.ok) {
            Alert.alert('Sucesso',
                'Aluno atualizado',
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
                'Aluno não atualizado!',
            )
        }
    }

    return (
        <>
            <View>
                <Text>
                    Nome do aluno: </Text>
                <TextInput placeholder="Digite o nome:"
                    value={alunos.name}
                    onChangeText={(newName) => {
                        setAlunos({ ...alunos, name: newName })
                    }}
                />
                <Text>
                    Matricula do aluno: </Text>
                <TextInput placeholder="Digite a matricula:"
                    value={alunos.matricula}
                    onChangeText={(newMatricula) => {
                        setAlunos({ ...alunos, matricula: newMatricula })
                    }}
                />
            </View>
            <View>
                <Button onPress={editarAluno} title="Salvar"></Button>
            </View>
        </>
    )
}

