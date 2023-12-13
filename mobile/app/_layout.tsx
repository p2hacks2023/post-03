import { Slot } from "expo-router";
import { Text } from "react-native";
import Layout from "../src/global/Layout";
import useAuthState from "../src/signin/useAuthState";
import AuthStateProvider from "../src/signin/AuthStateProvider";

export default function Root() {
  return <AuthStateProvider>
    <PageLayout />
  </AuthStateProvider>
}

export function PageLayout() {
  const {initializing, user} = useAuthState();

  if (initializing) {
    return null;
  }

  if (user) {
    return <Layout>
      <Slot />
    </Layout>
  } else {
    return <Slot />
  }
}
