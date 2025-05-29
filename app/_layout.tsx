import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

const shouldShowCreateChrome = false; // Defina como `false` para não exibir a aba

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
      {shouldShowCreateChrome && (
        <Tabs.Screen
          name="chromes/criarChrome"
          options={{
          }}
          />
        )}

        {shouldShowCreateChrome && (
        <Tabs.Screen
          name="alunos/criar"
          options={{
          }}
          />
        )}

        {shouldShowCreateChrome && (
        <Tabs.Screen
          name="chromes/criarChrome"
          options={{
          }}
          />
        )}

        
    </Tabs>
  );



}
