import Program from "program";
import LiveRoom from "floating-live/src/types/room/LiveRoom"
import getRoomInfo from "floating-live/src/utils/getRoomInfo"

export default (ctx: Program) => {
  let generated: {key: string, room: LiveRoom} | null
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
    generated?.room.destory?.()
    generated = ctx.controller.room.generate({platform, id}) || null
    if (generated) {
      let {key, room} = generated
      ctx.emit("search", key, getRoomInfo(room))
      generated.room.on("info", () => {
        ctx.emit("search_update", key, getRoomInfo(room))
      })
    }
  })
  ctx.command.register("searchUpdate", () => {
    if (generated) {
      generated.room.getInfo()
    }
  })
}