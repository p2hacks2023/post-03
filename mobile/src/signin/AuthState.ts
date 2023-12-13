import { FirebaseAuthTypes } from "@react-native-firebase/auth";

export type AuthState = {
  initializing: boolean;
  user: FirebaseAuthTypes.User | undefined;
};
