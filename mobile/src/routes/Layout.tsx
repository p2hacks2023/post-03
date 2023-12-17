import { Outlet } from "react-router-dom";
import useAuthState from "../features/auth/useAuthState";
import LoginPage from "../pages/LoginPage";
import Navigator from "../features/ui/Navigator";
import useOnFutokoroCooling from "../features/futokoro/useOnFutokoroCooling";
import toast from "react-hot-toast";

export default function Layout() {
  const [authState] = useAuthState();

  useOnFutokoroCooling((sec) => {
    toast.error("懐温を下げています…");
  });

  if (authState.initializing) {
    console.log("Initializing auth state...");
    return null;
  }

  if (!authState.user) {
    return <LoginPage />;
  }

  return (
    <>
      <div css={{ display: "flex", flex: 1, justifyContent: "center", overflow: "scroll" }}>
        <Outlet />
      </div>
      <Navigator />
    </>
  );
}
