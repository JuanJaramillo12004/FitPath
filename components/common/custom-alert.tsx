import { ThemedText } from "@/components/common/themed-text";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";

interface CustomAlertButton {
  text: string;
  onPress?: () => void;
  style?: "default" | "cancel" | "destructive";
}

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message?: string;
  buttons?: CustomAlertButton[];
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
}

export default function CustomAlert({
  visible,
  title,
  message,
  buttons = [{ text: "OK" }],
  icon,
  iconColor = "#7CB342",
}: CustomAlertProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <LinearGradient
            colors={["#7CB342", "#1976D2"]}
            style={styles.header}
          >
            {icon && (
              <View style={styles.iconContainer}>
                <Ionicons name={icon} size={48} color="#fff" />
              </View>
            )}
            <ThemedText style={styles.title}>{title}</ThemedText>
          </LinearGradient>

          <View style={styles.content}>
            {message && (
              <ThemedText style={styles.message}>{message}</ThemedText>
            )}
          </View>

          <View style={styles.buttonContainer}>
            {buttons.map((button, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.button,
                  button.style === "cancel" && styles.cancelButton,
                  button.style === "destructive" && styles.destructiveButton,
                  buttons.length === 1 && styles.singleButton,
                ]}
                onPress={button.onPress}
              >
                <ThemedText
                  style={[
                    styles.buttonText,
                    button.style === "cancel" && styles.cancelButtonText,
                    button.style === "destructive" && styles.destructiveButtonText,
                  ]}
                >
                  {button.text}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: "100%",
    maxWidth: 400,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    padding: 24,
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 50,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  content: {
    padding: 24,
    paddingTop: 20,
    paddingBottom: 20,
  },
  message: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  button: {
    flex: 1,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1,
    borderRightColor: "#e0e0e0",
  },
  singleButton: {
    borderRightWidth: 0,
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
  },
  destructiveButton: {
    backgroundColor: "#ffebee",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#7CB342",
  },
  cancelButtonText: {
    color: "#666",
  },
  destructiveButtonText: {
    color: "#d32f2f",
  },
});
