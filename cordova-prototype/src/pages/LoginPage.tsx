import useAuth from "../features/auth/useAuth";

export default function LoginPage() {
  const { loginAsAnonymous } = useAuth();
  return (
    <>
      LoginPage
      <button onClick={loginAsAnonymous}>Login as anonymous</button>
    </>
  );
}
