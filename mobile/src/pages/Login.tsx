import { Button, View } from "react-native";
import { onGoogleLoginRequested } from "../signin/google";

export default function Login() {
  return (
    <View>
      <Button
        title="Google Sign-In"
        onPress={() => {
          onGoogleLoginRequested().then(() =>
            console.log("Signed in with Google!")
          );
        }}
      />
    </View>
  );
}
