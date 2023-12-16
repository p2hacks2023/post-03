import { useCallback } from "react";
import useAuth from "../features/auth/useAuth";
import { startCooling } from "../features/futokoro/device";

export default function ConfigPage() {
  const { logout } = useAuth();

  const onStartCooling = useCallback(() => {
    startCooling(10);
  }, []);

  return (
    <>
      <button onClick={logout}>Logout</button>
      <button onClick={onStartCooling}>Debug[10]</button>
    </>
  );
}
