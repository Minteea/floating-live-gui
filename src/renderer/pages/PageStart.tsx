import { runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import { Button, Input } from 'antd';
import store from '../store';
import RoomList from '../components/room/RoomList';
import MessageBoard from '../components/message/MessageBoard';
import controller from '../controller';
import { useState } from 'react';

const PageStart: React.FC = function () {
  const list = [...store.living.roomMap].map((item) => ({
    key: item[0],
    room: item[1],
  }));
  return (
    <div>
      <Button
        type="primary"
        danger={store.living.started}
        onClick={
          store.living.started
            ? () => {
                controller.cmd("end");
              }
            : () => {
                controller.cmd("openAll");
              }
        }
      >
        {store.living.started ? '停止记录' : '开始记录'}
      </Button>
      {store.living.started ? (
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
            value={store.common.command_input}
            onChange={(e) => {
              runInAction(() => {store.common.command_input = e.target.value})
            }}
            onPressEnter={(e) => {
              controller.exec(store.common.command_input)
              runInAction(() => {store.common.command_input = ""})
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
