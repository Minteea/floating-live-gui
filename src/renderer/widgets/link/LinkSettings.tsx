import { Button, Input, Select, Switch, Tooltip } from 'antd';
import {
  // 图标导入
  LinkOutlined,
  ReloadOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import store from '../../store';
import controller from '../../controller';

/** 搜索及添加直播间的组件 */
const LinkSettings: React.FC = function () {
  const [inputLink, changeInputLink] = useState(store.link.url);
  return (
    <div>
      <div>{store.link.connected ? '已连接' : '未连接'}</div>
      <div style={{ display: 'flex' }}>
        <Tooltip title={store.link.connected ? '重新连接' : '连接'}>
          <Button
            type="primary"
            shape="circle"
            icon={
              store.link.connected ? <ReloadOutlined /> : <LinkOutlined />
            }
            onClick={() => {
                store.link.url = inputLink;
              controller.link.link(store.link.url);
            }}
          />
        </Tooltip>
        <Input
          value={inputLink}
          onChange={(e) => {
            changeInputLink(e.target.value);
          }}
          onBlur={(e) => {
            if (!store.link.connected && !(store.link.url == inputLink)) {
                store.link.url = inputLink;
            }
          }}
          placeholder="连接后端url"
          status={
            store.link.url == inputLink || !store.link.connected
              ? ''
              : 'warning'
          }
        />
        {store.link.connected && store.link.url != inputLink ? (
          <Tooltip title="取消更改">
            <Button
              type="ghost"
              shape="circle"
              disabled={store.link.url == inputLink}
              icon={<CloseOutlined />}
              onClick={() => {
                changeInputLink(store.link.url);
              }}
            />
          </Tooltip>
        ) : null}
      </div>
    </div>
  );
};

export default LinkSettings;
