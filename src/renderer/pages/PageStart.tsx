import { runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import { Button, Input } from 'antd';
import store from '../store';
import RoomList from '../components/room/RoomList';
import MessageBoard from '../components/message/MessageBoard';
import controller from '../controller';
import { useState } from 'react';

const PageStart: React.FC = function () {
  const list = [...store.live.roomMap].map((item) => ({
    key: item[0],
    room: item[1],
  }));
  return (
    <div>
      <Button
        type="primary"
        danger={store.live.started}
        onClick={
          store.live.started
            ? () => {
                controller.cmd("end");
              }
            : () => {
                controller.cmd("openAll");
              }
        }
      >
        {store.live.started ? '停止记录' : '开始记录'}
      </Button>
      {store.live.started ? (
        <>
          <MessageBoard
            list={store.message.messageList}
            style={{
              width: '100%',
              height: 400,
              background: 'white',
            }}
          />
          <Input
            value={store.common.commandInput}
            onChange={(e) => {
              runInAction(() => {store.common.commandInput = e.target.value})
            }}
            onPressEnter={(e) => {
              controller.exec(store.common.commandInput)
              runInAction(() => {store.common.commandInput = ""})
            }}
            placeholder="输入指令..."
          />
        </>
      ) : null}
      <RoomList list={list} />
    </div>
  );
};

export default observer(PageStart);
