import CustomAlert from "@/components/common/custom-alert";
import { ThemedText } from "@/components/common/themed-text";
import { ThemedView } from "@/components/common/themed-view";
import { useAuth } from "@/hooks/use-auth";
import { useCustomAlert } from "@/hooks/use-custom-alert";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const { signIn } = useAuth();
  const alert = useCustomAlert();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      alert.show({
        title: "Error",
        message: "Por favor completa todos los campos",
        icon: "alert-circle-outline",
        iconColor: "#d32f2f",
        buttons: [{ text: "OK", onPress: () => alert.hide() }],
      });
      return;
    }

    try {
      setLoading(true);
      await signIn(email.trim(), password);
      // El _layout.tsx se encargará de la redirección automáticamente
    } catch (error: any) {
      alert.show({
        title: "Error",
        message: error.message || "No se pudo iniciar sesión. Verifica tus credenciales.",
        icon: "alert-circle-outline",
        iconColor: "#d32f2f",
        buttons: [{ text: "OK", onPress: () => alert.hide() }],
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#7CB342", "#1976D2"]} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logoContainer}>
            <Image
              source={require("@/assets/images/Logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <ThemedText style={styles.appSubtitle}>
              Tu camino hacia el bienestar
            </ThemedText>
          </View>

          <ThemedView style={styles.formContainer}>
            <ThemedText style={styles.formTitle}>Iniciar Sesión</ThemedText>

            <View style={styles.inputContainer}>
              <Ionicons
                name="mail-outline"
                size={24}
                color="#666"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                editable={!loading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={24}
                color="#666"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Contraseña"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoComplete="password"
                editable={!loading}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={24}
                  color="#666"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.loginButton, loading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              <LinearGradient
                colors={["#7CB342", "#1976D2"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <ThemedText style={styles.loginButtonText}>
                    Iniciar Sesión
                  </ThemedText>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <ThemedText style={styles.dividerText}>o</ThemedText>
              <View style={styles.dividerLine} />
            </View>

            <Link href="/register" asChild>
              <TouchableOpacity
                style={styles.registerLink}
                disabled={loading}
              >
                <ThemedText style={styles.registerText}>
                  ¿No tienes cuenta?{" "}
                  <ThemedText style={styles.registerTextBold}>
                    Regístrate
                  </ThemedText>
                </ThemedText>
              </TouchableOpacity>
            </Link>
          </ThemedView>
        </ScrollView>
      </KeyboardAvoidingView>

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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    borderRadius: 20,
  },
  appSubtitle: {
    fontSize: 16,
    color: "#fff",
    marginTop: 8,
    opacity: 0.9,
  },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  formTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 24,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  eyeIcon: {
    padding: 4,
  },
  loginButton: {
    marginTop: 8,
    borderRadius: 12,
    overflow: "hidden",
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  gradientButton: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#ddd",
  },
  dividerText: {
    marginHorizontal: 16,
    color: "#999",
    fontSize: 14,
  },
  registerLink: {
    alignItems: "center",
  },
  registerText: {
    fontSize: 16,
    color: "#666",
  },
  registerTextBold: {
    fontWeight: "bold",
    color: "#7CB342",
  },
});
