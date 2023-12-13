import { StyleSheet, Text, View } from "react-native";
import { useLastRemainCredit } from "../nfc";
import Sheet from "../ui/components/Sheet";

const styles = StyleSheet.create({
  creditContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  credit: {
    fontSize: 32,
    lineHeight: 42,
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: {width: 0, height: 4},
    textShadowRadius: 8
  },
  temperatureContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  temperature: {
    fontSize: 32,
    lineHeight: 42,
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: {width: 0, height: 4},
    textShadowRadius: 8
  },
  graphContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    elevation: 2
  }
});

export default function Dashboard() {
  const lastRemainCredit = useLastRemainCredit();

  return <>
    <View style={styles.creditContainer}>
      <Text style={styles.credit}>{lastRemainCredit?.data}円</Text>
    </View>
    <View style={styles.temperatureContainer}>
      <Text style={styles.temperature}>22℃</Text>
    </View>
    <Sheet style={styles.graphContainer}>
      <Text>TODO: Graph?</Text>
    </Sheet>
  </>
}
