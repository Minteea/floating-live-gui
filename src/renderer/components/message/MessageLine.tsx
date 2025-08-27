import { LiveMessage } from "floating-live";
import User from "./User";
import { Image } from "antd";
import { ImageSize, UserType } from "floating-live";

function getChatWithEmoticon(msg: LiveMessage.Comment) {
  let prostr = msg.info.content;
  for (const keyword in msg.info.emoticon) {
    prostr = prostr.replaceAll(keyword, `\u0000${keyword}\u0000`);
  }
  let list = prostr.split("\u0000");
  let result = list.map((item) => {
    let e = msg.info.emoticon?.[item];
    if (e) {
      return (
        <Image
          src={e.url}
          referrerPolicy="no-referrer"
          width={20}
          height={20}
        />
      );
    } else {
      return item;
    }
  });
  return result;
}

function getImageSize(s: ImageSize) {
  return [100, 20, 40][s];
}

function getAdmin(a: UserType) {
  return ["", "房管", "主播"][a];
}

/** 消息 */
const MessageLine: React.FC<{
  msg: LiveMessage.All;
}> = function (props) {
  const { msg } = props;
  switch (msg.type) {
    case "comment": {
      return (
        <div>
          <Image
            src={msg.info.user.avatar}
            referrerPolicy="no-referrer"
            width={20}
            height={20}
          />
          <User msg={msg} />
          :&nbsp;
          {msg.info.image ? (
            <img
              src={msg.info.image.url}
              referrerPolicy="no-referrer"
              height={getImageSize(msg.info.image.size || 0)}
            />
          ) : msg.info.emoticon ? (
            getChatWithEmoticon(msg)
          ) : (
            <span>{msg.info.content}</span>
          )}
        </div>
      );
    }
    case "gift": {
      return (
        <div>
          <img
            src={msg.info.user.avatar}
            referrerPolicy="no-referrer"
            width={20}
            height={20}
          />
          <User msg={msg} />
          &nbsp;
          <span>{msg.info.gift.action || "送出"}</span>&nbsp;
          <span>{msg.info.gift.name}</span>&nbsp;
          <span>x{msg.info.gift.num}</span>
        </div>
      );
    }
    case "superchat": {
      return (
        <div>
          <img
            src={msg.info.user.avatar}
            referrerPolicy="no-referrer"
            width={20}
            height={20}
          />
          <User msg={msg} />
          &nbsp;
          <span>[SC {msg.info.duration / 1000}s]</span>:&nbsp;
          <span>{msg.info.content}</span>
        </div>
      );
    }
    case "membership": {
      return (
        <div>
          <img
            src={msg.info.user.avatar}
            referrerPolicy="no-referrer"
            width={20}
            height={20}
          />
          <User msg={msg} />
          &nbsp;
          <span>{msg.info.gift.action || "开通"}</span>
          &nbsp;
          <span>{msg.info.name}</span>
          &nbsp;
          <span>
            x{msg.info.gift.num}
            {getTimeUnitText(msg.info.gift.unit)}
          </span>
        </div>
      );
    }
    case "entry": {
      return (
        <div>
          <User msg={msg} /> 进入直播间
        </div>
      );
    }
    case "like": {
      return (
        <div>
          <User msg={msg} /> 点赞了
        </div>
      );
    }
    case "share": {
      return (
        <div>
          <User msg={msg} /> 分享了直播间
        </div>
      );
    }
    case "follow": {
      return (
        <div>
          <User msg={msg} /> 关注了主播
        </div>
      );
    }
    case "join": {
      return (
        <div>
          <User msg={msg} /> 加入了粉丝团
        </div>
      );
    }
    case "block": {
      return (
        <div>
          <User msg={msg} />
          &nbsp; 已被
          <span>{getAdmin(msg.info.operator?.type || 0)}</span>
          禁言
        </div>
      );
    }
    case "live_start": {
      return (
        <div>
          直播间 {msg.platform}:{msg.roomId} 已开播
        </div>
      );
    }
    case "live_end": {
      return (
        <div>
          直播间 {msg.platform}:{msg.roomId} 已结束直播
        </div>
      );
    }
    case "live_cut": {
      return (
        <div>
          直播间 {msg.platform}:{msg.roomId} 被切断直播: {msg.info.message}
        </div>
      );
    }
    default:
      return null;
  }
};

function getTimeUnitText(unit?: string) {
  switch (unit) {
    case "day":
      return "天";
    case "month":
      return "个月";
    case "year":
      return "年";
    default:
      return unit;
  }
}

export default MessageLine;
