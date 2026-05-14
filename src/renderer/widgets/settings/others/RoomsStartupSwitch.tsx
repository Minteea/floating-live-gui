import { Switch } from "antd";
import { $values, controller } from "@/controller";
import { useStore } from "@nanostores/react";
import SettingItem from "@/components/settings/SettingItem";

const RoomsStartupSwitch: React.FC = function () {
  const values = useStore($values);
  const opened = values["roomLoader.open"];
  return (
    <SettingItem
      title={<span>程序启动后监听上次未关闭的房间</span>}
      control={
        <Switch checked={opened} onClick={() => controller.setValue("roomLoader.open", !opened)} />
      }
    />
  );
};

export default RoomsStartupSwitch;
