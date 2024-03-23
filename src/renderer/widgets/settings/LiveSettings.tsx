import { InputNumber, Switch } from "antd";
import {} from "@ant-design/icons";
import { useState } from "react";
import { $values, controller } from "../../controller";

import { useStore } from "@nanostores/react";
import { $roomsListOpened } from "../../store";

/** 搜索及添加直播间的组件 */
const LiveSettings: React.FC = function () {
  const values = useStore($values);
  const roomsListOpened = useStore($roomsListOpened);
  const opened = values["roomLoader.open"];
  return (
    <div>
      <div>
        程序启动后监听上次未关闭的房间
        <Switch
          checked={opened}
          onClick={() => {
            controller.value.set("roomLoader.open", !opened);
          }}
        />
      </div>
      <div>
        单独列出已打开的房间
        <Switch
          checked={roomsListOpened}
          onClick={() => {
            $roomsListOpened.set(!roomsListOpened);
          }}
        />
      </div>
    </div>
  );
};

export default LiveSettings;
