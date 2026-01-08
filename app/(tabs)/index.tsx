import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";

export default function HomeScreen() {
  return (
    <LinearGradient
      colors={["#7CB342", "#1976D2"]}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="fitness" size={80} color="#fff" />
        </View>
        <ThemedText style={styles.title}>FitPath</ThemedText>
        <ThemedText style={styles.subtitle}>
          Tu camino hacia el bienestar
        </ThemedText>
        
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="walk" size={32} color="#7CB342" />
            <ThemedText style={styles.statNumber}>0</ThemedText>
            <ThemedText style={styles.statLabel}>Pasos hoy</ThemedText>
          </View>
          
          <View style={styles.statCard}>
            <Ionicons name="map" size={32} color="#1976D2" />
            <ThemedText style={styles.statNumber}>0</ThemedText>
            <ThemedText style={styles.statLabel}>Viajes</ThemedText>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  iconContainer: {
    marginBottom: 20,
    padding: 20,
    borderRadius: 100,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
    paddingVertical: 20,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: "#fff",
    opacity: 0.9,
    marginBottom: 40,
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    gap: 20,
    marginTop: 20,
  },
  statCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    minWidth: 140,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
});
