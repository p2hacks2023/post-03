import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { router } from "expo-router";

GoogleSignin.configure({
  webClientId:
    "652033494392-od2j0uof3bttgfcoc6tna4av525hascr.apps.googleusercontent.com",
});

export async function onGoogleLoginRequested() {
  // Check if your device supports Google Play
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  // Get the users ID token
  const { idToken } = await GoogleSignin.signIn();

  // Create a Google credential with the token
  const googleCredential = auth.GoogleAuthProvider.credential(idToken);

  // Sign-in the user with the credential
  return auth().signInWithCredential(googleCredential);
}

export async function onLogoutRequested() {
  await auth().signOut();
  router.replace("/");
}

export function getLoginState() {
  return auth().currentUser;
}

export async function onAnonymousLoginRequsted() {
  await auth().signInAnonymously()
}
