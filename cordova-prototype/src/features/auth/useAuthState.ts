import { useLocalStorage } from "usehooks-ts";
import { AuthState } from "./types";

export default function useAuthState() {
  return useLocalStorage<AuthState>("authState", {
    initializing: false,
    user: undefined
  });
}
