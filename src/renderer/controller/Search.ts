import { runInAction } from 'mobx';
import store from '../store';
import Controller from './Controller';
import api from './api';
import roomInfo from 'floating-live/src/types/room/RoomInfo'

export default class ControllerSearch {
  constructor(controller: Controller) {
    this.initEvent()
  }
  initEvent() {
    api.on('search', (e: any, key: string, room: roomInfo) => {
      store.search.updateRoomInfo(key, room)
    })
    api.on('search_update', (e: any, key: string, room: roomInfo) => {
      store.search.updateRoomInfo(key, room)
    })
  }
}
