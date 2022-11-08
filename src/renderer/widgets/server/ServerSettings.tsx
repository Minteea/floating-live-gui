import { InputNumber, Switch } from 'antd';
import { observer } from 'mobx-react';
import { runInAction } from 'mobx';
import {} from '@ant-design/icons';
import { useState } from 'react';
import store from '../../store';
import controller from '../../controller';

/** 搜索及添加直播间的组件 */
const ServerSettings: React.FC = function () {
  return (
    <div>
      <div>
        启用websocket服务
        <Switch
          checked={store.server.send_message}
          onClick={() => {
            controller.server.sendMessage(!store.server.send_message);
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
          disabled={store.server.send_message}
          onBlur={(e) => {
            runInAction(() => {
              controller.server.port(Number(e.target.value));
            });
          }}
        />
      </div>
    </div>
  );
};

export default observer(ServerSettings);
