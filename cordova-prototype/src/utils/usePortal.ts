import { ReactNode } from "react";
import ReactDOM from "react-dom";

export default function usePortal() {
  const portal = document.getElementById("portal");

  if (!portal) {
    throw new Error("Failed to get portal!");
  }

  return (node: ReactNode) =>
    ReactDOM.createPortal(node, portal);
}
