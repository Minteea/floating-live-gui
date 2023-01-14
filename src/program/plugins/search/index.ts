import Program from "../..";
import { LiveRoom } from "floating-live"

export default (ctx: Program) => {
  let room: LiveRoom | null
  ctx.command.register("searchRoom", (r: string | {platform: string, id: string | number}) => {
    // 获取平台及id
    let platform: string
    let id: string | number
    if (typeof r == "string") {
      let split = r.split(":")
      platform = split[0].toLowerCase()
      id = split[1]
    } else {
      platform = r.platform.toLowerCase()
      id = r.id
    }
    room?.destory?.()
    room = ctx.room.generate({platform, id}) || null
    if (room) {
      ctx.emit("search", room.key, room.info)
      room.on("info", () => {
        ctx.emit("search_update", room.key, room.info)
      })
    }
  })
  ctx.command.register("searchUpdate", () => {
    if (room) {
      room.getInfo()
    }
  })
}