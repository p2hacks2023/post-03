import firestore from "@react-native-firebase/firestore";
import { FirebaseUserDocument } from "../types";
import { TypedEvent } from "../utils/eventemitter";
import auth from "@react-native-firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";

type FutokoroEvent = {
  type: "futokoro";
};

export const futokoroEvent = new TypedEvent<FutokoroEvent>();

export default function startFutokoroService(serviceId: string) {
  console.log("Futokoro service start!");
  let unListen: () => void | undefined;

  const onAuthStateChanged = (user: FirebaseAuthTypes.User | null) => {
    if (unListen) {
      unListen();
    }

    if (!user) {
      return;
    }

    const storageKey = `futokoroLastInvoke__${serviceId}`;

    unListen = firestore()
      .doc<FirebaseUserDocument>(`users/${user.uid}`)
      .onSnapshot(async (snapshot) => {
        console.log("Got user change");
        const lastInvoked = await AsyncStorage.getItem(storageKey);
        const cooldown = snapshot.data()?.cooldown;

        if (!cooldown) {
          return;
        }

        await AsyncStorage.setItem(storageKey, cooldown.lastUpdate);

        console.log("Last futokoro cool start in", cooldown.lastUpdate);

        if (lastInvoked === cooldown.lastUpdate) {
          return;
        }

        console.log("Invoking futokoro device");

        futokoroEvent.emit({
          type: "futokoro",
        });

        // TODO: BLEをばら撒く
      });
  };

  const subscriber = auth().onAuthStateChanged(onAuthStateChanged);

  return () => {
    unListen();
    subscriber();
  };
}
