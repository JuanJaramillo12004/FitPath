import AppHeader from "@/components/common/app-header";
import CustomAlert from "@/components/common/custom-alert";
import { ThemedView } from "@/components/common/themed-view";
import TripsView from "@/components/trips/trips-view";
import { useCustomAlert } from "@/hooks/use-custom-alert";
import { useTrips } from "@/hooks/use-trips";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity } from "react-native";

export default function TripsScreen() {
  const { trips, loading, error, deleteTrip } = useTrips();
  const alert = useCustomAlert();

  const handleDelete = (id: string, name: string) => {
    alert.show({
      title: "Eliminar recorrido",
      message: `¿Estás seguro de eliminar "${name}"?`,
      icon: "trash-outline",
      buttons: [
        { 
          text: "Cancelar", 
          style: "cancel",
          onPress: () => alert.hide(),
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            alert.hide();
            try {
              await deleteTrip(id);
            } catch {
              alert.show({
                title: "Error",
                message: "No se pudo eliminar el recorrido",
                icon: "alert-circle-outline",
                iconColor: "#d32f2f",
                buttons: [{ text: "OK", onPress: () => alert.hide() }],
              });
            }
          },
        },
      ],
    });
  };

  return (
    <ThemedView style={styles.container}>
      <AppHeader
        title="Recorridos"
        icon="list-outline"
        rightContent={
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add-circle" size={32} color="#fff" />
          </TouchableOpacity>
        }
      />

      <TripsView
        trips={trips}
        loading={loading}
        error={error}
        onDelete={handleDelete}
      />

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
  addButton: {
    padding: 5,
  },
});
