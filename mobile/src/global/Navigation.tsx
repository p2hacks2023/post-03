import { Link } from "expo-router";
import { Text, View, StyleSheet, Pressable } from "react-native";


const styles = StyleSheet.create({
  container: {
    flex: 0,
    flexDirection: "row",
    backgroundColor: "#fff",
    elevation: 16
  },
  button: {
    flex: 1,
    justifyContent: "center"
  }
});

export default function Navigation() {
  return (
    <View style={styles.container}>
      <Link href="/" asChild>
        <Pressable style={styles.button} android_ripple={{color: "#999"}}>
          <Text>HOME</Text>
        </Pressable>
      </Link>
      <Link href="/config" asChild>
        <Pressable style={styles.button} android_ripple={{color: "#999"}}>
          <Text>Config</Text>
        </Pressable>
      </Link>
    </View>
  );
}
