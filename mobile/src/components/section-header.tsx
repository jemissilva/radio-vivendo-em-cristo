import { StyleSheet, Text, View } from "react-native";

interface SectionHeaderProps {
  title: string;
  subtitle: string;
}

export function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  title: {
    color: "#f8fafc",
    fontSize: 28,
    fontWeight: "800",
  },
  subtitle: {
    color: "#cbd5e1",
    fontSize: 14,
    lineHeight: 21,
  },
});