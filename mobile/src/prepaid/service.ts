import { FirebaseFutokoroServiceImpl } from "../logic/futokoro";
import { PrepaidPaymentServiceImpl } from "../logic/prepaid";
import { lastRemainCredit } from "../nfc";
import { FirebasePrepaidPaymentMethodRepository } from "./firebase";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

export default function startPrepaidCardService() {
  console.log("Prepaidcard service start!");

  const prepaidPaymentService = new PrepaidPaymentServiceImpl(
    new FirebasePrepaidPaymentMethodRepository(firestore()),
    new FirebaseFutokoroServiceImpl(firestore())
  );

  // TODO: 複数カード対応
  let previousCredit: number | undefined = undefined;
  const intervalHandler = setInterval(async () => {
    const credit = await lastRemainCredit();

    if (credit !== previousCredit) {
      console.log("Updating credit...");
      const uid = auth().currentUser?.uid;
      console.log("uid", uid);

      if (!uid) {
        console.error("Prepaid credit updated but not logged in!");
        return;
      }

      prepaidPaymentService.updateCredit("suica", uid, credit);

      previousCredit = credit;
    }
  }, 1000);

  return () => {
    clearInterval(intervalHandler);
  };
}
