import { Button, Input, Select, Tooltip } from 'antd';
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
import { useSnapshot } from 'valtio';

const { Option } = Select;
const handleChange = (value: string) => {
  console.log(`selected ${value}`);
};

/** 搜索及添加直播间的组件 */
const RoomGenerator: React.FC = function () {
  useSnapshot(store.search)
  useSnapshot(store.room)
  const [searchPlatform, setSearchPlatform] = useState(
    store.search.platform
  );
  const [searchId, setSearchId] = useState(store.search.id);
  const searchRoomInfo = store.search.roomInfo;
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
              store.search.platform = value;
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
              store.search.id = e.target.value;
          }}
          onPressEnter={() => {
              store.search.id = searchId;
            controller.cmd("searchRoom", {
              platform: store.search.platform,
              id: store.search.id
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
                platform: store.search.platform,
                id: store.search.id
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
                setSearchPlatform('');
                setSearchId('');
                store.search.platform = '';
                store.search.id = '';
            }}
          />
        </Tooltip>
      </div>
      <div style={{ display: store.search.roomInfo ? '' : 'none' }}>
        <RoomCard
          roomInfo={store.search.roomInfo}
          button={{
            top: [
              <Tooltip title={store.room.roomMap.has(searchRoomKey) ? "房间已添加" : "添加房间到列表"}>
                <Button
                  type="ghost"
                  shape="circle"
                  size="small"
                  icon={<PlusOutlined />}
                  style={{ marginLeft: 5 }}
                  disabled={store.room.roomMap.has(searchRoomKey)}
                  onClick={() => {
                    if (searchRoomInfo?.platform && searchRoomInfo?.id) {
                      controller.cmd("addRoom", searchRoomKey);
                    }
                  }}
                />
              </Tooltip>,
              <Tooltip title={store.room.roomMap.get(searchRoomKey)?.opening ? '房间已打开' : !searchRoomInfo?.available ? "房间不可用" : store.room.roomMap.has(searchRoomKey) ? "打开房间" : '添加房间并打开'}>
                <Button
                  type="primary"
                  shape="circle"
                  size="small"
                  icon={<CaretRightOutlined />}
                  style={{ marginLeft: 5 }}
                  disabled={store.room.roomMap.get(searchRoomKey)?.opening || !searchRoomInfo?.available}
                  onClick={() => {
                    if (searchRoomInfo?.platform && searchRoomInfo?.id) {
                      store.room.roomMap.has(searchRoomKey) ?
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
                      store.search.platform &&
                      store.search.id
                    ) {
                        store.search.roomInfo = null;
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

export default RoomGenerator;
