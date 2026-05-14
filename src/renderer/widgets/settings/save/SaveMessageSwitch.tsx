import { Switch } from "antd";
import { $values, controller } from "@/controller";
import { useStore } from "@nanostores/react";
import SettingItem from "@/components/settings/SettingItem";

const SaveMessageSwitch: React.FC = function () {
  const values = useStore($values);
  const saveMessage = values["save.message"];
  return (
    <SettingItem
      title={<span>记录弹幕到本地</span>}
      control={
        <Switch
          checked={saveMessage}
          onClick={() => {
            controller.setValue("save.message", !saveMessage);
          }}
        />
      }
    />
  );
};

export default SaveMessageSwitch;
