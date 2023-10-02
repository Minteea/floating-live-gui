import { InputNumber, Switch } from "antd";
import {} from "@ant-design/icons";
import { useState } from "react";
import { store } from "../../store";
import controller from "../../controller";
import { useSnapshot } from "valtio";
import { useAtom, useAtomValue } from "jotai";

/** 搜索及添加直播间的组件 */
const ServerSettings: React.FC = function () {
  const opened = useAtomValue(store.server.opened);
  const port = useAtomValue(store.server.port);
  return (
    <div>
      <div>
        启用websocket服务
        <Switch
          checked={opened}
          onClick={() => {
            controller.cmd(opened ? "server.close" : "server.open");
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
            controller.cmd("server:port", Number(e.target.value));
          }}
        />
      </div>
    </div>
  );
};

export default ServerSettings;
