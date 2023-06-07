import { runInAction } from 'mobx';
import store from '../store';
import Controller from './Controller';
import api from './api';

export default class ControllerSave {
  controller: Controller
  constructor(controller: Controller) {
    this.controller = controller
    this.initEvent()
    console.log(api)
  }
  initEvent() {
    api.on('save_message', (e: any, b: boolean) => {
      runInAction(() => { store.save.saveMessage = b })
    })
    api.on('save_origin', (e: any, b: boolean) => {
      runInAction(() => { store.save.saveOrigin = b })
    })
    api.on('save_path', (e: any, path: string) => {
      runInAction(() => { store.save.savePath = path })
    })
  }
}
