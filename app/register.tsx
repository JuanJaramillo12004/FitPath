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

export default function RegisterScreen() {
  const { signUp } = useAuth();
  const alert = useCustomAlert();
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async () => {
    // Validaciones
    if (!name.trim() || !lastName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      alert.show({
        title: "Error",
        message: "Por favor completa todos los campos",
        icon: "alert-circle-outline",
        iconColor: "#d32f2f",
        buttons: [{ text: "OK", onPress: () => alert.hide() }],
      });
      return;
    }

    if (password !== confirmPassword) {
      alert.show({
        title: "Error",
        message: "Las contraseñas no coinciden",
        icon: "alert-circle-outline",
        iconColor: "#d32f2f",
        buttons: [{ text: "OK", onPress: () => alert.hide() }],
      });
      return;
    }

    if (password.length < 6) {
      alert.show({
        title: "Error",
        message: "La contraseña debe tener al menos 6 caracteres",
        icon: "alert-circle-outline",
        iconColor: "#d32f2f",
        buttons: [{ text: "OK", onPress: () => alert.hide() }],
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert.show({
        title: "Error",
        message: "Por favor ingresa un correo electrónico válido",
        icon: "alert-circle-outline",
        iconColor: "#d32f2f",
        buttons: [{ text: "OK", onPress: () => alert.hide() }],
      });
      return;
    }

    try {
      setLoading(true);
      await signUp(email.trim(), password, name.trim(), lastName.trim());
      // El _layout.tsx se encargará de la redirección automáticamente
    } catch (error: any) {
      alert.show({
        title: "Error",
        message: error.message || "No se pudo crear la cuenta. Intenta nuevamente.",
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
          </View>

          <ThemedView style={styles.formContainer}>
            <ThemedText style={styles.formTitle}>Crear Cuenta</ThemedText>

            <View style={styles.inputContainer}>
              <Ionicons
                name="person-outline"
                size={24}
                color="#666"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Nombre"
                placeholderTextColor="#999"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                editable={!loading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons
                name="person-outline"
                size={24}
                color="#666"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Apellido"
                placeholderTextColor="#999"
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
                editable={!loading}
              />
            </View>

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

            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={24}
                color="#666"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Confirmar contraseña"
                placeholderTextColor="#999"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                editable={!loading}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                  size={24}
                  color="#666"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.registerButton, loading && styles.registerButtonDisabled]}
              onPress={handleRegister}
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
                  <ThemedText style={styles.registerButtonText}>
                    Registrarse
                  </ThemedText>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <ThemedText style={styles.dividerText}>o</ThemedText>
              <View style={styles.dividerLine} />
            </View>

            <Link href="/login" asChild>
              <TouchableOpacity style={styles.loginLink} disabled={loading}>
                <ThemedText style={styles.loginText}>
                  ¿Ya tienes cuenta?{" "}
                  <ThemedText style={styles.loginTextBold}>
                    Inicia sesión
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
    paddingTop: 40,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
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
    marginBottom: 20,
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
  registerButton: {
    marginTop: 8,
    borderRadius: 12,
    overflow: "hidden",
  },
  registerButtonDisabled: {
    opacity: 0.6,
  },
  gradientButton: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  registerButtonText: {
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
  loginLink: {
    alignItems: "center",
  },
  loginText: {
    fontSize: 16,
    color: "#666",
  },
  loginTextBold: {
    fontWeight: "bold",
    color: "#7CB342",
  },
});
