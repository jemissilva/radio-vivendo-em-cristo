import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

const actions = [
  { label: "Programas", icon: "radio", route: "/(tabs)/programas" as const },
  { label: "Conteúdos", icon: "play-circle", route: "/(tabs)/conteudos" as const },
  { label: "Eventos", icon: "calendar", route: "/(tabs)/eventos" as const },
  { label: "Contato", icon: "chatbubble", route: "/(tabs)/mais" as const },
];

export function QuickActions() {
  return (
    <View style={styles.grid}>
      {actions.map((action) => (
        <Pressable key={action.label} style={styles.card} onPress={() => router.push(action.route)}>
          <Ionicons name={action.icon as never} size={24} color="#f59e0b" />
          <Text style={styles.label}>{action.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  card: {
    width: "47%",
    backgroundColor: "#0f172a",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1e293b",
    gap: 10,
  },
  label: {
    color: "#f8fafc",
    fontWeight: "700",
  },
});