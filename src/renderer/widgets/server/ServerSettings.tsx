import { InputNumber, Switch } from 'antd';
import {} from '@ant-design/icons';
import { useState } from 'react';
import store from '../../store';
import controller from '../../controller';
import { useSnapshot } from 'valtio';

/** 搜索及添加直播间的组件 */
const ServerSettings: React.FC = function () {
  useSnapshot(store.server)
  return (
    <div>
      <div>
        启用websocket服务
        <Switch
          checked={store.server.opened}
          onClick={() => {
            controller.cmd("server", !store.server.opened);
          }}
        />
      </div>
      <div>
        端口号
        <InputNumber
          addonBefore="localhost:"
          defaultValue={store.server.port}
          min={1}
          max={65535}
          precision={0}
          style={{ width: 160 }}
          disabled={store.server.opened}
          onBlur={(e) => {
            controller.cmd("port", Number(e.target.value));
          }}
        />
      </div>
    </div>
  );
};

export default ServerSettings;
