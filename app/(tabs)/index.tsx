import AppHeader from "@/components/common/app-header";
import CustomAlert from "@/components/common/custom-alert";
import { ThemedText } from "@/components/common/themed-text";
import { useAuth } from "@/hooks/use-auth";
import { useCustomAlert } from "@/hooks/use-custom-alert";
import { useDailyStats } from "@/hooks/use-stats";
import { useTrips } from "@/hooks/use-trips";
import { useUser } from "@/hooks/use-user";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const { stats, loading: statsLoading } = useDailyStats();
  const { trips, loading: tripsLoading } = useTrips();
  const { user, loading: userLoading } = useUser();
  const { signOut, isAuthenticated } = useAuth();
  const router = useRouter();
  const alert = useCustomAlert();

  const steps = stats?.steps || 0;
  const tripsCount = trips?.length || 0;

  const handleSignOut = async () => {
    alert.show({
      title: "Cerrar sesión",
      message: "¿Estás seguro que deseas cerrar sesión?",
      icon: "log-out-outline",
      buttons: [
        { text: "Cancelar", style: "cancel", onPress: () => alert.hide() },
        {
          text: "Cerrar sesión",
          style: "destructive",
          onPress: async () => {
            alert.hide();
            try {
              await signOut();
            } catch {
              alert.show({
                title: "Error",
                message: "No se pudo cerrar sesión",
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
    <LinearGradient
      colors={["#7CB342", "#1976D2"]}
      style={styles.container}
    >
      <AppHeader
        leftContent={
          <View style={styles.userInfo}>
            <Ionicons name="person-circle" size={40} color="#fff" />
            <View style={styles.userTextContainer}>
              {userLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <ThemedText style={styles.welcomeText}>Hola,</ThemedText>
                  <ThemedText style={styles.userName}>
                    {user?.name || "Usuario"}
                  </ThemedText>
                </>
              )}
            </View>
          </View>
        }
        rightContent={
          isAuthenticated ? (
            <TouchableOpacity style={styles.actionButton} onPress={handleSignOut}>
              <Ionicons name="log-out-outline" size={28} color="#fff" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => router.push("/login")}
            >
              <Ionicons name="log-in-outline" size={28} color="#fff" />
            </TouchableOpacity>
          )
        }
        showGradient={false}
      />

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
            {statsLoading ? (
              <ActivityIndicator size="small" color="#7CB342" />
            ) : (
              <ThemedText style={styles.statNumber}>{steps.toLocaleString()}</ThemedText>
            )}
            <ThemedText style={styles.statLabel}>Pasos hoy</ThemedText>
          </View>
          
          <View style={styles.statCard}>
            <Ionicons name="map" size={32} color="#1976D2" />
            {tripsLoading ? (
              <ActivityIndicator size="small" color="#1976D2" />
            ) : (
              <ThemedText style={styles.statNumber}>{tripsCount}</ThemedText>
            )}
            <ThemedText style={styles.statLabel}>Viajes</ThemedText>
          </View>
        </View>
      </View>

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
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  userTextContainer: {
    justifyContent: "center",
  },
  welcomeText: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.9,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  actionButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
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
