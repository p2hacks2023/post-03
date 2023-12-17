import type firestoreConstructor from "@react-native-firebase/firestore";
import {
  PrepaidPaymentMethod,
  PrepaidPaymentMethodRepository,
} from "../logic/prepaid";
import { FirebaseUserDocument } from "../types";

export class FirebasePrepaidPaymentMethodRepository
  implements PrepaidPaymentMethodRepository
{
  constructor(private firestore: ReturnType<typeof firestoreConstructor>) {}

  async get(id: { userId: string; id: string }): Promise<PrepaidPaymentMethod> {
    const document = await this.firestore
      .doc<FirebaseUserDocument>(`users/${id.userId}`)
      .get();

    const credit = document.data()?.prepaidCredits?.[id.id] ?? 0;

    return PrepaidPaymentMethod.assembly({
      id: id.id,
      userId: id.userId,
      credit: credit,
    });
  }

  async set(item: PrepaidPaymentMethod): Promise<void> {
    const disassembled = item.disassembly();
    await this.firestore
      .doc<FirebaseUserDocument>(`users/${disassembled.userId}`)
      .update({
        [`prepaidCredits.${disassembled.id}`]: disassembled.credit,
      });
  }
}
