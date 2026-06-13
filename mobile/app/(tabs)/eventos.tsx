import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SectionHeader } from "@/src/components/section-header";
import { useAppData } from "@/src/context/app-context";
import { formatDateTime } from "@/src/utils/formatters";

export default function EventsScreen() {
  const { events } = useAppData();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <SectionHeader
          title="Eventos"
          subtitle="Campanhas, cultos especiais e encontros da igreja."
        />

        {events.map((event) => (
          <View key={event.id} style={styles.card}>
            <Text style={styles.title}>{event.title}</Text>
            <Text style={styles.meta}>{formatDateTime(event.startAt)}</Text>
            {event.location ? <Text style={styles.location}>{event.location}</Text> : null}
            <Text style={styles.description}>{event.description}</Text>
            {event.externalUrl ? (
              <Pressable onPress={() => Linking.openURL(event.externalUrl!)} style={styles.button}>
                <Text style={styles.buttonText}>Abrir link do evento</Text>
              </Pressable>
            ) : null}
          </View>
        ))}
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
    gap: 8,
  },
  title: {
    color: "#f8fafc",
    fontSize: 18,
    fontWeight: "800",
  },
  meta: {
    color: "#f59e0b",
    fontSize: 13,
  },
  location: {
    color: "#e2e8f0",
    fontSize: 14,
    fontWeight: "600",
  },
  description: {
    color: "#cbd5e1",
    fontSize: 14,
    lineHeight: 21,
  },
  button: {
    marginTop: 8,
    backgroundColor: "#f59e0b",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#08101f",
    fontWeight: "800",
  },
});