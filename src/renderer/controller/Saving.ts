import { runInAction } from 'mobx';
import store from '../store';
import Controller from './Controller';
import api from './api';

export default class ControllerSaving {
  controller: Controller
  constructor(controller: Controller) {
    this.controller = controller
    api.on('saving', (e: any, { key, value }: { key: string; value: any }) => {
      console.log({ key, value });
      this.updateStore({ key, value });
    });
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
