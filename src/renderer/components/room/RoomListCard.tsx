import { Tooltip, Button } from "antd";
import { LiveRoomData } from "floating-live";
import { WritableAtom } from "nanostores";
import { controller } from "../../../renderer/controller";
import RoomCard from "./RoomCard";
import { useStore } from "@nanostores/react";
import {
  // 图标导入
  CaretRightOutlined,
  DeleteOutlined,
  CheckOutlined,
  SyncOutlined,
} from "@ant-design/icons";

/** 直播间列表 */
const RoomListCard: React.FC<{
  info: WritableAtom<LiveRoomData>;
}> = function ({ info }) {
  const r = useStore(info);
  return (
    <RoomCard
      roomInfo={r}
      button={{
        top: [
          <Tooltip
            title={
              r.opened ? "关闭房间" : r.available ? "打开房间" : "房间不可用"
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
                      controller.command("close", r.key);
                    }
                  : () => {
                      controller.command("open", r.key);
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
                controller.command("update", r.key);
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
                controller.command("remove", r.key);
              }}
            />
          </Tooltip>,
        ],
      }}
    />
  );
};

export default RoomListCard;
