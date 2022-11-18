import { runInAction } from 'mobx';
import store from '../store';
import Controller from './Controller';
import api from './api';

export default class ControllerLiving {
  count = 0
  constructor(controller: Controller) {
    api.on('living', (e: any, { key, value }: { key: string; value: any }) => {
      console.log({ key, value });
      this.updateStore({ key, value });
    });
    api.on('msg', (e: any, msg: any) => {
      store.message.pushMessage(msg, "chat", this.count);
      this.count ++
    });
    console.log(api);
  }
  
  updateStore({ key, value }: { key: string; value: any }) {
    switch (key) {
      case 'addRoom':
        store.living.addRoom(value.key, value.room);
        break;
      case 'removeRoom':
        store.living.removeRoom(value.key);
        break;
      case 'updateRoomInfo':
        store.living.updateRoomInfo(value.key, value.room);
        break;
      case 'openRoom':
        store.living.openRoom(value.key);
        break;
      case 'closeRoom':
        store.living.closeRoom(value.key);
        break;
      case 'rooms':
        runInAction(() => {
          store.living.roomMap = new Map(value);
        });
        break;
      case 'started':
        runInAction(() => {
          store.living.started = value;
        });
        break;
      case 'timestamp':
        runInAction(() => {
          store.living.timestamp = value;
        });
        break;
      case 'start':
        store.living.start(value.timestamp);
        break;
      case 'end':
        store.living.end(value.timestamp);
        break;
    }
  }
}
