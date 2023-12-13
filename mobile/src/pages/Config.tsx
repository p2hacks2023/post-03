import { ScrollView, StyleSheet, Text, View } from "react-native"
import Sheet from "../ui/components/Sheet";
import Button from "../ui/components/Button";
import { onLogoutRequested } from "../signin/google";

const styles = StyleSheet.create({
  titleContainer: {
    flex: 0,
    marginTop: 60,
    marginBottom: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    lineHeight: 33,
    color: "#fff",
  },
  section: {
    marginBottom: 24
  },
  sectionTitle: {
    fontSize: 16,
    lineHeight: 22,
    color: "#fff",
    marginBottom: 8
  },
  inner: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20
  }
});

export default function Config() {
  return <>
    <View style={styles.titleContainer}>
      <Text style={styles.title}>システム操作</Text>
    </View>
    <ScrollView style={styles.inner}>
      <View style={styles.section}>
      <Text style={[styles.sectionTitle]}>連携中</Text>
        <Sheet>
          <Text>Hi!</Text>
        </Sheet>
      </View>
      <View style={styles.section}>
      <Text style={[styles.sectionTitle]}>Debug</Text>
        <Sheet>
          <Button label="ログアウト" onPress={onLogoutRequested} />
        </Sheet>
      </View>
    </ScrollView>
  </>
}