import { RoomInfo } from 'floating-live';
import { Button, Tooltip } from 'antd';
import {
  // 图标导入
  CaretRightOutlined,
  DeleteOutlined,
  CheckOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import controller from '../../controller';
import RoomCard from './RoomCard';

/** 直播间列表 */
const RoomList: React.FC<{
  list: Array<{ key: string; room: RoomInfo }>;
}> = function (props) {
  return (
    <div>
      {props.list.map((r) => (
        <RoomCard
          roomInfo={r.room}
          key={r.key}
          button={{
            top: [
              <Tooltip
                title={r.room.opening ? '关闭房间' : r.room.available ? '打开房间' : "房间不可用"}
                arrowPointAtCenter
              >
                <Button
                  type={r.room.opening ? 'primary' : 'ghost'}
                  shape="circle"
                  size="small"
                  disabled={!r.room.available}
                  style={{ marginLeft: 5 }}
                  icon={
                    r.room.opening ? <CheckOutlined /> : <CaretRightOutlined />
                  }
                  onClick={
                    r.room.opening
                      ? () => {
                          controller.cmd("closeRoom", r.key);
                        }
                      : () => {
                          controller.cmd("openRoom", r.key);
                        }
                  }
                />
              </Tooltip>,
            ],
            bottom: [
              <Tooltip title="刷新信息" arrowPointAtCenter placement="bottom">
                <Button
                  type="text"
                  shape="circle"
                  size="small"
                  icon={<SyncOutlined />}
                  style={{ marginLeft: 5 }}
                  onClick={() => {
                    controller.cmd("updateRoom", r.key);
                  }}
                />
              </Tooltip>,
              <Tooltip title="删除房间" arrowPointAtCenter placement="bottom">
                <Button
                  type="text"
                  shape="circle"
                  size="small"
                  icon={<DeleteOutlined />}
                  style={{ marginLeft: 5 }}
                  onClick={() => {
                    controller.cmd("removeRoom", r.key);
                  }}
                />
              </Tooltip>,
            ],
          }}
        />
      ))}
    </div>
  );
};

export default observer(RoomList);
