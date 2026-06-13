import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

interface SectionCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function SectionCard({ title, subtitle, children }: SectionCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#0f172a",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#1e293b",
  },
  title: {
    color: "#f8fafc",
    fontSize: 18,
    fontWeight: "800",
  },
  subtitle: {
    color: "#94a3b8",
    fontSize: 13,
    marginTop: 4,
  },
  content: {
    marginTop: 12,
  },
});