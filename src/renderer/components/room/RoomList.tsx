import { LiveRoomData } from "floating-live";
import { Button, Flex, Tooltip } from "antd";
import { controller } from "../../controller";
import RoomCard from "./RoomCard";
import { WritableAtom } from "nanostores";
import RoomListCard, { DraggableRoomListCard } from "./RoomListCard";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";

/** 直播间列表 */
export const RoomList: React.FC<{
  list: WritableAtom<LiveRoomData>[];
  sort?: (key: string, position: number) => void;
}> = function ({ list, sort }) {
  return (
    <Flex vertical gap={4} style={{ position: "relative" }}>
      {sort ? (
        <DndContext
          modifiers={[restrictToParentElement, restrictToVerticalAxis]}
          onDragEnd={({ active, over }) => {
            console.log(active, over);
            const overIndex = list.findIndex((i) => i.get().key === over?.id);
            if (overIndex > -1) sort(active.id as string, overIndex);
          }}
        >
          <SortableContext
            items={list.map((r) => r.get().key)}
            strategy={verticalListSortingStrategy}
          >
            {list.map((room) => {
              return <DraggableRoomListCard info={room} key={room.get().key} />;
            })}
          </SortableContext>
        </DndContext>
      ) : (
        list.map((room) => {
          return <RoomListCard info={room} key={room.get().key} />;
        })
      )}
    </Flex>
  );
};
