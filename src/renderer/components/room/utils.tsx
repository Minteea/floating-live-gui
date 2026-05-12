import { LiveRoomStatus } from "floating-live";
import {
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  MinusCircleOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";

export function getLiveStatusIcon(n?: LiveRoomStatus) {
  switch (n) {
    case LiveRoomStatus.live:
      return <PlayCircleOutlined />;
    case LiveRoomStatus.round:
      return <ClockCircleOutlined />;
    case LiveRoomStatus.banned:
      return <ExclamationCircleOutlined />;
    case LiveRoomStatus.locked:
      return <CloseCircleOutlined />;
    default:
      return <MinusCircleOutlined />;
  }
}
