import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import MapView, { PROVIDER_DEFAULT, PROVIDER_GOOGLE } from "react-native-maps";

interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

async function requestPermissions() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    throw new Error("Permiso de ubicación denegado");
  }
}

export default function MapScreen() {
  const [region, setRegion] = useState<Region>({
    latitude: 4.711,
    longitude: -74.0721,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    (async () => {
      try {
        await requestPermissions();
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      } catch (error) {
        console.error("Error obteniendo ubicación:", error);
      }
    })();
  }, []);

  const startTrip = () => {
    try {
      alert("Recorrido iniciado");
    } catch (error) {
      console.error("Error obteniendo ubicación:", error);
      return;
    }
  };

  return (
    <ThemedView style={styles.container}>
      <LinearGradient
        colors={["#7CB342", "#1976D2"]}
        style={styles.header}
      >
        <ThemedText style={styles.title}>
          <Ionicons name="map" size={28} color="#fff" /> Mapa
        </ThemedText>
        <TouchableOpacity style={styles.startButton} onPress={startTrip}>
          <Ionicons name="play-circle" size={28} color="#fff" />
          <ThemedText style={styles.buttonText}>Iniciar</ThemedText>
        </TouchableOpacity>
      </LinearGradient>
      <MapView
        provider={PROVIDER_GOOGLE || PROVIDER_DEFAULT}
        style={styles.map}
        showsUserLocation
        showsMyLocationButton
        initialRegion={region}
        region={region}
      ></MapView>
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
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  map: {
    flex: 1,
    width: "100%",
  },
});
