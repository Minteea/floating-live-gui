import { Button, Input, Select, Switch, Tooltip } from 'antd';
import {
  // 图标导入
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import store from '../../store';
import controller from '../../controller';
import { useSnapshot } from 'valtio';

/** 搜索及添加直播间的组件 */
const SavingSettings: React.FC = function () {
  useSnapshot(store.save)
  useSnapshot(store.room)
  const [inputSavePath, changeInputSavePath] = useState(store.save.path);
  return (
    <div>
      <div>
        记录弹幕到本地
        <Switch
          checked={store.save.saveMessage}
          onClick={() => {
            controller.cmd("saveMessage", !store.save.saveMessage);
          }}
        />
      </div>
      <div>
        记录服务器弹幕源数据
        <Switch
          checked={store.save.saveRaw}
          onClick={() => {
            controller.cmd("saveRaw", !store.save.saveRaw);
          }}
        />
      </div>
      <div>
        保存路径
        <div
          style={{
            display: 'flex',
          }}
        >
          <Input
            value={inputSavePath}
            onChange={(e) => {
              changeInputSavePath(e.target.value);
            }}
            onBlur={(e) => {
              if (
                !store.room.active &&
                !(store.save.path == inputSavePath)
              ) {
                controller.cmd("savePath", e.target.value);
              }
            }}
            status={
              store.save.path == inputSavePath || !store.room.active
                ? ''
                : 'warning'
            }
          />
          <div style={{ flexShrink: 0 }}>
            <div style={{ display: store.room.active ? '' : 'none' }}>
              <Tooltip title="应用更改">
                <Button
                  type="primary"
                  shape="circle"
                  disabled={store.save.path == inputSavePath}
                  icon={<CheckOutlined />}
                  onClick={() => {
                    controller.cmd("savePath", inputSavePath);
                  }}
                />
              </Tooltip>
              <Tooltip title="取消更改">
                <Button
                  type="ghost"
                  shape="circle"
                  disabled={store.save.path == inputSavePath}
                  icon={<CloseOutlined />}
                  onClick={() => {
                    changeInputSavePath(store.save.path);
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
