import { useCallback } from "react";
import useAuth from "../features/auth/useAuth";
import { startCooling } from "../features/futokoro/device";
import Card from "../features/ui/Card";
import Button from "../features/ui/Button";
import { css } from "@emotion/react";

const cardTitle = css`
  margin-top: 20rem;
  line-height: 22rem;
  font-size: 16rem;
  margin-bottom: 8rem;
  font-weight: 700;
  color: #5f6877;
`;

const connectionSectionTitle = css`
  font-size: 16rem;
  line-height: 22rem;
  color: #4f6afa;
  font-weight: 700;
  text-align: center;
`;

const debugGridButton = css`
  display: block;
  width: 108rem;
  margin: auto;
`;

export default function ConfigPage() {
  const { logout } = useAuth();

  const onStartCooling = useCallback(() => {
    startCooling(10);
  }, []);

  return (
    <>
      <div css={{ width: "100%", padding: "20rem" }}>
        <div css={{ marginTop: "20rem" }}>
          <div
            css={{ textAlign: "center", fontSize: "24rem", color: "#5F6877" }}
          >
            システム操作
          </div>
        </div>
        <div css={cardTitle}>連携中</div>
        <Card>
          <div css={connectionSectionTitle}>連携中のデバイスはありません</div>
          <div css={{ textAlign: "center", marginTop: "7rem" }}>
            <Button onClick={() => {}}>連携する</Button>
          </div>
          <hr css={{ marginBlock: "12rem", marginInline: "4rem" }} />
          <div css={connectionSectionTitle}>
            連携中のSwitchBotアカウントはありません
          </div>
          <div css={{ textAlign: "center", marginTop: "7rem" }}>
            <Button onClick={() => {}}>連携する</Button>
          </div>
        </Card>

        <div css={cardTitle}>操作</div>
        <Card>
          <div
            css={{
              display: "grid",
              gridTemplate: "1fr 1fr / 1fr 1fr",
              gap: "20rem 37rem",
            }}
          >
            <Button addCss={debugGridButton} onClick={onStartCooling}>
              100
            </Button>
            <Button addCss={debugGridButton} onClick={onStartCooling}>
              500
            </Button>
            <Button addCss={debugGridButton} onClick={onStartCooling}>
              3000
            </Button>
            <Button addCss={debugGridButton} onClick={onStartCooling}>
              10000
            </Button>
          </div>
        </Card>
        <div css={{ marginTop: "20rem", textAlign: "right" }}>
          <Button onClick={logout}>ログアウト</Button>
        </div>
      </div>
    </>
  );
}
