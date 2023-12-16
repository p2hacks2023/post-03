import { mutate } from "swr";
import { getLastSuicaRemainCredit } from "../../plugins/nfc/src/BosomNfcPlugin";
import getCurrentUser from "../auth/utils";

export default function startPrepaidCardService() {
  console.log("Prepaidcard service start!");

  // TODO: 複数カード対応
  let previousCredit: number | undefined = undefined;
  const intervalHandler = setInterval(async () => {
    const credit = await getLastSuicaRemainCredit();

    if (credit !== previousCredit) {
      console.log("Updating credit...");

      const uid = (await getCurrentUser())?.user?.uid;

      console.log("uid", uid);

      if (!uid) {
        console.error("Prepaid credit updated but not logged in!");
        return;
      }

      const response = await fetch(import.meta.env.VITE_BOSOM_API_BASE + `/user/${uid}/credit`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({credit: credit})
      });

      if (!response.ok) {
        console.error("Failed to send credit!");
        return;
      }

      mutate(() => true);

      previousCredit = credit;
    }
  }, 1000);

  return () => {
    clearInterval(intervalHandler);
  };
}
