import { runInAction } from 'mobx';
import store from '../store';
import Controller from './Controller';
import api from './api';
import { RoomInfo, RoomBaseInfo } from 'floating-live';
import { MessageData } from 'floating-live/src/types/message/MessageData'

export default class ControllerLive {
  count: number = 0
  constructor(controller: Controller) {
    api.on('live_message', (e: any, msg: MessageData) => {
      store.message.pushMessage(msg, "chat", this.count);
      this.count ++
    });
    this.initEvent()
  }
  initEvent() {
    console.log(store)
    api.on('room_list', (e, roomInfoList) => {
      runInAction(() => {
        store.live.roomMap = new Map(roomInfoList);
      });
    })
    api.on('room_add', (e, key: string, room: RoomInfo) => {
      store.live.addRoom(key, room)
    })
    api.on('room_remove', (e, key: string) => {
      store.live.removeRoom(key)
    })
    api.on('room_info', (e, key: string, room: RoomInfo) => {
      store.live.updateRoomInfo(key, room)
    })
    api.on('room_open', (e, key: string, room: RoomInfo) => {
      store.live.openRoom(key)
    })
    api.on('room_close', (e, key: string, room: RoomInfo) => {
      store.live.closeRoom(key)
    })
    api.on('room_change', (e, key: string, data: Partial<RoomBaseInfo>) => {
      store.live.changeLiveInfo(key, data)
    })
    api.on('start', (e, timestamp: number) => {
      store.message.clear()
      store.live.start(timestamp)
    })
    api.on('end', (e, timestamp: number) => {
      store.live.end(timestamp)
    })
  }
}
