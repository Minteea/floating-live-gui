import { LiveRoomData } from "floating-live";
import { Button, Tooltip } from "antd";
import { controller } from "../../controller";
import RoomCard from "./RoomCard";
import { WritableAtom } from "nanostores";
import RoomListCard from "./RoomListCard";

/** 直播间列表 */
const RoomList: React.FC<{
  list: WritableAtom<LiveRoomData>[];
}> = function (props) {
  return (
    <div>
      {props.list.map((room) => {
        return <RoomListCard info={room} key={room.get().key} />;
      })}
    </div>
  );
};

export default RoomList;
