import { StyleSheet, Text, View, Image } from "react-native";
import { useLastRemainCredit } from "../nfc";
import Sheet from "../ui/components/Sheet";
import Circle from "../../assets/dashboard/circle.png";

const styles = StyleSheet.create({
  container: {
    position: "relative",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    flex: 3,
  },
  circle: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
  },
  label: {
    fontSize: 16,
    lineHeight: 22,
    color: "#5f6877",
  },
  value: {
    fontSize: 36,
    lineHeight: 44,
    color: "#4f6afa",
    fontWeight: "700",
  },
  graphContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    elevation: 2,
  },
  statusPlaceholder: {
    position: "absolute",
    width: "100%",
    bottom: 0,
  }
});

export default function Dashboard() {
  const lastRemainCredit = useLastRemainCredit();

  return (
    <>
      <View style={styles.container}>
        <Image source={Circle} style={styles.circle} resizeMode="contain" />
        <Text style={styles.label}>残高</Text>
        <Text style={styles.value}>{lastRemainCredit?.data}円</Text>
        <Text style={styles.label}>懐温</Text>
        <Text style={styles.value}>22℃</Text>
      </View>
    </>
  );
}
