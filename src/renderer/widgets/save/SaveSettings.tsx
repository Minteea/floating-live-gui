import { Button, Input, Select, Switch, Tooltip } from 'antd';
import { observer } from 'mobx-react';
import { runInAction } from 'mobx';
import {
  // 图标导入
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import store from '../../store';
import controller from '../../controller';

/** 搜索及添加直播间的组件 */
const SavingSettings: React.FC = function () {
  const [inputSavePath, changeInputSavePath] = useState(store.save.savePath);
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
          checked={store.save.saveOrigin}
          onClick={() => {
            controller.cmd("saveOrigin", !store.save.saveOrigin);
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
                !store.live.started &&
                !(store.save.savePath == inputSavePath)
              ) {
                controller.cmd("savePath", e.target.value);
              }
            }}
            status={
              store.save.savePath == inputSavePath || !store.live.started
                ? ''
                : 'warning'
            }
          />
          <div style={{ flexShrink: 0 }}>
            <div style={{ display: store.live.started ? '' : 'none' }}>
              <Tooltip title="应用更改">
                <Button
                  type="primary"
                  shape="circle"
                  disabled={store.save.savePath == inputSavePath}
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
                  disabled={store.save.savePath == inputSavePath}
                  icon={<CloseOutlined />}
                  onClick={() => {
                    changeInputSavePath(store.save.savePath);
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

export default observer(SavingSettings);
