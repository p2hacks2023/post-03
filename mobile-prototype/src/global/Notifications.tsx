import Notification from "../ui/components/Notification";
import { useEffect, useState } from "react";
import { futokoroEvent } from "../futokoro/service";

export default function Notifications() {
  const [showFutokoroNotification, setShowFutokoroNotification] =
    useState(false);

  useEffect(() => {
    futokoroEvent.on((event) => {
      if (event.type === "futokoro") {
        setShowFutokoroNotification(true);
      }
      setTimeout(() => {
        setShowFutokoroNotification(false);
      }, 5000);
    });
  }, []);

  return (
    <>
      {showFutokoroNotification && <Notification label="懐温を下げています…" />}
    </>
  );
}
