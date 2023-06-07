import { UserAdmin, RoomStatus } from "floating-live";

export function getAdminType(n?: UserAdmin) {
  switch (n) {
    case UserAdmin.anchor:
      return "主播";
    case UserAdmin.admin:
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
