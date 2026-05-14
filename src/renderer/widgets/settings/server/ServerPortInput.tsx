import { InputNumber } from "antd";
import { $values, controller } from "@/controller";
import { useStore } from "@nanostores/react";
import SettingItem from "@/components/settings/SettingItem";

const ServerPortInput: React.FC = function () {
  const values = useStore($values);
  const opened = values["server.open"];
  const port = values["server.port"];
  return (
    <SettingItem
      title={<span>端口号</span>}
      control={
        <InputNumber
          addonBefore="localhost:"
          defaultValue={port}
          min={1}
          max={65535}
          precision={0}
          style={{ width: 160 }}
          disabled={opened}
          onBlur={(e) => {
            controller.setValue("server.port", Number(e.target.value));
          }}
        />
      }
    />
  );
};

export default ServerPortInput;
