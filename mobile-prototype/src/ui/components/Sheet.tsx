import { ReactNode } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

type Props = {
  style?: ViewStyle;
  children?: ReactNode;
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    backgroundColor: "#fff",
    padding: 20,
  },
});

export default function Sheet({ style, children }: Props) {
  return <View style={[styles.container, style]}>{children}</View>;
}
