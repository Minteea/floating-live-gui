import RoomCard from "./RoomCard"
import RoomInfo from "floating-living/src/LiveRoom/RoomInfo";
import { Button, Tooltip } from "antd";
import {  // 图标导入
  CaretRightOutlined,
  DeleteOutlined,
  CheckOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import controller from "../../controller";
import { observer } from "mobx-react-lite";

/** 直播间列表 */
const RoomList: React.FC<{
  list: Array<{key: string, room: RoomInfo}>
}> = function(props) {
  return (
    <div>
      {
        props.list.map((r) => (
          <RoomCard roomInfo={r.room} key={r.key}
            button={{
              top: [
                <Tooltip title={r.room.opening ? "关闭房间" : "打开房间"} arrowPointAtCenter>
                  <Button 
                    type={ r.room.opening ? "primary" : "ghost"}
                    shape="circle" size="small" style={{marginLeft: 5}}
                    icon={ r.room.opening ? <CheckOutlined /> : <CaretRightOutlined />}
                    onClick={ r.room.opening ? 
                      ()=>{ controller.living.closeRoom(r.key) }
                      :
                      ()=>{ controller.living.openRoom(r.key) }
                    }
                  />
                </Tooltip>,
              ],
              bottom: [
                <Tooltip title="刷新信息" arrowPointAtCenter placement="bottom">
                  <Button 
                    type="text" shape="circle" size="small" disabled icon={<SyncOutlined />} style={{marginLeft: 5}}
                  />
                </Tooltip>,
                <Tooltip title="删除房间" arrowPointAtCenter placement="bottom">
                  <Button 
                    type="text" shape="circle" size="small" icon={<DeleteOutlined />} style={{marginLeft: 5}}
                    onClick={()=>{
                      controller.living.removeRoom(r.key)
                    }}
                  />
                </Tooltip>
              ]
            }}
          />
        ))
      }
    </div>
  )
}

export default observer(RoomList)