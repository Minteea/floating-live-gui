import { Button, Input } from "antd";
import RoomList from "../components/room/RoomList";
import MessageBoard from "../components/message/MessageBoard";
import { $messages, $rooms, controller } from "../controller";
import { useStore } from "@nanostores/react";
import { $commandInput } from "../store";
import commandParser from "../../utils/commandParser";
import { ControllerCommandMap } from "../controller/types";
import { FloatingCommandMap } from "floating-live";

const PageStart: React.FC = function () {
  const roomList = useStore($rooms);
  const messageList = useStore($messages);
  const commandInput = useStore($commandInput);
  return (
    <div>
      {true ? (
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
                controller.call(
                  cmd,
                  ...(args as Parameters<
                    (ControllerCommandMap & FloatingCommandMap)[any]
                  >)
                );
              } catch (err) {
                console.error(err);
              }
              $commandInput.set("");
            }}
            placeholder="输入指令..."
          />
        </>
      ) : null}
      <RoomList list={roomList} />
    </div>
  );
};

export default PageStart;
