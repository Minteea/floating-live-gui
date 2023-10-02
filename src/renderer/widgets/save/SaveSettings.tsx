import { Button, Input, Select, Switch, Tooltip } from "antd";
import {
  // 图标导入
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { store } from "../../store";
import controller from "../../controller";
import { useSnapshot } from "valtio";
import { useAtomValue } from "jotai";

/** 搜索及添加直播间的组件 */
const SavingSettings: React.FC = function () {
  const saveMessage = useAtomValue(store.save.message);
  const saveRaw = useAtomValue(store.save.raw);
  const savePath = useAtomValue(store.save.path);
  const [inputSavePath, changeInputSavePath] = useState(savePath);
  return (
    <div>
      <div>
        记录弹幕到本地
        <Switch
          checked={saveMessage}
          onClick={() => {
            controller.cmd("save.message", !saveMessage);
          }}
        />
      </div>
      <div>
        记录服务器弹幕源数据
        <Switch
          checked={saveRaw}
          onClick={() => {
            controller.cmd("save.raw", !saveRaw);
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
              changeInputSavePath(e.target.value);
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
                    controller.cmd("save.path", inputSavePath);
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
                    changeInputSavePath(savePath);
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
