import { MessageData } from 'floating-live/src/types/message/MessageData';
import User from './User';
import { Image } from 'antd'

/** 消息 */
const MessageLine: React.FC<{
  msg: MessageData;
}> = function (props) {
  const { msg } = props;
  switch (msg.type) {
    case 'chat': {
      return (
        <div>
          <Image src={msg.info.user.avatar} referrerPolicy="no-referrer" width={20} height={20} />
          <User msg={msg} />
          :&nbsp;
          {
            msg.info.image
            ?
            <img src={msg.info.image.url/**`http://${store.link.link}/static/image/emotion/${msg.platform}/${msg.info.image.id}.png` */} referrerPolicy="no-referrer" width={Number(msg.info.image.size?.[0]) / 2 || undefined} height={Number(msg.info.image.size?.[1]) / 2 || undefined} />
            :
            <span>{msg.info.content}</span>
          }
          
        </div>
      );
    }
    case 'gift': {
      return (
        <div>
          <img src={msg.info.user.avatar} referrerPolicy="no-referrer" width={20} height={20} />
          <User msg={msg} />
          &nbsp;
          <span>{msg.info.gift.action || '送出'}</span>&nbsp;
          <span>{msg.info.gift.name}</span>&nbsp;
          <span>x{msg.info.gift.num}</span>
        </div>
      );
    }
    case 'superchat': {
      return (
        <div>
          <img src={msg.info.user.avatar} referrerPolicy="no-referrer" width={20} height={20} />
          <User msg={msg} />
          &nbsp;
          <span>[SC {msg.info.duration / 1000}s]</span>:&nbsp;
          <span>{msg.info.content}</span>
        </div>
      );
    }
    case 'membership': {
      return (
        <div>
          <img src={msg.info.user.avatar} referrerPolicy="no-referrer" width={20} height={20} />
          <User msg={msg} />
          &nbsp;
          <span>开通了</span>&nbsp;
          <span>{msg.info.duration}天的</span>&nbsp;
          <span>{msg.info.name}</span>
        </div>
      );
    }
    case 'entry': {
      return (
        <div>
          <User msg={msg} /> 进入直播间
        </div>
      );
    }
    case 'like': {
      return (
        <div>
          <User msg={msg} /> 点赞了
        </div>
      );
    }
    case 'share': {
      return (
        <div>
          <User msg={msg} /> 分享了直播间
        </div>
      );
    }
    case 'follow': {
      return (
        <div>
          <User msg={msg} /> 关注了主播
        </div>
      );
    }
    case 'join': {
      return (
        <div>
          <User msg={msg} /> 加入了粉丝团
        </div>
      );
    }
    case 'block': {
      return (
        <div>
          <User msg={msg} />
          &nbsp; 已被
          <span>
            {{admin: "房管", anchor: "主播"}[Number(msg.info.operator.identity)]}
          </span>
          禁言
        </div>
      );
    }
    case 'live_start': {
      return (
        <div>
          直播间 {msg.platform}:{msg.room} 已开播
        </div>
      );
    }
    case 'live_end': {
      return (
        <div>
          直播间 {msg.platform}:{msg.room} 已结束直播
        </div>
      );
    }
    case 'live_cut': {
      return (
        <div>
          直播间 {msg.platform}:{msg.room} 被切断直播: {msg.info.message}
        </div>
      );
    }
    default:
      return null;
  }
};

export default MessageLine;
