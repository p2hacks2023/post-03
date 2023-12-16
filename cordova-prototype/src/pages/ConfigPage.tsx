import { useCallback, useEffect, useRef } from "react";
import useAuth from "../features/auth/useAuth";
import { startCooling } from "../features/futokoro/device";
import Card from "../features/ui/Card";
import Button from "../features/ui/Button";
import { css } from "@emotion/react";
import { useBoolean, useLocalStorage } from "usehooks-ts";
import Modal from "../features/ui/Modal";
import useStep from "../utils/useStep";
import toast from "react-hot-toast";
import getAuthState from "../features/auth/utils";
import { mutate } from "swr";
import useSwitchBotApiTokenExists from "../features/switchbot/useSwitchBotApiTokenExists";


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

const connectedDeviceLabel = css`
  color: #5f6877;
  font-family: Noto Sans;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
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
  const [deviceId, setDeviceId] = useLocalStorage<string | null>(
    "deviceid",
    null,
  );
  const deviceIdInput = useRef<HTMLInputElement>(null);

  const onDeviceIdSubmit = () => {
    if (!deviceIdInput.current) {
      return;
    }

    const deviceId = deviceIdInput.current.value;

    setDeviceId(deviceId);

    deviceModalStep.nextStep();
  };

  const onDeviceDisable = () => {
    setDeviceId(null);
  };

  const {
    value: isSwitchBotModalOpen,
    setTrue: openSwitchBotModal,
    setFalse: closeSwitchBotModal,
  } = useBoolean(false);
  const switchBotModalStep = useStep(2);
  const switchBotApiTokenExists = useSwitchBotApiTokenExists();

  const switchBotTokenInput = useRef<HTMLInputElement>(null);
  const switchBotSecretInput = useRef<HTMLInputElement>(null);

  const onSwitchBotFormSubmit = async () => {
    const authState = await getAuthState();
    const userId = authState?.user?.uid;

    if (!userId) {
      throw new Error("そんなわけない");
    }

    if (!switchBotTokenInput.current || !switchBotSecretInput.current) {
      return;
    }

    const switchBotToken = switchBotTokenInput.current.value;
    const switchBotSecret = switchBotSecretInput.current.value;

    // TODO: 送信

    const response = await fetch(
      import.meta.env.VITE_BOSOM_API_BASE +
        `/user/${authState.user?.uid}/switchbot`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          token: switchBotToken,
          secret: switchBotSecret,
        }),
      },
    );

    if (!response.ok) {
      toast.error("Failed to submit switchbot api");
      return;
    }

    mutate(() => true);

    switchBotModalStep.nextStep();
  };

  const onSwitchBotDisable = async () => {
    const authState = await getAuthState();
    const userId = authState?.user?.uid;

    if (!userId) {
      throw new Error("そんなわけない");
    }

    const response = await fetch(
      import.meta.env.VITE_BOSOM_API_BASE +
        `/user/${authState.user?.uid}/switchbot`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      toast.error("Failed to delete switchbot api key");
      return null;
    }

    mutate(() => true);
  };

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
          {deviceId ? (
            <div
              css={css`
                display: flex;
                justify-content: space-between;
                align-items: center;
              `}
            >
              <div css={connectedDeviceLabel}>デバイス</div>
              <Button onClick={onDeviceDisable}>連携解除</Button>
            </div>
          ) : (
            <div>
              <div css={connectionSectionTitle}>
                連携中のデバイスはありません
              </div>
              <div
                css={css`
                  margin-top: 7rem;
                  text-align: center;
                `}
              >
                <Button onClick={openDeviceModal}>連携する</Button>
              </div>
            </div>
          )}
          <hr css={{ marginBlock: "12rem", marginInline: "4rem" }} />
          {switchBotApiTokenExists.data ? (
            <div
              css={css`
                display: flex;
                justify-content: space-between;
                align-items: center;
              `}
            >
              <div css={connectedDeviceLabel}>SwitchBot</div>
              <Button onClick={onSwitchBotDisable}>連携解除</Button>
            </div>
          ) : (
            <div>
              <div css={connectionSectionTitle}>
                連携中のSwitchBotアカウントはありません
              </div>
              <div css={{ textAlign: "center", marginTop: "7rem" }}>
                <Button onClick={openSwitchBotModal}>連携する</Button>
              </div>
            </div>
          )}
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
            <Button
              addCss={debugGridButton}
              onClick={() => toast.success("Hello!")}
            >
              Toast success
            </Button>
          </div>
        </Card>
      </div>
      <Modal
        isOpen={isSwitchBotModalOpen}
        onClose={() => {
          mutate(() => {});
          closeSwitchBotModal();
          switchBotModalStep.reset();
        }}
      >
        {() => {
          switch (switchBotModalStep.step) {
            case 0:
              return (
                <div>
                  <div css={modalTitle}>SwitchBot連携</div>
                  <div css={[modalDescription]}>APIキーを入力してください</div>
                  <input
                    type="text"
                    css={[
                      input,
                      css`
                        margin-top: 8rem;
                      `,
                    ]}
                    placeholder="ここにトークンをコピー"
                    ref={switchBotTokenInput}
                  />
                  <input
                    type="text"
                    css={[
                      input,
                      css`
                        margin-top: 8rem;
                      `,
                    ]}
                    placeholder="ここにシークレットをコピー"
                    ref={switchBotSecretInput}
                  />

                  <div css={modalHint}>
                    トークン及びシークレットの取得方法は
                    <span css={link}>こちら</span>
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
                      onClick={closeSwitchBotModal}
                    >
                      キャンセル
                    </Button>
                    <Button
                      addCss={css`
                        background-color: #e0e3e9;
                      `}
                      onClick={onSwitchBotFormSubmit}
                    >
                      完了
                    </Button>
                  </div>
                </div>
              );
            case 1:
              return (
                <div>
                  <div css={modalTitle}>SwitchBot連携</div>
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
                        mutate(() => {});
                        closeSwitchBotModal();
                        switchBotModalStep.reset();
                      }}
                    >
                      とじる
                    </Button>
                  </div>
                </div>
              );
            default:
              return "このメッセージは表示されないはずだよ";
          }
        }}
      </Modal>
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
                    ref={deviceIdInput}
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
                      onClick={onDeviceIdSubmit}
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
              return "このメッセージは表示されないはずだよ";
          }
        }}
      </Modal>
    </>
  );
}
