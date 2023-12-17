import useSWR from "swr";
import useAuthState from "../auth/useAuthState";

export default function useBalanceValue() {
  const [authState] = useAuthState();

  return useSWR<{ balance: number }>(
    authState.user && `/user/${authState.user.uid}/balance`,
    (key: string) =>
      fetch(import.meta.env.VITE_BOSOM_API_BASE + key).then((response) =>
        response.json(),
      ),
  );
}
