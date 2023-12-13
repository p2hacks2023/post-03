import { StyleSheet, View, Text } from "react-native";

type Props = {
  label: string;
};

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    top: 60,
    left: 20,
    right: 20,
    borderRadius: 999,
    paddingVertical: 8,
    alignItems: "center",
    backgroundColor: "#4F6AFA",
    elevation: 8,
  },
  text: {
    fontSize: 16,
    color: "#fff",
  },
});

export default function Notification({ label }: Props) {
  return (
    <View style={styles.toast}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}
