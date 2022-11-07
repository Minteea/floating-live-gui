import RoomList from "../components/room/RoomList"
import { runInAction } from "mobx"
import { observer } from "mobx-react-lite";
import store from "../store"
import { Button } from "antd";
import MessageBoard from "../components/message/MessageBoard";
import controller from "../controller";

const PageStart: React.FC = function() {
  let list = Array.from(store.living.roomMap).map((item) => ({key: item[0], room: item[1]}))
  return (
    <div>
      <Button
        type="primary" danger={store.living.started}
        onClick={ store.living.started ?
          () => { controller.living.end() } :
          () => { controller.living.openAll() }
        }
      >{ store.living.started ? "停止记录" : "开始记录"}</Button>
      { store.living.started ?
        <MessageBoard list={store.message.messageList}
          style={{
            width: "100%",
            height: 400,
            background: "white"
          }}
        /> : null
      }
      <RoomList list={list}/>
    </div>
  )
}

export default observer(PageStart)