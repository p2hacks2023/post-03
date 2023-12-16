import { useCallback } from "react";
import useAuth from "../features/auth/useAuth";
import { startCooling } from "../features/futokoro/device";
import Card from "../features/ui/Card";
import Button from "../features/ui/Button";
import { css } from "@emotion/react";
import { useBoolean } from "usehooks-ts";
import Modal from "../features/ui/Modal";
import useStep from "../utils/useStep";
import toast from "react-hot-toast";

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

const modalTitle = css`
  color: #8b8b8b;
  text-align: center;
  font-size: 24rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const modalDescription = css`
  color: #000;
  margin-top: 14rem;
  font-size: 16rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const modalHint = css`
  color: #000;
  font-size: 12rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  text-align: center;
  margin-top: 20rem;
`;

const modalSuccess = css`
  margin-top: 32rem;
  color: #000;
  text-align: center;
  font-size: 24rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const link = css`
  color: #8b8b8b;
  font-size: 12rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  text-decoration-line: underline;
`;

const input = css`
  display: block;
  padding: 12px;
  border: none;
  border-radius: 20rem;
  background: #d9d9d9;
  color: #8b8b8b;
  font-size: 12rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  width: 100%;
  padding: 12rem;
  box-sizing: border-box;
`;

export default function ConfigPage() {
  const { logout } = useAuth();

  const onStartCooling = useCallback(() => {
    startCooling(10);
  }, []);

  const {
    value: isDeviceModalOpen,
    setTrue: openDeviceModal,
    setFalse: closeDeviceModal,
  } = useBoolean(false);

  const deviceModalStep = useStep(2);

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
            <Button onClick={openDeviceModal}>連携する</Button>
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
        <div css={cardTitle}>デバッグ</div>
        <Card>
          <div
            css={{
              display: "grid",
              gridTemplate: "1fr 1fr / 1fr 1fr",
              gap: "20rem 37rem",
            }}
          >
            <Button addCss={debugGridButton} onClick={() => toast.success("Hello!")}>
              Toast success
            </Button>
          </div>
        </Card>

      </div>
      <Modal
        isOpen={isDeviceModalOpen}
        onClose={() => {
          closeDeviceModal();
          deviceModalStep.reset();
        }}
      >
        {() => {
          switch (deviceModalStep.step) {
            case 0:
              return (
                <div>
                  <div css={modalTitle}>デバイス連携</div>
                  <div css={[modalDescription]}>
                    シリアルコードを入力してください
                  </div>
                  <input
                    type="text"
                    css={[
                      input,
                      css`
                        margin-top: 8rem;
                      `,
                    ]}
                    placeholder="ここにシリアルコードをコピー"
                  />
                  <div css={modalHint}>
                    シリアルコードの取得方法は<span css={link}>こちら</span>
                    をご覧ください
                  </div>
                  <div
                    css={css`
                      display: flex;
                      justify-content: space-between;
                      margin-top: 68rem;
                    `}
                  >
                    <Button
                      addCss={css`
                        background-color: #e0e3e9;
                      `}
                      onClick={closeDeviceModal}
                    >
                      キャンセル
                    </Button>
                    <Button
                      addCss={css`
                        background-color: #e0e3e9;
                      `}
                      onClick={deviceModalStep.nextStep}
                    >
                      完了
                    </Button>
                  </div>
                </div>
              );
            case 1:
              return (
                <div>
                  <div css={modalTitle}>デバイス連携</div>
                  <div css={modalSuccess}>連携が完了しました！</div>
                  <div
                    css={css`
                      display: flex;
                      justify-content: flex-end;
                      margin-top: 32rem;
                    `}
                  >
                    <Button
                      addCss={css`
                        background-color: #e0e3e9;
                      `}
                      onClick={() => {
                        closeDeviceModal();
                        deviceModalStep.reset();
                      }}
                    >
                      とじる
                    </Button>
                  </div>
                </div>
              );
            default:
              return "Fuck off";
          }
        }}
      </Modal>
    </>
  );
}
