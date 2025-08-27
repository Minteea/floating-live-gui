import { LiveRoomData } from "floating-live";
import { LiveRoomStatus } from "floating-live";
import { secondToTime } from "../../utils/time";
import { getLiveStatus } from "../../utils/enumUtils";
import { useInterval } from "ahooks";
import { ReactNode, useEffect, useState } from "react";
import { Card, Divider, Tag } from "antd";
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

/** 直播间卡片 */
const RoomCard: React.FC<{
  roomInfo?: LiveRoomData | null;
  button?: {
    top?: Array<ReactNode>;
    bottom?: Array<ReactNode>;
  };
}> = function (props) {
  const info = props.roomInfo;
  const [timeSec, setTimeSec] = useState(
    (Date.now() - (info?.timestamp || 0)) / 1000
  );
  useInterval(() => {
    setTimeSec((Date.now() - (info?.timestamp || 0)) / 1000);
  }, 100);
  return (
    <Card size="small">
      <div style={{ display: "flex", position: "relative" }}>
        <div style={{ height: 56, flexShrink: 0 }}>
          <img
            width={56}
            height={56}
            style={{ borderRadius: "50%" }}
            src={info?.anchor.avatar}
            referrerPolicy="no-referrer"
          />
        </div>
        <div style={{ flexGrow: 1, paddingLeft: 12 }}>
          <div style={{ lineHeight: "28px" }}>
            <div
              style={{ display: "inline-block", fontSize: 16, fontWeight: 600 }}
            >
              {info?.anchor.name || "--"}
            </div>
            <div
              style={{ display: "inline-block", fontSize: 13, paddingLeft: 10 }}
            >
              {info?.platform || "--"}:{info?.id || "--"}
            </div>
            <div
              style={{ display: "inline-block", fontSize: 13, paddingLeft: 10 }}
            >
              {info?.detail.area?.join(" > ") || ""}
            </div>
          </div>
          <div style={{ display: "flex", lineHeight: "22px", marginTop: 4 }}>
            <Tag
              bordered={false}
              icon={getLiveStatusIcon(info?.status || LiveRoomStatus.off)}
              color={info?.status == LiveRoomStatus.live ? "blue" : ""}
              style={{ lineHeight: "20px", fontSize: 13 }}
            >
              {getLiveStatus(info?.status || LiveRoomStatus.off)}
            </Tag>
            <div style={{ fontSize: 13 }}>{info?.detail.title || ""}</div>
          </div>
        </div>
        <div style={{ flexShrink: 0 }}>
          <div style={{ textAlign: "right", height: 24 }}>
            {props.button?.top}
          </div>
          <div style={{ textAlign: "right", height: 24, marginTop: 6 }}>
            {props.button?.bottom}
          </div>
        </div>
      </div>
      <div
        style={{
          fontSize: 13,
          display:
            info?.opened && info?.status == LiveRoomStatus.live ? "" : "none",
        }}
      >
        <Divider style={{ margin: "12px 0 4px" }} />
        <div
          style={{
            position: "relative",
            display: "flex",
            gap: "10px",
            marginBottom: "-8px",
          }}
        >
          <div>{secondToTime(timeSec)}</div>
          {info?.stats?.online != undefined ? (
            <div>在线 {info?.stats?.online}</div>
          ) : null}
          {info?.stats?.view != undefined ? (
            <div>浏览 {info?.stats?.view}</div>
          ) : null}
          {info?.stats?.like != undefined ? (
            <div>点赞 {info?.stats?.like}</div>
          ) : null}
          {info?.stats?.popularity != undefined ? (
            <div>人气值 {info?.stats?.popularity}</div>
          ) : null}
        </div>
      </div>
    </Card>
  );
};

export default RoomCard;
