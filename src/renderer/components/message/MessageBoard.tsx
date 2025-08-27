import { Button, Card } from "antd";
import { LiveMessage } from "floating-live";
import { useEffect, useRef, useState } from "react";
import MessageLine from "./MessageLine";
import {
  // 图标导入
  ArrowDownOutlined,
} from "@ant-design/icons";

/** 消息板 */
const MessageBoard: React.FC<{
  list: LiveMessage.All[];
  style?: React.CSSProperties;
}> = function (props) {
  const refMessageContent = useRef<HTMLDivElement>(null);
  const refMessageContainer = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const scrollToBottom = () => {
    console.log(refMessageContent.current?.clientHeight);
    refMessageContent.current!.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };
  useEffect(() => {
    console.log("数据更新");
    autoScroll && scrollToBottom();
  });
  return (
    <Card
      size="small"
      style={{ position: "relative", overflow: "hidden", ...props.style }}
      styles={{ body: { padding: 0 } }}
    >
      <div
        ref={refMessageContainer}
        style={{
          position: "absolute",
          overflowY: "auto",
          top: 0,
          bottom: 0,
          width: "100%",
        }}
        onWheel={(e) => {
          if (e.deltaY < 0) {
            setAutoScroll(false);
          } else if (e.deltaY > 0) {
            const el = refMessageContainer.current!;
            if (el.scrollTop + el.clientHeight >= el.scrollHeight - 100) {
              setAutoScroll(true);
            }
          }
        }}
      >
        <div ref={refMessageContent} style={{ padding: "8px 12px" }}>
          {props.list.map((msg) => (
            <MessageLine msg={msg} key={msg.id} />
          ))}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          display: autoScroll ? "none" : "",
          right: 12,
          bottom: 12,
        }}
      >
        <Button
          type="primary"
          shape="circle"
          onClick={() => {
            scrollToBottom();
            setAutoScroll(true);
          }}
          icon={<ArrowDownOutlined />}
        />
      </div>
    </Card>
  );
};

export default MessageBoard;
