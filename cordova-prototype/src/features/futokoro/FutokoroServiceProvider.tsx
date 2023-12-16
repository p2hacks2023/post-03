import { ReactNode, useEffect } from "react";
import useAuthState from "../auth/useAuthState";
import { changeFutokoroServiceUserId } from "./service";

type Props = {
  children: ReactNode;
};

export default function FutokoroServiceProvider({ children }: Props) {
  const [authUser] = useAuthState();

  const uid = authUser.user?.uid;

  useEffect(() => {
    changeFutokoroServiceUserId(uid);
  }, [uid]);

  return <>{children}</>;
}
