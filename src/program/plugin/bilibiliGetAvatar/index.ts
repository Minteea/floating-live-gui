import { MessageType } from 'floating-living/src/Message/MessageInterface';
import MessageInfo from 'floating-living/src/Message/MessageInfo';
import Program from "program";
import axios from "axios"
import RequestQueue from './requestQueue';

export default class bilibiliGetAvatar {
  program: Program
  avatarMap: Map<number, string> = new Map()
  queue = new RequestQueue({interval: 1000, timeout: 10000})
  constructor (program: Program) {
    this.program = program
    program.living.processPipe.push(this.processFunction)
    console.log("[bilibiliGetAvatar] 已添加插件")
  }
  processFunction = (msg: MessageType) => {
    let info = msg.info as MessageInfo
    // 检测弹幕来源是否为B站, 并检测消息中是否有用户数据
    if (msg.platform == "bilibili" && info.user) {
      // 如果该条消息有头像数据(礼物类、SC类等), 则先保存在映射表
      if (info.user.avatar && !this.avatarMap.has(info.user.id)) {
        this.avatarMap.set(info.user.id, info.user.avatar)
        console.log(`[${this.avatarMap.size}]从弹幕数据读取: ${info.user.avatar}`)
      } else {
        // 如果该条消息没有头像数据, 且为消息聊天类, 则从映射表中读取用户头像数据并追加到弹幕数据中
        if (!info.user.avatar && (msg.type == "text" || msg.type == "image")) {
          if (this.avatarMap.has(info.user.id)) {
            info.user.avatar = this.avatarMap.get(info.user.id)
            console.log(`获取数据: ${info.user.avatar}`)
          } else {
            // 如果映射表也没有头像url, 只能先api请求头像再保存在映射表中了, 而且也不能将获得到的头像url追加到这条弹幕数据中(除非使用async/await)
            this.queue.add(() => {
              console.log(`已执行`)
              axios.get(`https://api.bilibili.com/x/space/acc/info?mid=${info.user!.id}`, {
                headers: {
                  "User-Agent": ""
                }
              })
                .then((res) => {
                  if (res.data.code == 0) {
                    this.avatarMap.set(info.user!.id, res.data.data.face)
                    console.log(`[${this.avatarMap.size}]从API获取: ${res.data.data.face}`)
                  }
                })
                .catch((rej) => {
                  console.log(rej)
                })
            }, info.user!.id)
          }
        }
      }
    }
  }
  destory() {
    let processPipe = this.program.living.processPipe
    processPipe.splice(processPipe.indexOf(this.processFunction), 1)
  }
}