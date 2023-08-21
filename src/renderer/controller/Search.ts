import Controller from './Controller';
import api from './api';
import { RoomInfo } from 'floating-live'
import { updateSearch } from '../store/storeSearch';

export default class ControllerSearch {
  constructor(controller: Controller) {
    this.initEvent()
  }
  initEvent() {
    api.on('search', (e: any, key: string, room: RoomInfo) => {
      updateSearch(key, room)
    })
    api.on('search_update', (e: any, key: string, room: RoomInfo) => {
      updateSearch(key, room)
    })
  }
}
