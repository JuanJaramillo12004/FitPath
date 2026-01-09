import AppHeader from "@/components/common/app-header";
import CustomAlert from "@/components/common/custom-alert";
import Loader from "@/components/common/loader";
import { ThemedText } from "@/components/common/themed-text";
import { ThemedView } from "@/components/common/themed-view";
import { useMap } from "@/hooks/use-map";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import MapView, {
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
  Polyline,
} from "react-native-maps";

export default function MapScreen() {
  const {
    region,
    isTracking,
    routePoints,
    startTrip,
    stopTrip,
    isLoadingLocation,
    alert,
  } = useMap();

  if (isLoadingLocation) return <Loader title="Cargando ubicación..." />;

  return (
    <ThemedView style={styles.container}>
      <AppHeader
        title="Mapa"
        icon="map"
        rightContent={
          <TouchableOpacity
            style={[styles.startButton, isTracking && styles.stopButton]}
            onPress={isTracking ? stopTrip : startTrip}
          >
            <Ionicons
              name={isTracking ? "stop-circle" : "play-circle"}
              size={28}
              color="#fff"
            />
            <ThemedText style={styles.buttonText}>
              {isTracking ? "Detener" : "Iniciar"}
            </ThemedText>
          </TouchableOpacity>
        }
      />
      <MapView
        provider={PROVIDER_GOOGLE || PROVIDER_DEFAULT}
        style={styles.map}
        showsUserLocation
        showsMyLocationButton
        initialRegion={region}
        region={region}
      >
        {routePoints.length > 1 && (
          <Polyline
            coordinates={routePoints.map((p) => ({
              latitude: p.latitude,
              longitude: p.longitude,
            }))}
            strokeColor="#7CB342"
            strokeWidth={4}
          />
        )}
      </MapView>

      {alert.config && (
        <CustomAlert
          visible={alert.visible}
          title={alert.config.title}
          message={alert.config.message}
          buttons={alert.config.buttons}
          icon={alert.config.icon as any}
          iconColor={alert.config.iconColor}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
    width: "100%",
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
  stopButton: {
    backgroundColor: "rgba(255, 82, 82, 0.3)",
  },
});
