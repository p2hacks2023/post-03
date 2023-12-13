import { Button, View } from "react-native";
import { onGoogleLoginRequested } from "../signin/google";

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
    </View>
  );
}
