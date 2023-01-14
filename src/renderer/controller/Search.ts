import { runInAction } from 'mobx';
import store from '../store';
import Controller from './Controller';
import api from './api';
import { RoomInfo } from 'floating-live'

export default class ControllerSearch {
  constructor(controller: Controller) {
    this.initEvent()
  }
  initEvent() {
    api.on('search', (e: any, key: string, room: RoomInfo) => {
      store.search.updateRoomInfo(key, room)
    })
    api.on('search_update', (e: any, key: string, room: RoomInfo) => {
      store.search.updateRoomInfo(key, room)
    })
  }
}
