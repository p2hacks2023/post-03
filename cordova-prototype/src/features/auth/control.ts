import firebasePlugin from "../../utils/firebasePlugin";

export async function requestAnonymousLogin(): Promise<{ uid: string }> {
  const response = await fetch(
    import.meta.env.VITE_BOSOM_API_BASE + "/user/create",
    {
      method: "POST"
    }
  );

  console.log(import.meta.env.VITE_BOSOM_API_BASE + "/user/create");

  if (!response.ok) {
    throw new Error("Failed to login");
  }

  const result = (await response.json()) as { uid: string };

  console.log(JSON.stringify(result));

  return result;
}

export async function onLogoutRequested() {
  await new Promise<void>((await firebasePlugin()).signOutUser);
}
