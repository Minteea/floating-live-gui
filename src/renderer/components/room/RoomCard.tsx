import { RoomInfo, RoomStatus } from 'floating-live';
import { secondToTime } from '../../utils/time';
import { getLiveStatus } from '../../utils/enumUtils';
import { useInterval } from 'ahooks';
import { useEffect, useState } from 'react';
import { Divider } from 'antd';

/** 直播间卡片 */
const RoomCard: React.FC<{
  roomInfo?: RoomInfo | null;
  button?: {
    top?: Array<React.ReactElement>;
    bottom?: Array<React.ReactElement>;
  };
}> = function (props) {
  const info = props.roomInfo;
  const [timeSec, setTimeSec] = useState((Date.now() - info?.timestamp || 0)/1000)
  useInterval(() => {
    setTimeSec((Date.now() - info?.timestamp || 0)/1000)
  }, 100)
  return (
    <div className="ant-card ant-card-bordered" style={{}}>
      <div style={{ display: 'flex', position: 'relative' }}>
        <div style={{ flexShrink: 0, padding: 10 }}>
          <img width={50} height={50} style={{borderRadius:"50%"}} src={info?.anchor.avatar} referrerPolicy="no-referrer" />
        </div>
        <div style={{ flexGrow: 1, padding: '10px 0' }}>
          <div style={{ lineHeight: '25px' }}>
            <div
              style={{ display: 'inline-block', fontSize: 16, fontWeight: 600 }}
            >
              {info?.anchor.name || '--'}
            </div>
            <div
              style={{ display: 'inline-block', fontSize: 13, paddingLeft: 10 }}
            >
              {info?.platform || '--'}:{info?.id || '--'}
            </div>
            <div
              style={{ display: 'inline-block', fontSize: 13, paddingLeft: 10 }}
            >
              {info?.detail.area?.join(' > ') || ''}
            </div>
          </div>
          <div style={{ display: 'flex', lineHeight: '22px' }}>
            <div style={{ fontSize: 13, paddingRight: 10 }}>
              ● {getLiveStatus(info?.status || RoomStatus.off)}
            </div>
            <div style={{ fontSize: 13 }}>{info?.detail.title || ''}</div>
          </div>
        </div>
        <div style={{ flexShrink: 0, padding: 5 }}>
          <div style={{ textAlign: 'right', lineHeight: '30px' }}>
            {props.button?.top}
          </div>
          <div style={{ textAlign: 'right', lineHeight: '30px' }}>
            {props.button?.bottom}
          </div>
        </div>
      </div>
      <div style={{
        fontSize: 13,
        display: (info?.opening && info?.status == RoomStatus.live) ? '' : 'none'
      }}>
        <Divider style={{margin: 0}}/>
        <div style={{
          position: 'relative',
          display: 'flex',
          padding: "0 10px",
          gap: "10px"
        }}>
          <div>{secondToTime(timeSec)}</div>
          {info?.stats?.online != undefined ? <div>在线 {info?.stats?.online}</div> : null}
          {info?.stats?.watch != undefined ? <div>浏览 {info?.stats?.watch}</div> : null}
          {info?.stats?.like != undefined ? <div>点赞 {info?.stats?.like}</div> : null}
          {info?.stats?.popularity != undefined ? <div>人气值 {info?.stats?.popularity}</div> : null}
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
