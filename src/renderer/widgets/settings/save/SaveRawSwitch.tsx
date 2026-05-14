import { Switch } from "antd";
import { $values, controller } from "@/controller";
import { useStore } from "@nanostores/react";
import SettingItem from "@/components/settings/SettingItem";

const SaveRawSwitch: React.FC = function () {
  const values = useStore($values);
  const saveRaw = values["save.raw"];
  return (
    <SettingItem
      title={<span>记录服务器弹幕源数据</span>}
      control={
        <Switch
          checked={saveRaw}
          onClick={() => {
            controller.setValue("save.raw", !saveRaw);
          }}
        />
      }
    />
  );
};

export default SaveRawSwitch;
