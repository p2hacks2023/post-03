import { useContext, useEffect, useState } from "react";
import AuthStateContext from "./AuthStateContext";

export default function useAuthState() {
  return useContext(AuthStateContext);
}
