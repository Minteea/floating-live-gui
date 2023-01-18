import { MessageData, UserInfo } from 'floating-live';
import Program from "../..";
import axios from "axios"
import RequestQueue from './requestQueue';

export default (ctx: Program) => {
  // 头像Map
  const avatarMap: Map<number, string> = new Map()
  // api请求队列
  const queue = new RequestQueue({interval: 1000, timeout: 10000})
  ctx.helper.messageHandler.register("bilibili.getavatar", (msg: MessageData) => {
    let info = msg.info as { user?: UserInfo }
    let user = info.user
    // 检测弹幕来源是否为B站, 并检测消息中是否有用户数据
    if (msg.platform == "bilibili" && user) {
      // 如果该条消息有头像数据(礼物类、SC类等), 则先保存在映射表
      if (user.avatar && !avatarMap.has(user.id)) {
        avatarMap.set(user.id, user.avatar)
        console.log(`[${avatarMap.size}]从弹幕数据读取: ${user.avatar}`)
      } else {
        // 如果该条消息没有头像数据, 且为消息聊天类, 则从映射表中读取用户头像数据并追加到弹幕数据中
        if (!user.avatar && (msg.type == "chat")) {
          if (avatarMap.has(user.id)) {
            user.avatar = avatarMap.get(user.id)
            console.log(`获取数据: ${user.avatar}`)
          } else {
            // 如果映射表也没有头像url, 只能先api请求头像再保存在映射表中了, 而且也不能将获得到的头像url追加到这条弹幕数据中(除非使用async/await)
            queue.add(() => {
              console.log(`已执行`)
              axios.get(`https://api.bilibili.com/x/space/acc/info?mid=${user.id}`)
                .then((res) => {
                  if (res.data.code == 0) {
                    avatarMap.set(user!.id, res.data.data.face)
                    console.log(`[${avatarMap.size}]从API获取: ${res.data.data.face}`)
                  }
                })
                .catch((rej) => {
                  console.log(rej)
                })
            }, user.id)
          }
        }
      }
    }
  })
  return {}
}