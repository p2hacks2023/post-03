/// <reference types="cordova-plugin-ble-central" />

import toast from "react-hot-toast";

const SERVICE_ID = "4c210b69-05e5-44e2-9ae2-c2b1a75df030";
const PUSH_CHARACTERISTIC_ID = "bde2f59b-4408-48dc-86bc-231841c8390b";

export function startCooling(sec: number) {
  if (sec > 200) {
    sec = 200;
  }

  const onSuccess = () => {
    toast.success("懐温を下げています…");
  };

  const onConnect = (device: BLECentralPlugin.PeripheralData) => {
    const data = new Uint8Array(1);
    data[0] = sec;

    const deviceIdJson = localStorage.getItem("deviceid");

    if (!deviceIdJson) {
      return null;
    }

    const deviceId = JSON.parse(deviceIdJson);

    if (device.id !== deviceId) {
      return null;
    }

    const onPushed = () => {
      ble.disconnect(device.id);
      onSuccess();
    };

    const onError = () => {
      ble.disconnect(device.id);
    };

    ble.write(
      device.id,
      SERVICE_ID,
      PUSH_CHARACTERISTIC_ID,
      data.buffer,
      onPushed,
      onError,
    );
  };

  const onFound = (device: BLECentralPlugin.PeripheralData) => {
    console.log("Found cooling device", device.id);
    const id = device.id;

    ble.connect(id, onConnect, console.error);
  };

  console.log("Start scan");

  ble.scan([SERVICE_ID], 10, onFound, console.error);
}
