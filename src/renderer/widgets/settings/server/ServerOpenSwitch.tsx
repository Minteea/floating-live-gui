import { Switch } from "antd";
import { $values, controller } from "@/controller";
import { useStore } from "@nanostores/react";
import SettingItem from "@/components/settings/SettingItem";

const ServerOpenSwitch: React.FC = function () {
  const values = useStore($values);
  const opened = values["server.open"];
  return (
    <SettingItem
      title={<span>启用websocket服务</span>}
      control={
        <Switch
          checked={opened}
          onClick={() => controller.command(opened ? "server.close" : "server.open")}
        />
      }
    />
  );
};

export default ServerOpenSwitch;
