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
  PlusOutlined,
  HolderOutlined,
} from "@ant-design/icons";
import { ReactNode } from "react";
import { useSortable } from "@dnd-kit/sortable";

/** 直播间列表 */
export const RoomListCard: React.FC<{
  info: WritableAtom<LiveRoomData>;
  topAddition?: ReactNode[];
  bottomAddition?: ReactNode[];
}> = function ({ info, topAddition, bottomAddition }) {
  const r = useStore(info);
  return (
    <RoomCard
      roomInfo={r}
      button={{
        top: [
          ...(topAddition || []),
          <Tooltip
            title={
              r.opened ? "关闭房间" : r.available ? "打开房间" : "房间不可用"
            }
            arrow={{ pointAtCenter: true }}
          >
            <Button
              type={r.opened ? "primary" : "default"}
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
          ...(bottomAddition || []),
          <Tooltip
            title="刷新信息"
            arrow={{ pointAtCenter: true }}
            placement="bottom"
          >
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
          <Tooltip
            title="删除房间"
            arrow={{ pointAtCenter: true }}
            placement="bottom"
          >
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

export const DraggableRoomListCard: React.FC<{
  info: WritableAtom<LiveRoomData>;
}> = ({ info }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: info.get().key,
    transition: {
      duration: 150,
      easing: "ease",
    },
  });
  return (
    <div
      ref={setNodeRef}
      style={{
        transform: `translate3d(${transform?.x || 0}px, ${
          transform?.y || 0
        }px, 0)`,
        transition,
        zIndex: isDragging ? 100 : 0,
        cursor: isDragging ? "pointer" : "",
      }}
    >
      <RoomListCard
        info={info}
        bottomAddition={[
          <Button
            type="text"
            shape="circle"
            size="small"
            icon={<HolderOutlined />}
            {...listeners}
            {...attributes}
          />,
        ]}
      />
    </div>
  );
};

export default RoomListCard;
