import { Button, Checkbox, Divider, Input, Typography } from "antd";
import { RoomList } from "../components/room/RoomList";
import MessageBoard from "../components/message/MessageBoard";
import {
  $messages,
  $openedRooms,
  $rooms,
  controller,
  roomsMoveItem,
} from "../controller";
import { useStore } from "@nanostores/react";
import {
  $boardAutoShow,
  $boardShow,
  $commandInput,
  $roomsListOpened,
} from "../store";
import commandParser from "../utils/commandParser";
import { AppCommandMap } from "floating-live";
import AppHeader from "../layout/AppHeader";
import AppContent from "../layout/AppContent";

const PageStart: React.FC = function () {
  const rooms = useStore($rooms);
  const openedRooms = useStore($openedRooms);
  const messageList = useStore($messages);
  const commandInput = useStore($commandInput);
  const boardShow = useStore($boardShow);
  const boardAutoShow = useStore($boardAutoShow);
  const roomsListOpened = useStore($roomsListOpened);
  return (
    <div style={{ display: "flex", height: "100vh", flexDirection: "column" }}>
      <AppHeader style={{ marginBottom: 16, flexShrink: 0 }}>
        <Button onClick={() => $boardShow.set(!boardShow)}>
          {boardShow ? "隐藏消息板" : "显示消息板"}
        </Button>
        <Checkbox
          checked={boardAutoShow}
          onChange={(e) => $boardAutoShow.set(e.target.checked)}
        >
          打开房间后自动开启消息板
        </Checkbox>
      </AppHeader>
      <main
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          position: "relative",
          flexGrow: 1,
        }}
      >
        {boardShow && (
          <div
            style={{
              position: "relative",
              margin: "0 16px",
              display: "flex",
              flexDirection: "column",
              height: "50vh",
            }}
          >
            <MessageBoard
              list={messageList}
              style={{
                width: "100%",
                flexGrow: 1,
                background: "white",
              }}
            />
            <Input
              style={{ marginTop: "6px", flexShrink: 0 }}
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
          </div>
        )}
        <div
          style={{
            padding: "0 16px 16px",
            scrollbarWidth: "none",
            overflow: "auto",
            height: 0,
            flexGrow: 1,
          }}
        >
          {roomsListOpened && !!openedRooms.length && (
            <>
              <Typography.Title level={5} style={{ marginTop: 0 }}>
                已开启房间
              </Typography.Title>
              <RoomList list={openedRooms} />
              <Divider style={{ margin: "12px 0" }} />
              <Typography.Title level={5} style={{ marginTop: 0 }}>
                所有房间
              </Typography.Title>
            </>
          )}
          <RoomList
            list={rooms}
            sort={(key, position) => roomsMoveItem(key, position)}
          />
        </div>
      </main>
    </div>
  );
};

export default PageStart;
