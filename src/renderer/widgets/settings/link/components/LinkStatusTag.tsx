import React from "react";
import { $values } from "@/controller";
import { useStore } from "@nanostores/react";
import SettingItem from "@/components/settings/SettingItem";
import { Tag } from "antd";

const LinkStatus: React.FC = function () {
  const values = useStore($values);
  const linkConnected = values["link.connected"];
  return (
    <Tag color={linkConnected ? "success" : "error"}>{linkConnected ? "已连接" : "未连接"}</Tag>
  );
};

export default LinkStatus;
