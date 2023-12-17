import { createContext } from "react";
import { AuthState } from "./types";

const AuthStateContext = createContext<AuthState>({
  initializing: true,
  user: undefined,
});

export default AuthStateContext;
