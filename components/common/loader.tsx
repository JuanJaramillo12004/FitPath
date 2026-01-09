import { StyleSheet, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/common/themed-text";

export default function Loader({ title }: { title: string }) {
  return (
    <LinearGradient
      colors={["#7CB342", "#1976D2"]}
      style={styles.loadingContainer}
    >
      <Ionicons name="map" size={64} color="#fff" style={styles.loadingIcon} />
      <ActivityIndicator size="large" color="#fff" />
      <ThemedText style={styles.loadingText}>{title}</ThemedText>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingIcon: {
    opacity: 0.8,
    marginBottom: 8,
  },
  loadingText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 8,
  },
});
