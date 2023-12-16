import { ReactNode, useEffect, useState } from "react";
import { AuthState } from "./types";
import firebasePlugin from "../../utils/firebasePlugin";
import AuthStateContext from "./AuthStateContext";
import getCurrentUser from "./utils";

type Props = {
  children: ReactNode;
};

export default function AuthStateProvider({ children }: Props) {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<AuthState["user"] | undefined>();

  useEffect(() => {
    (async () => {
      const firebase = await firebasePlugin();
      console.log("Authentication check");
      const signedIn = await new Promise(firebase.isUserSignedIn);

      if (signedIn) {
        const user = await getCurrentUser();
        if (!user) {
          console.error("something weth wrong");
        } else {
          await new Promise<void>((resolve, reject) =>
            firebase.updateDocumentInFirestoreCollection(
              user?.uid,
              {},
              "users",
              false,
              resolve,
              reject,
            ),
          );
          setUser(user);
        }
      } else {
        setUser(undefined);
      }

      setInitializing(false);

      firebase.registerAuthStateChangeListener(async (signedIn) => {
        if (!signedIn) {
          setUser(undefined);
        } else {
          setUser(await new Promise(firebase.getCurrentUser));
        }
        setInitializing(false);
      });
    })();
  }, []);

  return (
    <AuthStateContext.Provider value={{ initializing, user }}>
      {children}
    </AuthStateContext.Provider>
  );
}
