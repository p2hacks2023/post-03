import {
  PrepaidPaymentMethod,
  PrepaidPaymentMethodRepository,
} from "./domain";
import { FirebaseUserDocument } from "../../types";
import firebasePlugin from "../../utils/firebasePlugin";

export class FirebasePrepaidPaymentMethodRepository
  implements PrepaidPaymentMethodRepository
{
  constructor() {}

  async get(id: { userId: string; id: string }): Promise<PrepaidPaymentMethod> {
    const firebase = await firebasePlugin();
    const document = await new Promise<FirebaseUserDocument>((resolve, reject) => firebase.fetchDocumentInFirestoreCollection(id.userId, "users", resolve, reject));
    const credit = document.prepaidCredits?.[id.id] ?? 0;

    return PrepaidPaymentMethod.assembly({
      id: id.id,
      userId: id.userId,
      credit: credit,
    });
  }

  async set(item: PrepaidPaymentMethod): Promise<void> {
    const disassembled = item.disassembly();
    const firebase = await firebasePlugin();

    await new Promise<void>((resolve, reject) => firebase.updateDocumentInFirestoreCollection(disassembled.userId, {
      [`prepaidCredits.${disassembled.id}`]: disassembled.credit,
    }, "users", false, resolve, reject));
  }
}
