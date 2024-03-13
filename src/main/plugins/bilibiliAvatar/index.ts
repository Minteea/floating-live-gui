import { FloatingLive, Message, UserInfo } from "floating-live";
import AvatarService from "./AvatarService";

export default class BilibiliAvatar {
  static pluginName = "bilibiliAvatar";
  constructor(main: FloatingLive) {
    // api请求队列
    const service = new AvatarService({ interval: 1000, timeout: 10000 });

    // 通过弹幕消息获取头像
    const avatarHandler = ({ message }: { message: Message.All }) => {
      let info = message.info as { user?: UserInfo };
      let user = info.user;
      // 检测弹幕来源是否为B站, 并检测消息中是否有用户数据
      if (message.platform == "bilibili" && user) {
        // 如果该条消息有头像数据(礼物类、SC类等), 则先保存在表中
        if (user.avatar) {
          service.avatarMap.set(user.id.toString(), user.avatar);
          console.log(
            `[${service.avatarMap.size}]从弹幕数据读取: ${user.avatar}`
          );
        } else {
          // 如果该条消息没有头像数据, 且为消息聊天类, 则从表中读取用户头像数据并追加到弹幕数据中
          if (!user.avatar && message.type == "comment") {
            const avatar = service.avatarMap.get(user.id.toString());
            if (avatar) {
              user.avatar = avatar;
              console.log(`获取数据: ${user.avatar}`);
            } else {
              // 如果映射表也没有头像url, 只能先api请求头像再保存在表中了, 而且也不能将获得到的头像url追加到这条弹幕数据中
              service.get(user.id.toString());
            }
          }
        }
      }
    };

    main.hook.register("message", avatarHandler);
  }
}
