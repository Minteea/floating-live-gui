import { Button } from 'antd';
import { MessageType } from 'floating-living/src/Message/MessageInterface';
import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import MessageLine from './MessageLine';
import {
  // 图标导入
  ArrowDownOutlined,
} from '@ant-design/icons';

/** 消息板 */
const MessageBoard: React.FC<{
  list: Array<MessageType & {key: string}>;
  style?: React.CSSProperties;
}> = function (props) {
  const refMessageContent = useRef<HTMLDivElement>(null)
  const [autoScroll, setAutoScroll] = useState(true)
  const scrollToBottom = () => {
    refMessageContent.current!.scrollIntoView({ behavior: "smooth", block: "end" });
  }
  useEffect(() => {
    console.log("数据更新")
    autoScroll && scrollToBottom()
  })
  return (
    <div style={{position: "relative"}}>
      <div
        style={{ overflowY: 'auto', ...props.style }}
        className="ant-card ant-card-bordered"
        onWheel={() => {setAutoScroll(false)}}
      >
        <div ref={refMessageContent}
        >
          {props.list.map((msg) => (
            <MessageLine msg={msg} key={msg.key} />
          ))}
        </div>
      </div>
      <div style={{
        position: "absolute",
        display: autoScroll ? "none" : "",
        right: 0,
        bottom: 0
      }}>
        <Button 
          type="primary"
          shape="circle"
          onClick={() => {
            scrollToBottom()
            setAutoScroll(true)
          }}
          icon={<ArrowDownOutlined />}
        />
      </div>
    </div>
  );
};

export default observer(MessageBoard);
