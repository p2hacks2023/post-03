import { Button, View } from "react-native";
import { onAnonymousLoginRequsted, onGoogleLoginRequested } from "../signin/google";

export default function Login() {
  return (
    <View style={{flex: 1, justifyContent: "center"}}>
      <Button
        title="Google Sign-In"
        onPress={() => {
          onGoogleLoginRequested().then(() =>
            console.log("Signed in with Google!")
          );
        }}
      />
      <Button
        title="Start Without login"
        onPress={() => {
          onAnonymousLoginRequsted().then(() =>
            console.log("Anonymous login!")
          );
        }}
      />
    </View>
  );
}
