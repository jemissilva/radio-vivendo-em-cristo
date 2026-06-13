import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SectionHeader } from "@/src/components/section-header";
import { useAppData } from "@/src/context/app-context";

export default function ProgramsScreen() {
  const { programs, schedule } = useAppData();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <SectionHeader
          title="Programas"
          subtitle="Conheça os programas e horários da Rádio Vivendo em Cristo."
        />

        {programs.map((program) => {
          const entries = schedule.filter((entry) => entry.programId === program.id);
          return (
            <View key={program.id} style={styles.card}>
              <Text style={styles.title}>{program.name}</Text>
              <Text style={styles.host}>Com {program.hostName}</Text>
              <Text style={styles.description}>{program.description}</Text>
              <View style={styles.scheduleList}>
                {entries.map((entry) => (
                  <Text key={entry.id} style={styles.scheduleItem}>
                    • {entry.startTime} às {entry.endTime}
                  </Text>
                ))}
              </View>
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
    gap: 8,
  },
  title: {
    color: "#f8fafc",
    fontSize: 20,
    fontWeight: "800",
  },
  host: {
    color: "#f59e0b",
    fontSize: 14,
    fontWeight: "700",
  },
  description: {
    color: "#cbd5e1",
    fontSize: 14,
    lineHeight: 21,
  },
  scheduleList: {
    marginTop: 6,
    gap: 4,
  },
  scheduleItem: {
    color: "#94a3b8",
    fontSize: 13,
  },
});