import { Avatar, Button, Card } from "antd"
import PropTypes from 'prop-types';
import RoomInfo from "floating-living/src/LiveRoom/RoomInfo";

function getLiveStatus(status: string) {
  switch (status) {
    case "live":
      return "直播中";
    case "banned":
      return "已封禁";
    default: 
      return "未开播";
  }
}

/** 直播间卡片 */
const RoomCard: React.FC<{
  roomInfo?: RoomInfo | null
  button?: {
    top?: (Array<React.ReactElement>)
    bottom?: Array<React.ReactElement>
  }
}> = function(props) {
  let info = props.roomInfo
  return (
    <div className="ant-card ant-card-bordered" style={{ }}>
      <div style={{ display: "flex", position: "relative" }}>
        <div style={{ flexShrink: 0, padding: 10 }}>
          <Avatar size={50} src={info?.anchor.avatar || undefined}></Avatar>
        </div>
        <div style={{ flexGrow: 1, padding: "10px 0" }}>
          <div style={{ lineHeight: "25px" }}>
            <div style={{ display: "inline-block", fontSize: 16, fontWeight: 600 }}>
              {info?.anchor.name || "--"}
            </div>
            <div style={{ display: "inline-block", fontSize: 13, paddingLeft: 10 }}>
              {info?.platform || "--"}:{info?.id || "--"}
            </div>
            <div style={{ display: "inline-block", fontSize: 13, paddingLeft: 10 }}>
              {info?.area?.join(" > ") || ""}
            </div>
          </div>
          <div style={{ display: "flex", lineHeight: "22px" }}>
            <div style={{fontSize: 13, paddingRight: 10}}>
              ● {getLiveStatus(info?.status || "")}
            </div>
            <div style={{fontSize: 13}}>{info?.title || ""}</div>
          </div>
        </div>
        <div style={{ flexShrink: 0, padding: 5 }}>
          <div style={{textAlign: "right", lineHeight: "30px"}}>
            {props.button?.top}
          </div>
          <div style={{textAlign: "right", lineHeight: "30px"}}>
            {props.button?.bottom}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoomCard