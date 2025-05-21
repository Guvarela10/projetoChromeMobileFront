import { useRouter } from "expo-router"
import { useState } from "react"
import { Alert, Button, Text, TextInput, View } from "react-native"

 interface Aluno {
        name: string
        matricula: string
    }

export default function CriarAluno() {

    const router = useRouter()
    const [alunos, setAlunos] = useState<Aluno>({
        name: '',
        matricula: ''
    })

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
        })
        if (response.ok) {
            Alert.alert('Sucesso',
                'Aluno cadastrado!',
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
                'Aluno não cadastrado'
            )
        }
    }

    return (
        <View>
            <Text>Nome do Aluno: </Text>
            <TextInput
                placeholder="Digite o nome do aluno:"
                value={alunos.name}
                onChangeText={(newName) => {
                    setAlunos({ ...alunos, name: newName })
                }}
            />

            <View>
                <Text>Matrícula do Aluno: </Text>
                <TextInput
                    placeholder="Digite a matrícula do aluno:"
                    value={alunos.matricula}
                    onChangeText={(newMatricula) => {
                        setAlunos({ ...alunos, matricula: newMatricula })
                    }}
                />
            </View>
            <View>
                <Button onPress={salvarAluno} title="Salvar" />
            </View>
        </View>

    )
}