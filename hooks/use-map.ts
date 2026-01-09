import { useTrips } from "@/hooks/use-trips";
import { RoutePoint } from "@/types/trip.types";
import * as Location from "expo-location";
import { useEffect, useState } from "react";

interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

interface AlertConfig {
  title: string;
  message?: string;
  buttons?: {
    text: string;
    onPress?: () => void;
    style?: "default" | "cancel" | "destructive";
  }[];
  icon?: string;
  iconColor?: string;
}

export const useMap = () => {
  const { createTrip } = useTrips();
  const [region, setRegion] = useState<Region>({
    latitude: 4.711,
    longitude: -74.0721,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [isTracking, setIsTracking] = useState(false);
  const [routePoints, setRoutePoints] = useState<RoutePoint[]>([]);
  const [startTime, setStartTime] = useState<number>(0);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [alertConfig, setAlertConfig] = useState<AlertConfig | null>(null);
  const [alertVisible, setAlertVisible] = useState(false);

  const showAlert = (config: AlertConfig) => {
    setAlertConfig(config);
    setAlertVisible(true);
  };

  const hideAlert = () => {
    setAlertVisible(false);
    setTimeout(() => setAlertConfig(null), 300);
  };

  // Solicitar permisos y obtener ubicación inicial
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          showAlert({
            title: "Error",
            message: "Permiso de ubicación denegado",
            icon: "location-outline",
            iconColor: "#d32f2f",
            buttons: [{ text: "OK", onPress: hideAlert }],
          });
          setIsLoadingLocation(false);
          return;
        }

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
      } finally {
        setIsLoadingLocation(false);
      }
    })();
  }, []);

  // Observar ubicación durante el tracking
  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    if (isTracking) {
      (async () => {
        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            distanceInterval: 10, // Actualizar cada 10 metros
          },
          (location) => {
            const newPoint: RoutePoint = {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              timestamp: location.timestamp,
              speed: location.coords.speed || undefined,
              altitude: location.coords.altitude || undefined,
            };
            setRoutePoints((prev) => [...prev, newPoint]);
          }
        );
      })();
    }

    return () => {
      subscription?.remove();
    };
  }, [isTracking]);

  // Iniciar recorrido
  const startTrip = () => {
    setIsTracking(true);
    setRoutePoints([]);
    setStartTime(Date.now());
    showAlert({
      title: "Recorrido iniciado",
      message: "¡Comienza a caminar!",
      icon: "walk-outline",
      buttons: [{ text: "OK", onPress: hideAlert }],
    });
  };

  // Detener recorrido
  const stopTrip = async () => {
    setIsTracking(false);

    if (routePoints.length < 2) {
      showAlert({
        title: "Error",
        message: "El recorrido es demasiado corto",
        icon: "alert-circle-outline",
        iconColor: "#d32f2f",
        buttons: [{ text: "OK", onPress: hideAlert }],
      });
      return;
    }

    // Calcular distancia total
    const distance = calculateDistance(routePoints);
    const duration = Math.floor((Date.now() - startTime) / 60000); // minutos

    // Mostrar alerta para guardar (por ahora sin input, usaremos nombre por defecto)
    showAlert({
      title: "Guardar recorrido",
      message: `Distancia: ${distance.toFixed(1)} km\nDuración: ${duration} min`,
      icon: "save-outline",
      buttons: [
        { text: "Cancelar", style: "cancel", onPress: hideAlert },
        {
          text: "Guardar",
          onPress: async () => {
            hideAlert();
            try {
              await createTrip({
                name: `Recorrido ${new Date().toLocaleDateString()}`,
                date: new Date().toISOString().split("T")[0],
                distance,
                duration,
                route: routePoints,
              });
              showAlert({
                title: "Éxito",
                message: "Recorrido guardado correctamente",
                icon: "checkmark-circle-outline",
                buttons: [{ text: "OK", onPress: hideAlert }],
              });
              setRoutePoints([]);
            } catch {
              showAlert({
                title: "Error",
                message: "No se pudo guardar el recorrido",
                icon: "alert-circle-outline",
                iconColor: "#d32f2f",
                buttons: [{ text: "OK", onPress: hideAlert }],
              });
            }
          },
        },
      ],
    });
  };

  // Calcular distancia total del recorrido
  const calculateDistance = (points: RoutePoint[]): number => {
    let distance = 0;
    for (let i = 1; i < points.length; i++) {
      distance += getDistanceBetweenPoints(points[i - 1], points[i]);
    }
    return distance;
  };

  // Calcular distancia entre dos puntos usando fórmula de Haversine
  const getDistanceBetweenPoints = (p1: RoutePoint, p2: RoutePoint): number => {
    const R = 6371; // Radio de la Tierra en km
    const dLat = toRad(p2.latitude - p1.latitude);
    const dLon = toRad(p2.longitude - p1.longitude);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(p1.latitude)) *
        Math.cos(toRad(p2.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Convertir grados a radianes
  const toRad = (deg: number): number => {
    return deg * (Math.PI / 180);
  };

  return {
    region,
    isTracking,
    routePoints,
    startTrip,
    stopTrip,
    isLoadingLocation,
    alert: {
      visible: alertVisible,
      config: alertConfig,
      hide: hideAlert,
    },
  };
};
