import { getLoginState } from "../signin/google";

export interface FutokoroService {
  cooldownBySpentEstateJpy(userId: string, spent: number): void;
}

export class LocalFutokoroServiceImpl implements FutokoroService {
  constructor(private futokoroDevice: FutokoroDevice) {}

  cooldownBySpentEstateJpy(userId: string, spent: number): void {
    const currentUid = getLoginState()?.uid;

    if (userId !== currentUid) {
      console.warn("User id is not same with current logged in user!");
      console.warn(
        `Login uid: ${currentUid}, cooldown requested id: ${userId}`
      );
    }

    if (spent < 100) {
      this.futokoroDevice.requestCooldownSec(5);
    } else if (spent < 500) {
      this.futokoroDevice.requestCooldownSec(15);
    } else if (spent < 1000) {
      this.futokoroDevice.requestCooldownSec(30);
    } else if (spent < 10000) {
      // Go to hell
      this.futokoroDevice.requestCooldownSec(Infinity);
    }
  }
}

interface FutokoroDevice {
  requestCooldownSec(sec: number): void;
}

export class MockFutokoroDevice implements FutokoroDevice {
  constructor() {}

  requestCooldownSec(sec: number): void {
    console.log("Mock Futokoro Cooling:", sec);
  }
}
