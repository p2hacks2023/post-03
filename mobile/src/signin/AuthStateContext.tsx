import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { createContext, useContext } from "react";
import { AuthState } from "./AuthState";

const AuthStateContext = createContext<AuthState>({
  initializing: true,
  user: undefined,
});

export default AuthStateContext;
