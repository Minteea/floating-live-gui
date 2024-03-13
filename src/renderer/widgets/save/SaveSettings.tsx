import { Button, Input, Select, Switch, Tooltip } from "antd";
import {
  // 图标导入
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { $values, controller } from "../../controller";
import { useStore } from "@nanostores/react";

/** 搜索及添加直播间的组件 */
const SavingSettings: React.FC = function () {
  const values = useStore($values);
  const saveMessage = values["save.message"];
  const saveRaw = values["save.raw"];
  const savePath = values["save.path"] || "";
  const [inputSavePath, setInputSavePath] = useState(savePath);
  return (
    <div>
      <div>
        记录弹幕到本地
        <Switch
          checked={saveMessage}
          onClick={() => {
            controller.value.set("save.message", !saveMessage);
          }}
        />
      </div>
      <div>
        记录服务器弹幕源数据
        <Switch
          checked={saveRaw}
          onClick={() => {
            controller.value.set("save.raw", !saveRaw);
          }}
        />
      </div>
      <div>
        保存路径
        <div
          style={{
            display: "flex",
          }}
        >
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
                    controller.value.set("save.path", inputSavePath || "");
                  }}
                />
              </Tooltip>
              <Tooltip title="取消更改">
                <Button
                  type="ghost"
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
      </div>
    </div>
  );
};

export default SavingSettings;
