import { Button, Input, Select, Tooltip } from 'antd';
import { observer } from 'mobx-react';
import { runInAction } from 'mobx';
import {
  // 图标导入
  SearchOutlined,
  PlusOutlined,
  CaretRightOutlined,
  DeleteOutlined,
  CloseOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import RoomCard from '../../components/room/RoomCard';
import store from '../../store';
import controller from '../../controller';

const { Option } = Select;
const handleChange = (value: string) => {
  console.log(`selected ${value}`);
};

/** 搜索及添加直播间的组件 */
const RoomGenerator: React.FC = function () {
  const [searchPlatform, setSearchPlatform] = useState(
    store.search.search_platform
  );
  const [searchId, setSearchId] = useState(store.search.search_id);
  const searchRoomInfo = store.search.search_room_info;
  const searchRoomKey = `${searchRoomInfo?.platform}:${searchRoomInfo?.id}`;
  return (
    <div>
      <div>
        <Select
          placeholder="直播平台"
          style={{ width: 100 }}
          value={searchPlatform || null}
          onChange={(value) => {
            setSearchPlatform(value);
            runInAction(() => {
              store.search.search_platform = value;
            });
          }}
        >
          <Option value="acfun">
            AcFun
          </Option>
          <Option value="bilibili">bilibili</Option>
          <Option value="douyu" disabled>
            斗鱼
          </Option>
          <Option value="huya" disabled>
            虎牙
          </Option>
        </Select>
        <Input
          placeholder="直播间id"
          style={{ width: 150 }}
          value={searchId}
          onChange={(e) => {
            setSearchId(e.target.value);
          }}
          onBlur={(e) => {
            runInAction(() => {
              store.search.search_id = e.target.value;
            });
          }}
          onPressEnter={() => {
            runInAction(() => {
              store.search.search_id = searchId;
            });
            controller.cmd("searchRoom", {
              platform: store.search.search_platform,
              id: store.search.search_id
            });
          }}
        />
        <Tooltip title="查找房间">
          <Button
            type="primary"
            shape="circle"
            icon={<SearchOutlined />}
            onClick={() => {
              controller.cmd("searchRoom",{
                platform: store.search.search_platform,
                id: store.search.search_id
              });
            }}
          />
        </Tooltip>
        <Tooltip title="清除">
          <Button
            type="ghost"
            shape="circle"
            icon={<CloseOutlined />}
            onClick={() => {
              runInAction(() => {
                setSearchPlatform('');
                setSearchId('');
                store.search.search_platform = '';
                store.search.search_id = '';
              });
            }}
          />
        </Tooltip>
      </div>
      <div style={{ display: store.search.search_room_info ? '' : 'none' }}>
        <RoomCard
          roomInfo={store.search.search_room_info}
          button={{
            top: [
              <Tooltip title={store.live.roomMap.has(searchRoomKey) ? "房间已添加" : "添加房间到列表"}>
                <Button
                  type="ghost"
                  shape="circle"
                  size="small"
                  icon={<PlusOutlined />}
                  style={{ marginLeft: 5 }}
                  disabled={store.live.roomMap.has(searchRoomKey)}
                  onClick={() => {
                    if (searchRoomInfo?.platform && searchRoomInfo?.id) {
                      controller.cmd("addRoom", searchRoomKey);
                    }
                  }}
                />
              </Tooltip>,
              <Tooltip title={store.live.roomMap.get(searchRoomKey)?.opening ? '房间已打开' : !searchRoomInfo?.available ? "房间不可用" : store.live.roomMap.has(searchRoomKey) ? "打开房间" : '添加房间并打开'}>
                <Button
                  type="primary"
                  shape="circle"
                  size="small"
                  icon={<CaretRightOutlined />}
                  style={{ marginLeft: 5 }}
                  disabled={store.live.roomMap.get(searchRoomKey)?.opening || !searchRoomInfo?.available}
                  onClick={() => {
                    if (searchRoomInfo?.platform && searchRoomInfo?.id) {
                      store.live.roomMap.has(searchRoomKey) ? 
                      controller.cmd("openRoom", searchRoomKey) :
                      controller.cmd("addRoom", searchRoomKey, true);
                    }
                  }}
                />
              </Tooltip>,
            ],
            bottom: [
              <Tooltip title="刷新信息" placement="bottom">
                <Button
                  type="text"
                  shape="circle"
                  size="small"
                  icon={<SyncOutlined />}
                  style={{ marginLeft: 5 }}
                  onClick={() => {
                    controller.cmd("searchUpdate")
                  }}
                />
              </Tooltip>,
              <Tooltip title="清除" placement="bottom">
                <Button
                  type="text"
                  shape="circle"
                  size="small"
                  icon={<CloseOutlined />}
                  style={{ marginLeft: 5 }}
                  onClick={() => {
                    if (
                      store.search.search_platform &&
                      store.search.search_id
                    ) {
                      runInAction(() => {
                        store.search.search_room_info = null;
                      });
                    }
                  }}
                />
              </Tooltip>,
            ],
          }}
        />
      </div>
    </div>
  );
};

export default observer(RoomGenerator);
