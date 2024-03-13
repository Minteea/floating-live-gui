import { InputNumber, Switch } from "antd";
import {} from "@ant-design/icons";
import { useState } from "react";
import { $values, controller } from "../../controller";

import { useStore } from "@nanostores/react";

/** 搜索及添加直播间的组件 */
const ServerSettings: React.FC = function () {
  const values = useStore($values);
  const opened = values["server.open"];
  const port = values["server.port"];
  return (
    <div>
      <div>
        启用websocket服务
        <Switch
          checked={opened}
          onClick={() => {
            controller.call(opened ? "server.close" : "server.open");
          }}
        />
      </div>
      <div>
        端口号
        <InputNumber
          addonBefore="localhost:"
          defaultValue={port}
          min={1}
          max={65535}
          precision={0}
          style={{ width: 160 }}
          disabled={opened}
          onBlur={(e) => {
            controller.value.set("server.port", Number(e.target.value));
          }}
        />
      </div>
    </div>
  );
};

export default ServerSettings;
