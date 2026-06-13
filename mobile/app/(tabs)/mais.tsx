import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SectionHeader } from "@/src/components/section-header";
import { useAppData } from "@/src/context/app-context";

export default function MoreScreen() {
  const {
    prayerForm,
    contactForm,
    updatePrayerForm,
    updateContactForm,
    submitPrayerRequest,
    submitContactMessage,
    favorites,
  } = useAppData();

  const handlePrayer = async () => {
    const result = await submitPrayerRequest();
    Alert.alert(result.ok ? "Pedido enviado" : "Erro", result.message);
  };

  const handleContact = async () => {
    const result = await submitContactMessage();
    Alert.alert(result.ok ? "Mensagem enviada" : "Erro", result.message);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <SectionHeader
          title="Mais"
          subtitle="Interaja com a igreja, envie pedidos e acompanhe seus favoritos."
        />

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Favoritos</Text>
          <Text style={styles.cardText}>
            Você possui {favorites.length} conteúdo(s) salvo(s) neste dispositivo.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Pedido de oração</Text>
          <TextInput
            placeholder="Seu nome"
            placeholderTextColor="#64748b"
            style={styles.input}
            value={prayerForm.name}
            onChangeText={(value) => updatePrayerForm("name", value)}
          />
          <TextInput
            placeholder="Seu e-mail"
            placeholderTextColor="#64748b"
            style={styles.input}
            value={prayerForm.email}
            onChangeText={(value) => updatePrayerForm("email", value)}
          />
          <TextInput
            placeholder="Seu pedido"
            placeholderTextColor="#64748b"
            style={[styles.input, styles.textArea]}
            multiline
            value={prayerForm.request}
            onChangeText={(value) => updatePrayerForm("request", value)}
          />
          <Pressable style={styles.button} onPress={handlePrayer}>
            <Text style={styles.buttonText}>Enviar pedido</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Contato</Text>
          <TextInput
            placeholder="Seu nome"
            placeholderTextColor="#64748b"
            style={styles.input}
            value={contactForm.name}
            onChangeText={(value) => updateContactForm("name", value)}
          />
          <TextInput
            placeholder="Seu e-mail"
            placeholderTextColor="#64748b"
            style={styles.input}
            value={contactForm.email}
            onChangeText={(value) => updateContactForm("email", value)}
          />
          <TextInput
            placeholder="Assunto"
            placeholderTextColor="#64748b"
            style={styles.input}
            value={contactForm.subject}
            onChangeText={(value) => updateContactForm("subject", value)}
          />
          <TextInput
            placeholder="Mensagem"
            placeholderTextColor="#64748b"
            style={[styles.input, styles.textArea]}
            multiline
            value={contactForm.message}
            onChangeText={(value) => updateContactForm("message", value)}
          />
          <Pressable style={styles.button} onPress={handleContact}>
            <Text style={styles.buttonText}>Enviar mensagem</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Redes e transmissão</Text>
          <Pressable style={styles.secondaryButton} onPress={() => Linking.openURL("https://www.youtube.com")}>
            <Text style={styles.secondaryButtonText}>Abrir YouTube</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={() => Linking.openURL("https://www.instagram.com")}>
            <Text style={styles.secondaryButtonText}>Abrir Instagram</Text>
          </Pressable>
        </View>
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
    gap: 12,
  },
  cardTitle: {
    color: "#f8fafc",
    fontSize: 18,
    fontWeight: "800",
  },
  cardText: {
    color: "#cbd5e1",
    fontSize: 14,
    lineHeight: 21,
  },
  input: {
    backgroundColor: "#111c31",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#f8fafc",
    borderWidth: 1,
    borderColor: "#1e293b",
  },
  textArea: {
    minHeight: 110,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#f59e0b",
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: "center",
  },
  buttonText: {
    color: "#08101f",
    fontWeight: "800",
  },
  secondaryButton: {
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#334155",
  },
  secondaryButtonText: {
    color: "#f8fafc",
    fontWeight: "700",
  },
});