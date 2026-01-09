import Loader from "@/components/common/loader";
import { ThemedText } from "@/components/common/themed-text";
import { Trip } from "@/types/trip.types";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

interface TripsViewProps {
  trips: Trip[];
  loading: boolean;
  error?: Error | null;
  onDelete: (id: string, name: string) => void;
}

export default function TripsView({ trips, loading, error, onDelete }: TripsViewProps) {
  if (loading) return <Loader title="Cargando recorridos..." />;

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      {error ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="alert-circle-outline" size={80} color="#ff6b6b" />
          <ThemedText style={styles.emptyText}>Error al cargar</ThemedText>
          <ThemedText style={styles.emptySubtext}>{error.message}</ThemedText>
        </View>
      ) : trips.length === 0 ? (
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
          <TouchableOpacity 
            key={trip.id} 
            style={styles.tripCard}
            onLongPress={() => onDelete(trip.id, trip.name)}
          >
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
                  <ThemedText style={styles.statText}>{trip.distance.toFixed(1)} km</ThemedText>
                </View>
                <View style={styles.stat}>
                  <Ionicons name="time-outline" size={16} color="#1976D2" />
                  <ThemedText style={styles.statText}>{trip.duration} min</ThemedText>
                </View>
              </View>
            </View>

            <Ionicons name="chevron-forward" size={24} color="#ccc" />
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
