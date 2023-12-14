import { Link, usePathname } from "expo-router";
import { Text, View, StyleSheet, Pressable, Image } from "react-native";
import NavigationDashboard from "../../assets/navigation/dashboard.png";
import NavigationConfig from "../../assets/navigation/config.png";
import { Svg } from "react-native-svg";

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 0,
    width: "100%",
    aspectRatio: 750 / 88,
  },
  imageContainer: {
    position: "absolute",
    flex: 0,
    width: "100%",
    aspectRatio: 750 / 148,
    bottom: 0,
  },
  interactionContainer: {
    position: "absolute",
    flexDirection: "row",
    width: "100%",
    height: "100%",
    paddingHorizontal: "7%",
    columnGap: 5,
  },
  button: {
    flex: 1,
    justifyContent: "center",
  },
  image: {
    position: "absolute",
    width: "100%",
    height: "100%",
    bottom: 0,
  },
});

export default function Navigation() {
  const path = usePathname();

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {path === "/" ? (
          <Image
            style={styles.image}
            source={NavigationDashboard}
            resizeMode="stretch"
          />
        ) : path === "/config" ? (
          <Image
            style={styles.image}
            source={NavigationConfig}
            resizeMode="stretch"
          />
        ) : null}
      </View>
      <View style={styles.interactionContainer}>
        <Link href="/" asChild>
          <Pressable style={styles.button} />
        </Link>
        <Link href="/config" asChild>
          <Pressable style={styles.button} />
        </Link>
      </View>
    </View>
  );
}
