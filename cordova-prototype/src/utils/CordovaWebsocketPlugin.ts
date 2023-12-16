let rawWebsocketPlugin: Promise<any> = new Promise((resolve, reject) => {
  document.addEventListener("deviceready", () => {
    const mayFirebasePlugin = (window as any).CordovaWebsocketPlugin

    if (mayFirebasePlugin) {
      resolve(mayFirebasePlugin);
    } else {
      reject(new Error("Failed to initialize websocket plugin?"));
    }
  });  
});

export default async function websocketPlugin(): Promise<{wsConnect: any, wsClose: any }> {
  return await rawWebsocketPlugin;
}
