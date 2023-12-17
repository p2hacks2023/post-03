import { ActivityIndicator, View } from "react-native";

import useAuthState from "../src/signin/useAuthState";
import Dashboard from "../src/pages/Dashboard";
import Login from "../src/pages/Login";

export default function App() {
  const {initializing, user} = useAuthState();

  if (initializing) {
    return <View>
      <ActivityIndicator />
    </View>
  }

  if (user) {
    return <Dashboard />
  } else {
    return <Login />
  }
}
