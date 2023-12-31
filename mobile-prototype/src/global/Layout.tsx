import { View, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import Navigation from "./Navigation";
import { ReactNode } from "react";
import Notifications from "./Notifications";

type Props = {
  children: ReactNode;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#333",
  },
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  inner: {
    flexGrow: 1,
  },
});

export default function Layout({ children }: Props) {
  return (
    <View style={styles.container}>
      <LinearGradient
        // Background Linear Gradient
        colors={["#ffffff", "#e0e3e9"]}
        style={styles.background}
      />
      <View style={styles.inner}>{children}</View>
      <Navigation />
      <StatusBar style="auto" />
      <Notifications />
    </View>
  );
}
