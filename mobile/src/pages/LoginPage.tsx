import useAuth from "../features/auth/useAuth";
import { css } from "@emotion/react";
import Button from "../features/ui/Button";
import Logo from "../assets/futocool_logo.png";

export default function LoginPage() {
  const { loginAsAnonymous } = useAuth();
  return (
    <div
      css={{
        display: "flex",
        flex: 1,
        justifyContent: "center",
        overflow: "scroll",
        padding: "20rem",
      }}
    >
      <div
        css={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          justifyContent: "stretch",
          width: "100%",
          padding: "20rem",
        }}
      >
        <div css={{ marginTop: "20rem" }}>
          <div
            css={{ textAlign: "center", fontSize: "24rem", color: "#5F6877" }}
          >
            <img
              css={css`
                width: 240rem;
              `}
              src={Logo}
              alt="futocool"
            />
          </div>
        </div>
        <div
          css={css`
            display: flex;
            justify-content: center;
            flex-direction: column;
            flex: 1;
          `}
        >
          <Button onClick={loginAsAnonymous}>デバイスを使用してログイン</Button>
        </div>
      </div>
    </div>
  );
}
