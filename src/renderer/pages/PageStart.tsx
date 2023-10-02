import { Button, Input } from "antd";
import RoomList from "../components/room/RoomList";
import MessageBoard from "../components/message/MessageBoard";
import controller from "../controller";
import { store } from "../store";
import { useAtom, useAtomValue } from "jotai";

const PageStart: React.FC = function () {
  const roomList = useAtomValue(store.room.list);
  const messageList = useAtomValue(store.message.list);
  const [commandInput, setCommandInput] = useAtom(store.command.input);
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
              setCommandInput(e.target.value);
            }}
            onPressEnter={(e) => {
              controller.exec(commandInput);
              setCommandInput("");
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
