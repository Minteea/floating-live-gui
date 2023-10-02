import { Button, Checkbox, Input, Modal, Select, Tabs, Tooltip } from "antd";
import controller from "../../controller";
import { AuthOptions } from "floating-live/src/types";
import { ReactNode, useState } from "react";
import Markdown from "react-markdown";
import { useAtom, useAtomValue } from "jotai";
import { store } from "../../store";
import QRCode from "react-qr-code";
import { useInterval } from "ahooks";

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

const authTips: Record<string, ReactNode> = {
  cookie:
    "请在登录后的平台页面通过开发者工具获取cookie，并粘贴到上方的输入框。",
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
  options?: AuthOptions;
}> = function ({ platform, options }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [authCode, setAuthCode] = useState("");
  const [authSave, setAuthSave] = useAtom(store.auth.save);
  const [qrData, setQrData] = useState("");
  const [qrKey, setQrKey] = useState("");
  const [qrStatus, setQrStatus] = useState(-2);
  const userId = useAtomValue(store.auth.status)[platform];
  useInterval(
    () => {
      QrCheck(qrKey);
    },
    qrKey ? 1000 : undefined
  );
  const submit = () => {
    controller.cmd("auth", platform, authCode);
    if (authSave) controller.cmd("auth.save", platform, authCode);
    closeModal();
  };
  const QrGenerate = async () => {
    const result = await controller.cmd(`auth.${platform}.qrcode.get`);
    if (result) {
      setQrStatus(1);
      setQrData(result.url);
      setQrKey(result.key);
    }
  };
  const QrCheck = async (key: string) => {
    const result = await controller.cmd(`auth.${platform}.qrcode.check`, key);
    if (result) {
      const [code, auth] = result;
      setQrStatus(code);
      if (code == 0) {
        if (authSave) controller.cmd("auth.save", platform, auth);
        closeModal();
      } else if (code < 0) {
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
    <div style={{ display: options ? "" : "none" }}>
      <Button onClick={() => setModalOpen(true)}>设置登录凭证</Button>
      <span>{userId ? `已登录账号: ${userId}` : "当前未登录"}</span>
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
                      setAuthSave(e.target.checked);
                    }}
                  >
                    保存登录凭证
                  </Checkbox>
                  <div>{authTips[options?.auth?.type]}</div>
                  <div>登录凭证属于重要隐私信息，请不要泄露给其他人。</div>
                </div>
              ),
            },
            {
              label: "二维码登录",
              key: "qrcode",
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
                      setAuthSave(e.target.checked);
                    }}
                  >
                    保存登录凭证
                  </Checkbox>
                </div>
              ),
            },
          ]}
        />
      </Modal>
    </div>
  );
};

export default PlatformAuth;
