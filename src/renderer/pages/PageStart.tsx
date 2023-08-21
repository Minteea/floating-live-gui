import { Button, Input } from "antd";
import store from "../store";
import RoomList from "../components/room/RoomList";
import MessageBoard from "../components/message/MessageBoard";
import controller from "../controller";
import { useState } from "react";
import { useSnapshot } from "valtio";
import { storeRoom } from "../store/storeRoom";
import { IStateMessage, storeMessage } from "../store/storeMessage";
import { MessageData } from "floating-live";
import { storeCommand } from "../store/storeCommand";

const PageStart: React.FC = function () {
  const sRoom = useSnapshot(storeRoom);
  const sMessage = useSnapshot(storeMessage) as IStateMessage;
  const sCommand = useSnapshot(storeCommand);
  const list = [...sRoom.roomMap].map((item) => ({
    key: item[0],
    room: item[1],
  }));
  return (
    <div>
      <Button
        type="primary"
        danger={sRoom.active}
        onClick={
          sRoom.active
            ? () => {
                controller.cmd("end");
              }
            : () => {
                controller.cmd("openAll");
              }
        }
      >
        {sRoom.active ? "停止记录" : "开始记录"}
      </Button>
      {sRoom.active ? (
        <>
          <MessageBoard
            list={
              sMessage.currentRoom
                ? sMessage.list.filter(
                    (item) =>
                      `${item.platform}:${item.room}` == sMessage.currentRoom
                  )
                : sMessage.list
            }
            style={{
              width: "100%",
              height: 400,
              background: "white",
            }}
          />
          <Input
            value={sCommand.input}
            onChange={(e) => {
              storeCommand.input = e.target.value;
            }}
            onPressEnter={(e) => {
              controller.exec(sCommand.input);
                storeCommand.input = "";
            }}
            placeholder="输入指令..."
          />
        </>
      ) : null}
      <RoomList list={list} />
    </div>
  );
};

export default PageStart;
