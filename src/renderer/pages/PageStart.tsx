import { Button, Checkbox, Input } from "antd";
import RoomList from "../components/room/RoomList";
import MessageBoard from "../components/message/MessageBoard";
import { $messages, $openedRooms, $rooms, controller } from "../controller";
import { useStore } from "@nanostores/react";
import {
  $boardAutoShow,
  $boardShow,
  $commandInput,
  $roomsListOpened,
} from "../store";
import commandParser from "../utils/commandParser";
import { AppCommandMap } from "floating-live";

const PageStart: React.FC = function () {
  const rooms = useStore($rooms);
  const openedRooms = useStore($openedRooms);
  const messageList = useStore($messages);
  const commandInput = useStore($commandInput);
  const boardShow = useStore($boardShow);
  const boardAutoShow = useStore($boardAutoShow);
  const roomsListOpened = useStore($roomsListOpened);
  return (
    <div>
      <div>
        <Button onClick={() => $boardShow.set(!boardShow)}>
          {boardShow ? "隐藏消息板" : "显示消息板"}
        </Button>
        <Checkbox
          checked={boardAutoShow}
          onChange={(e) => $boardAutoShow.set(e.target.checked)}
        >
          打开房间后自动开启消息板
        </Checkbox>
      </div>
      {boardShow && (
        <>
          <MessageBoard
            list={messageList}
            style={{
              width: "100%",
              height: 400,
              background: "white",
            }}
          />
          <Input
            value={commandInput}
            onChange={(e) => {
              $commandInput.set(e.target.value);
            }}
            onPressEnter={(e) => {
              try {
                let [cmd, ...args] = commandParser(commandInput);
                controller.command(
                  cmd,
                  ...(args as Parameters<AppCommandMap[any]>)
                );
              } catch (err) {
                console.error(err);
              }
              $commandInput.set("");
            }}
            placeholder="输入指令..."
          />
        </>
      )}
      {roomsListOpened && !!openedRooms.length && (
        <div>
          <div>已开启房间</div>
          <RoomList list={openedRooms} />
          <hr />
          <div>所有房间</div>
        </div>
      )}
      <RoomList list={rooms} />
    </div>
  );
};

export default PageStart;
