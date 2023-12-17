import toast from "react-hot-toast";
import websocketPlugin from "../../utils/CordovaWebsocketPlugin";
import { TypedEvent } from "../../utils/event";
import { startCooling } from "./device";

type FutokoroEvent = { type: "cooldown"; lengthSec: number };

export const futokoroEvent = new TypedEvent<FutokoroEvent>();

let onUserIdChangeCallback: () => void;

let userId: string | undefined;

export function changeFutokoroServiceUserId(id: string | undefined) {
  if (userId === id) {
    return;
  }

  userId = id;

  if (onUserIdChangeCallback) {
    onUserIdChangeCallback();
  }
}

export default async function startFutokoroService() {
  const websocket = await websocketPlugin();

  let websocketId: unknown | undefined;

  onUserIdChangeCallback = () => {
    if (websocketId !== undefined) {
      websocket.wsClose(websocketId);
      websocketId = undefined;
    }

    if (!userId) {
      return null;
    }

    const onReceive = (data: any) => {
      const event = JSON.parse(data.message) as FutokoroEvent;
      futokoroEvent.emit(event);
      startCooling(event.lengthSec);
    };

    const onConnect = (ev: { websocketId: unknown }) => {
      console.log("WebSocket ID", ev.websocketId);
      websocketId = ev.websocketId;
    };

    const onError = (error: any) => {
      websocketId = undefined;
      console.log(error.code, error.reason);
      toast.error("Error duling connecting to RTC");
    };

    websocket.wsConnect(
      {
        url:
          import.meta.env.VITE_BOSOM_REALTIME_API_BASE +
          `/user/${userId}/futokoro`,
      },
      onReceive,
      onConnect,
      onError,
    );
    console.log(
      "Connecting",
      import.meta.env.VITE_BOSOM_REALTIME_API_BASE + `/user/${userId}/futokoro`,
    );
  };

  onUserIdChangeCallback();
}
