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
  const [inputSavePath, changeInputSavePath] = useState(store.saving.save_path);
  return (
    <div>
      <div>
        记录弹幕到本地
        <Switch
          checked={store.saving.save_message}
          onClick={() => {
            controller.cmd("saveMessage", !store.saving.save_message);
          }}
        />
      </div>
      <div>
        记录服务器弹幕源数据
        <Switch
          checked={store.saving.save_origin}
          onClick={() => {
            controller.cmd("saveOrigin", !store.saving.save_message);
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
                !store.living.started &&
                !(store.saving.save_path == inputSavePath)
              ) {
                controller.cmd("savePath", e.target.value);
              }
            }}
            status={
              store.saving.save_path == inputSavePath || !store.living.started
                ? ''
                : 'warning'
            }
          />
          <div style={{ flexShrink: 0 }}>
            <div style={{ display: store.living.started ? '' : 'none' }}>
              <Tooltip title="应用更改">
                <Button
                  type="primary"
                  shape="circle"
                  disabled={store.saving.save_path == inputSavePath}
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
                  disabled={store.saving.save_path == inputSavePath}
                  icon={<CloseOutlined />}
                  onClick={() => {
                    changeInputSavePath(store.saving.save_path);
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
