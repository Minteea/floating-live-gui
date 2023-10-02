import { UserType, RoomStatus } from "floating-live/src/enum";

export function getAdminType(n?: UserType) {
  switch (n) {
    case UserType.anchor:
      return "主播";
    case UserType.admin:
      return "房管";
  }
}

export function getLiveStatus(n?: RoomStatus) {
  switch (n) {
    case RoomStatus.live:
      return "直播中";
    case RoomStatus.banned:
      return "已封禁";
    case RoomStatus.round:
      return "轮播中";
    default:
      return "未开播";
  }
}
