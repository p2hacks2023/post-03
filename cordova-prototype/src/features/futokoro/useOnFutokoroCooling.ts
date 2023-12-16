import { useEffect } from "react";
import { futokoroEvent } from "./service";

export default function useOnFutokoroEvent(callback: (lengthSec: number) => void) {
  useEffect(() => {
    const disposable = futokoroEvent.on(event => {
      callback(event.lengthSec)
    });

    return () => {
      disposable.dispose();
    }
  }, [callback]);
}
