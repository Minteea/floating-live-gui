import React, { useState } from "react";
import { Input, Tooltip, Button } from "antd";
import { CloseOutlined, LinkOutlined, ReloadOutlined } from "@ant-design/icons";
import { useStore } from "@nanostores/react";
import { $values, controller } from "@/controller";
import SettingItem from "@/components/settings/SettingItem";

const LinkUrl: React.FC = () => {
  const values = useStore($values);
  const linkConnected = values["link.connected"];
  const linkUrl = values["link.url"] || "";
  const [linkUrlInput, setLinkUrlInput] = useState(linkUrl);
  return (
    <SettingItem
      title={<span>连接地址</span>}
      control={
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <Tooltip title={linkConnected ? "重新连接" : "连接"}>
            <Button
              type="primary"
              shape="circle"
              icon={linkConnected ? <ReloadOutlined /> : <LinkOutlined />}
              onClick={() => {
                controller.command("link", linkUrlInput);
              }}
            />
          </Tooltip>
          <Input
            value={linkUrlInput}
            onChange={(e) => setLinkUrlInput(e.target.value)}
            onBlur={(e) => {
              /* parent will handle saving if needed */
            }}
            placeholder="连接后端url"
            style={{ minWidth: 200 }}
          />
          {linkConnected && linkUrl != linkUrlInput ? (
            <Tooltip title="取消更改">
              <Button
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
      }
    />
  );
};

export default LinkUrl;
