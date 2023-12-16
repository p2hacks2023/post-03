import { requestAnonymousLogin, requestLogout } from "./control";
import useAuthState from "./useAuthState";
import { useCallback, useEffect } from "react";

export default function useAuth() {
  const [_, setAuthState] = useAuthState();

  useEffect(() => {
    setAuthState(value => ({...value, initializing: false}));
  }, []);

  const loginAsAnonymous = useCallback(async () => {
    const { uid } = await requestAnonymousLogin();

    setAuthState({
      initializing: false,
      user: {
        uid: uid
      }
    })
  }, []);

  const logout = useCallback(async () => {
    await requestLogout();
    setAuthState({
      initializing: false,
      user: undefined
    });
  }, []);

  return {
    loginAsAnonymous,
    logout
  }
}
