import { RoomInfo } from "floating-live/src/types";
import { Button, Tooltip } from "antd";
import {
  // 图标导入
  CaretRightOutlined,
  DeleteOutlined,
  CheckOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import controller from "../../controller";
import RoomCard from "./RoomCard";

/** 直播间列表 */
const RoomList: React.FC<{
  list: RoomInfo[];
}> = function (props) {
  return (
    <div>
      {props.list.map((r) => (
        <RoomCard
          roomInfo={r}
          key={r.key}
          button={{
            top: [
              <Tooltip
                title={
                  r.opened
                    ? "关闭房间"
                    : r.available
                    ? "打开房间"
                    : "房间不可用"
                }
                arrowPointAtCenter
              >
                <Button
                  type={r.opened ? "primary" : "ghost"}
                  shape="circle"
                  size="small"
                  disabled={!r.available}
                  style={{ marginLeft: 5 }}
                  icon={r.opened ? <CheckOutlined /> : <CaretRightOutlined />}
                  onClick={
                    r.opened
                      ? () => {
                          controller.cmd("close", r.key);
                        }
                      : () => {
                          controller.cmd("open", r.key);
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
                    controller.cmd("update", r.key);
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
                    controller.cmd("remove", r.key);
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

export default RoomList;
