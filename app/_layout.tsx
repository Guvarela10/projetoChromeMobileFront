import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#007AFF",
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="alunos/alunos"
        options={{
          title: "Alunos",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chromes/chromes"
        options={{
          title: "Chromebooks",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="laptop-chromebook" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chromes/criarChrome"
        options={{
          href: null
        }}
      />
      <Tabs.Screen
        name="chromes/[chromeId]/criarEmprestimos"
        options={{
          href: null
        }}
      />
      /<Tabs.Screen
        name="chromes/[chromeId]/editarChromes"
        options={{
          href: null
        }}
      />
      <Tabs.Screen
        name="alunos/criar"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="alunos/[alunoId]/editarAlunos"
        options={{
          href: null
        }}
      />
      <Tabs.Screen
        name="alunos/[alunoId]/emprestimos"
        options={{
          href: null
        }}
      />
    </Tabs>
  );



}
