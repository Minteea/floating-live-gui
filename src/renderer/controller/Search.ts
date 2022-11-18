import { runInAction } from 'mobx';
import store from '../store';
import Controller from './Controller';
import api from './api';

export default class ControllerSearch {
  constructor(controller: Controller) {
    api.on('search', (e: any, { key, value }: { key: string; value: any }) => {
      this.updateStore({ key, value });
    });
  }
  
  updateStore({ key, value }: { key: string; value: any }) {
    switch (key) {
      case 'updateRoomInfo':
        store.search.updateRoomInfo(value);
        break;
    }
  }
}
