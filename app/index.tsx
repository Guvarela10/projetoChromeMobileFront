import { Link } from "expo-router";
import { useRef } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const scaleAnim1 = useRef(new Animated.Value(1)).current;
  const scaleAnim2 = useRef(new Animated.Value(1)).current;

  function handlePressIn(anim: Animated.Value) {
    Animated.spring(anim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  }

  function handlePressOut(anim: Animated.Value) {
    Animated.spring(anim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }

  return (
    <View style={styles.container}>
      <Link href="/alunos" asChild>
        <TouchableOpacity
          activeOpacity={0.8}
          onPressIn={() => handlePressIn(scaleAnim1)}
          onPressOut={() => handlePressOut(scaleAnim1)}
        >
          <Animated.View style={[styles.button, { transform: [{ scale: scaleAnim1 }] }]}>
            <Text style={styles.buttonText}>Página de Alunos</Text>
          </Animated.View>
        </TouchableOpacity>
      </Link>

      <Link href="/chromes" asChild>
        <TouchableOpacity
          activeOpacity={0.8}
          onPressIn={() => handlePressIn(scaleAnim2)}
          onPressOut={() => handlePressOut(scaleAnim2)}
        >
          <Animated.View style={[styles.button, { backgroundColor: "#007AFF", transform: [{ scale: scaleAnim2 }] }]}>
            <Text style={styles.buttonText}>Página de Chromes</Text>
          </Animated.View>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: "#00A8FF", // azul vibrante padrão
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 12,
    marginVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 280,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    letterSpacing: 1,
  },
});
