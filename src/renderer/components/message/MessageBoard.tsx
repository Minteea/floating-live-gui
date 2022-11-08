import { MessageType } from 'floating-living/src/Message/MessageInterface';
import { observer } from 'mobx-react-lite';
import MessageLine from './MessageLine';

/** 消息板 */
const MessageBoard: React.FC<{
  list: Array<MessageType>;
  style?: React.CSSProperties;
}> = function (props) {
  return (
    <div
      style={{ overflowY: 'auto', ...props.style }}
      className="ant-card ant-card-bordered"
    >
      <div>
        {props.list.map((msg) => (
          <MessageLine msg={msg} />
        ))}
      </div>
    </div>
  );
};

export default observer(MessageBoard);
