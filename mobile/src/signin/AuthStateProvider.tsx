import { ReactNode, useEffect, useState } from "react";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import AuthStateContext from "./AuthStateContext";

type Props = {
  children: ReactNode;
};

export default function AuthStateProvider({ children }: Props) {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | undefined>();

  // Handle user state changes
  const onAuthStateChanged = (user: FirebaseAuthTypes.User | null) => {
    setUser(user ?? undefined);
    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  return (
    <AuthStateContext.Provider value={{ initializing, user }}>
      {children}
    </AuthStateContext.Provider>
  );
}
