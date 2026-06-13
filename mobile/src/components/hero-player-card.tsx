import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { StreamStatus } from "@/src/types";
import { useAudioPlayer } from "@/src/hooks/use-audio-player";

interface HeroPlayerCardProps {
  live: StreamStatus;
}

export function HeroPlayerCard({ live }: HeroPlayerCardProps) {
  const { isPlaying, isLoading, togglePlayback } = useAudioPlayer(live.streamUrl);

  return (
    <LinearGradient colors={["#1d4ed8", "#0f172a"]} style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.liveLabel}>{live.isLive ? "AO VIVO" : "OFFLINE"}</Text>
          <Text style={styles.track}>{live.currentTrack}</Text>
          <Text style={styles.meta}>
            {live.listenersNow} ouvintes • {live.bitrateKbps} kbps
          </Text>
        </View>
        <Pressable style={styles.button} onPress={togglePlayback}>
          <Ionicons
            name={isPlaying ? "pause" : "play"}
            size={28}
            color="#08101f"
          />
        </Pressable>
      </View>
      <Text style={styles.description}>
        {isLoading
          ? "Conectando à transmissão..."
          : "Toque para ouvir a programação da Rádio Vivendo em Cristo."}
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 20,
    gap: 14,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
  },
  liveLabel: {
    color: "#fbbf24",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
  },
  track: {
    color: "#f8fafc",
    fontSize: 22,
    fontWeight: "800",
    marginTop: 6,
  },
  meta: {
    color: "#cbd5e1",
    fontSize: 13,
    marginTop: 6,
  },
  button: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#f59e0b",
    alignItems: "center",
    justifyContent: "center",
  },
  description: {
    color: "#e2e8f0",
    fontSize: 14,
    lineHeight: 21,
  },
});