import { FirebasePlugin } from "cordova-plugin-firebasex";

let rawFirebasePlugin: Promise<FirebasePlugin> = new Promise((resolve, reject) => {
  document.addEventListener("deviceready", () => {
    const mayFirebasePlugin = (window as unknown as {FirebasePlugin?: FirebasePlugin}).FirebasePlugin

    if (mayFirebasePlugin) {
      resolve(mayFirebasePlugin);
    } else {
      reject(new Error("Failed to initialize firebase?"));
    }
  });  
});

export default async function firebasePlugin(): Promise<FirebasePlugin> {
  return await rawFirebasePlugin;
  /*if (!rawFirebasePlugin) {
    throw new Error("FirebasePlugin requested before devicestart");
  }

  return rawFirebasePlugin;*/
}
