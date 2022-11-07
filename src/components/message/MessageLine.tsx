import {MessageType} from "floating-living/src/Message/MessageInterface"
import { getRenewType } from "../../utils/nameUtils"
import User from "./User"

/** 消息 */
const MessageLine: React.FC<{
  msg: MessageType
}> = function(props) {
  let msg = props.msg
  switch (msg.type) {
    case "text": {
      return <div>
        <User msg={msg}/>:&nbsp;
        <span>{msg.info.text}</span>
      </div>
    }
    case "image": {
      return <div>
        <User msg={msg}/>:&nbsp;
        <span>[img]{msg.info.image.name}</span>
      </div>
    }
    case "gift": {
      return <div>
        <User msg={msg} />&nbsp;
        <span>{msg.info.gift.action || "送出"}</span>&nbsp;
        <span>{msg.info.gift.name}</span>&nbsp;
        <span>x{msg.info.gift.num}</span>
      </div>
    }
    case "superchat": {
      return <div>
        <User msg={msg} />&nbsp;
        <span>[SC {msg.info.duration/1000}s]</span>:&nbsp;
        <span>{msg.info.text}</span>
      </div>
    }
    case "privilege": {
      return <div>
        <User msg={msg} />&nbsp;
        <span>{getRenewType(msg.info.renew)}了</span>&nbsp;
        <span>{msg.info.duration}天的</span>&nbsp;
        <span>{msg.info.name}</span>
      </div>
    }
    case "entry": {
      return <div>
        <User msg={msg} /> 进入直播间
      </div>
    }
    case "like": {
      return <div>
        <User msg={msg} /> 点赞了
      </div>
    }
    case "share": {
      return <div>
        <User msg={msg} /> 分享了直播间
      </div>
    }
    case "follow": {
      return <div>
        <User msg={msg} /> 关注了主播
      </div>
    }
    case "join": {
      return <div>
        <User msg={msg} /> 加入了粉丝团
      </div>
    }
    case "block": {
      return <div>
        <User msg={msg} />&nbsp;
        已被
        <span>{["管理员", "主播", "房管"][Number(msg.info.operator.admin)]}</span>
        禁言
      </div>
    }
    case "live_start": {
      return <div>
        直播间 {msg.platform}:{msg.room} 已开播
      </div>
    }
    case "live_end": {
      return <div>
        直播间 {msg.platform}:{msg.room} 已结束直播
      </div>
    }
    case "live_cut": {
      return <div>
        直播间 {msg.platform}:{msg.room} 被切断直播: {msg.info.message}
      </div>
    }
    default:
      return null
  }
}

export default MessageLine