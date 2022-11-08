import { runInAction } from 'mobx';
import store from '../store';
import Controller from './Controller';
import api from './api';

export default class ControllerSaving {
  constructor(controller: Controller) {
    api.on('saving', (e: any, { key, value }: { key: string; value: any }) => {
      console.log({ key, value });
      this.updateStore({ key, value });
    });
  }

  saveMessage(b: boolean) {
    api.send('cmd', { cmd: 'saveMessage', value: [b] });
  }

  saveOrigin(b: boolean) {
    api.send('cmd', { cmd: 'saveOrigin', value: [b] });
  }

  savePath(path: string) {
    api.send('cmd', { cmd: 'savePath', value: [path] });
  }

  updateStore({ key, value }: { key: string; value: any }) {
    switch (key) {
      case 'saveMessage':
        runInAction(() => {
          store.saving.save_message = value;
        });
        break;
      case 'saveOrigin':
        runInAction(() => {
          store.saving.save_origin = value;
        });
        break;
      case 'savePath':
        runInAction(() => {
          store.saving.save_path = value;
        });
        break;
    }
  }
}
