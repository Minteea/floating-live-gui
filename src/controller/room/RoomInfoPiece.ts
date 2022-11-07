//import UserInfo from "../Message/Info/UserInfo"

export default interface RoomInfoPiece {
  /** 平台id */
  platform?: string
  /** 房间id */
  id?: number
  /** 直播标题 */
  title?: string
  /** 分区 */
  area?: string[]
  /** 封面url */
  cover?: string
  /** 主播信息 */
  anchor: {
    name?: string,
    id?: number,
    avatar?: string,
  }
  /** 是否持续保持连接 */
  keep_connection?: boolean;
  /** 直播状态 */
  status?: boolean
  /** 开始直播时间 */
  start_time?: number;
  /** 直播间是否打开监听 */
  opening?: boolean;
}