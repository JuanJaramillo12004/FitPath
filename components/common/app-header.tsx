import { ThemedText } from "@/components/common/themed-text";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

interface AppHeaderProps {
  title?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  leftContent?: ReactNode;
  rightContent?: ReactNode;
  showGradient?: boolean;
}

export default function AppHeader({
  title,
  icon,
  leftContent,
  rightContent,
  showGradient = true,
}: AppHeaderProps) {
  return (
    <LinearGradient 
      colors={showGradient ? ["#7CB342", "#1976D2"] : ["transparent", "transparent"]} 
      style={styles.header}
    >
      {leftContent ? (
        leftContent
      ) : (
        <View style={styles.titleContainer}>
          {icon && <Ionicons name={icon} size={28} color="#fff" />}
          {title && <ThemedText style={styles.title}>{title}</ThemedText>}
        </View>
      )}
      {rightContent && <View style={styles.rightContainer}>{rightContent}</View>}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
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
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
});
