import { runInAction } from 'mobx';
import Controller from './Controller';
import store from '../store';
import api from './api';

export default class ControllerServer {
  constructor(controller: Controller) {
    api.on('server', (e: any, { key, value }: { key: string; value: any }) => {
      console.log({ key, value });
      this.updateStore({ key, value });
    });
  }
  
  updateStore({ key, value }: { key: string; value: any }) {
    switch (key) {
      case 'port':
        runInAction(() => {
          store.server.port = value;
        });
        break;
      case 'sendMessage':
        runInAction(() => {
          store.server.send_message = value;
        });
        break;
    }
  }
}
