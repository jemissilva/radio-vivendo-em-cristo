import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SectionHeader } from "@/src/components/section-header";
import { useAppData } from "@/src/context/app-context";
import { formatDuration } from "@/src/utils/formatters";

export default function ContentScreen() {
  const { content, favorites, toggleFavorite } = useAppData();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <SectionHeader
          title="Conteúdos"
          subtitle="Ouça mensagens, devocionais, louvores e podcasts."
        />

        {content.map((item) => {
          const isFavorite = favorites.includes(item.id);
          return (
            <View key={item.id} style={styles.card}>
              <View style={styles.header}>
                <View style={styles.flex}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.meta}>
                    {item.author} • {item.type} • {formatDuration(item.durationSeconds)}
                  </Text>
                </View>
                <Pressable onPress={() => toggleFavorite(item.id)} style={styles.favoriteButton}>
                  <Text style={styles.favoriteText}>{isFavorite ? "★" : "☆"}</Text>
                </Pressable>
              </View>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#08101f",
  },
  container: {
    padding: 20,
    gap: 16,
  },
  card: {
    backgroundColor: "#0f172a",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#1e293b",
    gap: 10,
  },
  header: {
    flexDirection: "row",
    gap: 12,
  },
  flex: {
    flex: 1,
  },
  title: {
    color: "#f8fafc",
    fontSize: 18,
    fontWeight: "800",
  },
  meta: {
    color: "#f59e0b",
    fontSize: 13,
    marginTop: 4,
  },
  description: {
    color: "#cbd5e1",
    fontSize: 14,
    lineHeight: 21,
  },
  favoriteButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#1e293b",
    alignItems: "center",
    justifyContent: "center",
  },
  favoriteText: {
    color: "#f8fafc",
    fontSize: 22,
  },
});