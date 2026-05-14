import React from "react";
import { Button, Tooltip } from "antd";
import { LinkOutlined, ReloadOutlined } from "@ant-design/icons";
import SettingItem from "@/components/settings/SettingItem";
import { $values, controller } from "@/controller";
import { useStore } from "@nanostores/react";

interface Props {
  url: string;
}

const LinkActionButton: React.FC<Props> = ({ url }) => {
  const values = useStore($values);
  const linkConnected = values["link.connected"];
  return (
    <SettingItem
      title={<span>操作</span>}
      control={
        <Tooltip title={linkConnected ? "重新连接" : "连接"}>
          <Button
            type="primary"
            shape="circle"
            icon={linkConnected ? <ReloadOutlined /> : <LinkOutlined />}
            onClick={() => {
              controller.command("link", url);
            }}
          />
        </Tooltip>
      }
    />
  );
};

export default LinkActionButton;
