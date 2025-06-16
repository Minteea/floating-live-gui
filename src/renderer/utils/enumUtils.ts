import { UserType, LiveRoomStatus } from "floating-live";

export function getAdminType(n?: UserType) {
  switch (n) {
    case UserType.anchor:
      return "主播";
    case UserType.admin:
      return "房管";
  }
}

export function getLiveStatus(n?: LiveRoomStatus) {
  switch (n) {
    case LiveRoomStatus.live:
      return "直播中";
    case LiveRoomStatus.round:
      return "轮播中";
    case LiveRoomStatus.banned:
      return "已封禁";
    case LiveRoomStatus.locked:
      return "已上锁";
    default:
      return "未开播";
  }
}
