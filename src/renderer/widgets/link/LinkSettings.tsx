import { Button, Input, Select, Switch, Tooltip } from "antd";
import {
  // 图标导入
  LinkOutlined,
  ReloadOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { store } from "../../store";
import controller from "../../controller";
import { useAtom, useAtomValue } from "jotai";

/** 搜索及添加直播间的组件 */
const LinkSettings: React.FC = function () {
  const [linkUrl, setLinkUrl] = useAtom(store.link.url);
  const linkConnected = useAtomValue(store.link.connected);
  const [linkUrlInput, setLinkUrlInput] = useState(linkUrl);
  return (
    <div>
      <div>{linkConnected ? "已连接" : "未连接"}</div>
      <div style={{ display: "flex" }}>
        <Tooltip title={linkConnected ? "重新连接" : "连接"}>
          <Button
            type="primary"
            shape="circle"
            icon={linkConnected ? <ReloadOutlined /> : <LinkOutlined />}
            onClick={() => {
              setLinkUrl(linkUrlInput);
              controller.link.link(linkUrlInput);
            }}
          />
        </Tooltip>
        <Input
          value={linkUrlInput}
          onChange={(e) => {
            setLinkUrlInput(e.target.value);
          }}
          onBlur={(e) => {
            if (!linkConnected && !(linkUrl == linkUrlInput)) {
              setLinkUrl(linkUrlInput);
            }
          }}
          placeholder="连接后端url"
          status={
            linkUrl == linkUrlInput || !store.link.connected ? "" : "warning"
          }
        />
        {linkConnected && linkUrl != linkUrlInput ? (
          <Tooltip title="取消更改">
            <Button
              type="ghost"
              shape="circle"
              disabled={linkUrl == linkUrlInput}
              icon={<CloseOutlined />}
              onClick={() => {
                setLinkUrlInput(linkUrl);
              }}
            />
          </Tooltip>
        ) : null}
      </div>
    </div>
  );
};

export default LinkSettings;
