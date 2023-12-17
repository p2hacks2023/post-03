import { AuthState } from "./types";

export default async function getAuthState(): Promise<AuthState | undefined> {
  const mayAuthState = localStorage.getItem("authState");
  
  if (!mayAuthState) {
    return;
  }
  
  return JSON.parse(mayAuthState);
}
