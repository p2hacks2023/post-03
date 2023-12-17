import { Slot } from "expo-router";
import Layout from "../src/global/Layout";
import useAuthState from "../src/signin/useAuthState";
import AuthStateProvider from "../src/signin/AuthStateProvider";
import startPrepaidCardService from "../src/prepaid/service";
import { useEffect } from "react";
import startFutokoroService from "../src/futokoro/service";

export default function Root() {

  return <AuthStateProvider>
    <PageLayout />
  </AuthStateProvider>
}

export function PageLayout() {
  const {initializing, user} = useAuthState();

  useEffect(() => {
    const stopPrepaidCardService = startPrepaidCardService();
    const stopFutokoroService = startFutokoroService("ReactRoot");

    return () => {
      stopPrepaidCardService();
      stopFutokoroService();
    }
  }, []);

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
