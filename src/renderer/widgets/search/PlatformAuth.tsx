import { Button, Checkbox, Input, Modal, Select, Tabs, Tooltip } from "antd";
import { $commands, $values, controller } from "../../controller";
import { ReactNode, useState } from "react";
import Markdown from "react-markdown";

import QRCode from "react-qr-code";
import { useInterval } from "ahooks";
import { useStore } from "@nanostores/react";
import { $authSave } from "../../../renderer/store";

declare module "floating-live" {
  interface FloatingCommandMap {
    [name: `${string}.login.qrcode.get`]: () => { key: string; url: string };
    [name: `${string}.login.qrcode.poll`]: (key: string) => {
      status: number;
      credentials: string;
    };
  }
}

const authWarn: Record<string, ReactNode> = {
  bilibili: (
    <>
      由于b站弹幕接口限制，在未登录账号的情况下，返回的弹幕用户名会变为星号且无法获取到uid。详见
      <a
        href="https://github.com/simon300000/bilibili-live-ws/issues/397"
        target="_blank"
      >
        github:simon300000/bilibili-live-ws#397
      </a>
    </>
  ),
};

function qrStatusInfo(c: number) {
  switch (c) {
    case -1:
      return "二维码已失效";
    case 0:
      return "登录成功";
    case 1:
      return "等待用户扫码";
    case 2:
      return "等待用户确认";
  }
}

/** 平台登录设置 */
const PlatformAuth: React.FC<{
  platform: string;
}> = function ({ platform }) {
  const loginCredentials = $commands
    .get()
    .includes(`${platform}.credentials.check`);
  const loginQrcode = $commands.get().includes(`${platform}.login.qrcode.get`);
  const values = useStore($values);
  const authSave = useStore($authSave);
  const [modalOpen, setModalOpen] = useState(false);
  const [authCode, setAuthCode] = useState("");
  const [qrData, setQrData] = useState("");
  const [qrKey, setQrKey] = useState("");
  const [qrStatus, setQrStatus] = useState(-2);
  const userId = values[`auth.userId.${platform}`];
  useInterval(
    () => {
      QrCheck(qrKey);
    },
    qrKey ? 1000 : undefined
  );
  const submit = () => {
    controller.call("auth", platform, authCode);
    controller.call("auth.save", platform, authSave ? authCode : "");
    closeModal();
  };
  const QrGenerate = async () => {
    const result = await controller.call(`${platform}.login.qrcode.get`);
    if (result) {
      setQrStatus(1);
      setQrData(result.url);
      setQrKey(result.key);
    }
  };
  const QrCheck = async (key: string) => {
    const result = await controller.call(`${platform}.login.qrcode.poll`, key);
    if (result) {
      const { status, credentials } = result;
      setQrStatus(status);
      if (status == 0) {
        controller.call("auth", platform, credentials);
        controller.call("auth.save", platform, authSave ? credentials : "");
        closeModal();
      } else if (status < 0) {
        setQrKey("");
      }
    } else {
      setQrKey("");
    }
  };
  const closeModal = () => {
    setModalOpen(false);
    setAuthCode("");
    setQrKey("");
    setQrData("");
    setQrStatus(-2);
  };
  return (
    <div style={{ display: loginCredentials || loginQrcode ? "" : "none" }}>
      <Button onClick={() => setModalOpen(true)}>设置登录凭证</Button>
      <span style={{ padding: "0 4px" }}>
        {userId ? (
          <>
            <span>已登录账号: {userId}</span>
            <a
              onClick={() => {
                controller.call("auth", platform, "");
                controller.call("auth.save", platform, "");
              }}
              style={{ padding: "0 4px" }}
            >
              [退出登录]
            </a>
          </>
        ) : (
          <span>当前未登录</span>
        )}
      </span>
      <div>{authWarn[platform]}</div>
      <Modal
        title={`设置${platform}的登录凭证`}
        open={modalOpen}
        onOk={() => submit()}
        onCancel={() => closeModal()}
      >
        <Tabs
          defaultActiveKey={"auth"}
          items={[
            {
              label: "粘贴凭证",
              key: "auth",
              disabled: !loginCredentials,
              children: (
                <div>
                  <Input.TextArea
                    style={{ resize: "none" }}
                    onChange={(e) => {
                      setAuthCode(e.target.value);
                    }}
                    value={authCode}
                    placeholder="请将凭证粘贴在此处"
                  />
                  <Checkbox
                    checked={authSave}
                    onChange={(e) => {
                      $authSave.set(e.target.checked);
                    }}
                  >
                    保存登录凭证
                  </Checkbox>
                  <div>
                    请在登录后的平台页面通过开发者工具获取cookie，并粘贴到上方的输入框。
                  </div>
                  <div>登录凭证属于重要隐私信息，请不要泄露给其他人。</div>
                </div>
              ),
            },
            {
              label: "二维码登录",
              key: "qrcode",
              disabled: !loginQrcode,
              children: (
                <div>
                  <div
                    style={{
                      width: 240,
                      height: 240,
                      margin: "auto",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      QrGenerate();
                    }}
                  >
                    {qrData ? (
                      <QRCode
                        value={qrData}
                        style={{ width: "100%", height: "100%" }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          background: "#a0a0a040",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        点击生成二维码
                      </div>
                    )}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {qrStatusInfo(qrStatus)}
                  </div>
                  <Checkbox
                    checked={authSave}
                    onChange={(e) => {
                      $authSave.set(e.target.checked);
                    }}
                  >
                    保存登录凭证
                  </Checkbox>
                </div>
              ),
            },
          ].filter((i) => !i.disabled)}
        />
      </Modal>
    </div>
  );
};

export default PlatformAuth;
