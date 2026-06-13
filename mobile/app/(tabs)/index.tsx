import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HeroPlayerCard } from "@/src/components/hero-player-card";
import { QuickActions } from "@/src/components/quick-actions";
import { SectionCard } from "@/src/components/section-card";
import { useAppData } from "@/src/context/app-context";
import { formatDayOfWeek, formatDateTime } from "@/src/utils/formatters";

export default function HomeScreen() {
  const { live, schedule, content, events } = useAppData();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.eyebrow}>Igreja Vivendo em Cristo</Text>
        <Text style={styles.title}>Rádio oficial da igreja</Text>
        <Text style={styles.subtitle}>
          Ouça ao vivo, acompanhe a programação e receba mensagens que edificam sua fé.
        </Text>

        <HeroPlayerCard live={live} />
        <QuickActions />

        <SectionCard title="Programação de hoje" subtitle="Acompanhe os próximos horários">
          {schedule.slice(0, 4).map((entry) => (
            <View key={entry.id} style={styles.row}>
              <View>
                <Text style={styles.rowTitle}>{entry.program?.name ?? "Programa"}</Text>
                <Text style={styles.rowMeta}>
                  {formatDayOfWeek(entry.dayOfWeek)} • {entry.startTime} às {entry.endTime}
                </Text>
              </View>
              <Text style={styles.badge}>{entry.isLive ? "Ao vivo" : "Grade"}</Text>
            </View>
          ))}
        </SectionCard>

        <SectionCard title="Últimos conteúdos" subtitle="Pregações, devocionais e podcasts">
          {content.slice(0, 3).map((item) => (
            <View key={item.id} style={styles.row}>
              <View style={styles.flex}>
                <Text style={styles.rowTitle}>{item.title}</Text>
                <Text style={styles.rowMeta}>
                  {item.author} • {item.type}
                </Text>
              </View>
              <Text style={styles.badge}>Novo</Text>
            </View>
          ))}
        </SectionCard>

        <SectionCard title="Próximos eventos" subtitle="Participe das programações especiais">
          {events.slice(0, 3).map((event) => (
            <View key={event.id} style={styles.row}>
              <View style={styles.flex}>
                <Text style={styles.rowTitle}>{event.title}</Text>
                <Text style={styles.rowMeta}>{formatDateTime(event.startAt)}</Text>
              </View>
              <Text style={styles.badge}>Evento</Text>
            </View>
          ))}
        </SectionCard>
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
    gap: 18,
  },
  eyebrow: {
    color: "#f59e0b",
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  title: {
    color: "#f8fafc",
    fontSize: 30,
    fontWeight: "800",
  },
  subtitle: {
    color: "#cbd5e1",
    fontSize: 15,
    lineHeight: 22,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#1e293b",
  },
  rowTitle: {
    color: "#f8fafc",
    fontSize: 15,
    fontWeight: "700",
  },
  rowMeta: {
    color: "#94a3b8",
    fontSize: 13,
    marginTop: 4,
  },
  badge: {
    color: "#f59e0b",
    fontSize: 12,
    fontWeight: "700",
  },
  flex: {
    flex: 1,
  },
});