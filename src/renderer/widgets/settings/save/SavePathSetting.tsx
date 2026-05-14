import { Button, Input, Tooltip } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useState } from "react";
import { $values, controller } from "@/controller";
import { useStore } from "@nanostores/react";
import SettingItem from "@/components/settings/SettingItem";

const SavePathSetting: React.FC = function () {
  const values = useStore($values);
  const savePath = values["save.path"] || "";
  const [inputSavePath, setInputSavePath] = useState(savePath);
  return (
    <SettingItem
      title={<span>保存路径</span>}
      control={
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <Input
            value={inputSavePath}
            onChange={(e) => {
              setInputSavePath(e.target.value);
            }}
            status={savePath == inputSavePath ? "" : "warning"}
          />
          <div style={{ flexShrink: 0 }}>
            <div>
              <Tooltip title="应用更改">
                <Button
                  type="primary"
                  shape="circle"
                  disabled={savePath == inputSavePath}
                  icon={<CheckOutlined />}
                  onClick={() => {
                    controller.setValue("save.path", inputSavePath || "");
                  }}
                />
              </Tooltip>
              <Tooltip title="取消更改">
                <Button
                  shape="circle"
                  disabled={savePath == inputSavePath}
                  icon={<CloseOutlined />}
                  onClick={() => {
                    setInputSavePath(savePath);
                  }}
                />
              </Tooltip>
            </div>
          </div>
        </div>
      }
    />
  );
};

export default SavePathSetting;
