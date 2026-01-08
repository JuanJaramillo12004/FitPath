import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

const trips = [
  { id: '1', name: 'Recorrido Matutino', date: '2024-06-01', distance: '5.2 km', duration: '45 min' },
  { id: '2', name: 'Caminata Vespertina', date: '2024-06-02', distance: '3.8 km', duration: '32 min' },
  { id: '3', name: 'Trote en el Parque', date: '2024-06-03', distance: '7.5 km', duration: '58 min' },
  { id: '4', name: 'Paseo Nocturno', date: '2024-06-04', distance: '4.0 km', duration: '40 min' },
  { id: '5', name: 'Ruta de la Mañana', date: '2024-06-05', distance: '6.1 km', duration: '50 min' },
  { id: '6', name: 'Caminata por la Ciudad', date: '2024-06-06', distance: '5.5 km', duration: '48 min' },
];

export default function TripsScreen() {
  return (
    <ThemedView style={styles.container}>
      <LinearGradient
        colors={["#7CB342", "#1976D2"]}
        style={styles.header}
      >
        <ThemedText style={styles.title}>
          <Ionicons name="map" size={28} color="#fff" /> Recorridos
        </ThemedText>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add-circle" size={32} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {trips.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="map-outline" size={80} color="#ccc" />
            <ThemedText style={styles.emptyText}>
              No hay recorridos guardados
            </ThemedText>
            <ThemedText style={styles.emptySubtext}>
              Comienza un nuevo viaje en el mapa
            </ThemedText>
          </View>
        ) : (
          trips.map((trip) => (
            <TouchableOpacity key={trip.id} style={styles.tripCard}>
              <View style={styles.cardIconContainer}>
                <LinearGradient
                  colors={["#7CB342", "#1976D2"]}
                  style={styles.iconGradient}
                >
                  <Ionicons name="navigate" size={24} color="#fff" />
                </LinearGradient>
              </View>
              
              <View style={styles.cardContent}>
                <ThemedText style={styles.tripName}>{trip.name}</ThemedText>
                <ThemedText style={styles.tripDate}>
                  <Ionicons name="calendar-outline" size={14} /> {trip.date}
                </ThemedText>
                
                <View style={styles.statsRow}>
                  <View style={styles.stat}>
                    <Ionicons name="navigate-circle-outline" size={16} color="#7CB342" />
                    <ThemedText style={styles.statText}>{trip.distance}</ThemedText>
                  </View>
                  <View style={styles.stat}>
                    <Ionicons name="time-outline" size={16} color="#1976D2" />
                    <ThemedText style={styles.statText}>{trip.duration}</ThemedText>
                  </View>
                </View>
              </View>

              <Ionicons name="chevron-forward" size={24} color="#ccc" />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  addButton: {
    padding: 5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#999",
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#bbb",
    marginTop: 8,
  },
  tripCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardIconContainer: {
    marginRight: 16,
  },
  iconGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContent: {
    flex: 1,
  },
  tripName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  tripDate: {
    fontSize: 13,
    color: "#666",
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: "row",
    gap: 20,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statText: {
    fontSize: 14,
    color: "#555",
    fontWeight: "600",
  },
});
