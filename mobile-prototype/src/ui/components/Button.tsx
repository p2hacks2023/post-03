import { Pressable, Text, StyleSheet, View } from "react-native";

type Props = {
  label: string;
  onPress: () => void;
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#d9d9d9",
    borderRadius: 999,
    overflow: "hidden",
  },
  pressable: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
  },
});

export default function Button({ label, onPress }: Props) {
  return (
    <View style={styles.button}>
      <Pressable
        style={styles.pressable}
        android_ripple={{ color: "#8b8b8b" }}
        onPress={onPress}
      >
        <Text style={styles.label}>{label}</Text>
      </Pressable>
    </View>
  );
}
