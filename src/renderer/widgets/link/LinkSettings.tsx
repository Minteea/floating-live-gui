import { Button, Input, Select, Switch, Tooltip } from 'antd';
import { observer } from 'mobx-react';
import { runInAction } from 'mobx';
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
  const [inputLink, changeInputLink] = useState(store.link.link);
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
              runInAction(() => {
                store.link.link = inputLink;
              });
              controller.link.link(store.link.link);
            }}
          />
        </Tooltip>
        <Input
          value={inputLink}
          onChange={(e) => {
            changeInputLink(e.target.value);
          }}
          onBlur={(e) => {
            if (!store.link.connected && !(store.link.link == inputLink)) {
              runInAction(() => {
                store.link.link = inputLink;
              });
            }
          }}
          placeholder="连接后端url"
          status={
            store.link.link == inputLink || !store.link.connected
              ? ''
              : 'warning'
          }
        />
        {store.link.connected && store.link.link != inputLink ? (
          <Tooltip title="取消更改">
            <Button
              type="ghost"
              shape="circle"
              disabled={store.link.link == inputLink}
              icon={<CloseOutlined />}
              onClick={() => {
                changeInputLink(store.link.link);
              }}
            />
          </Tooltip>
        ) : null}
      </div>
    </div>
  );
};

export default observer(LinkSettings);
