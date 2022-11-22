import { runInAction } from 'mobx';
import Controller from './Controller';
import store from '../store';
import api from './api';

export default class ControllerServer {
  constructor(controller: Controller) {
    api.on('server', (e: any, b: boolean) => {
      runInAction(() => {
        store.server.serving = b;
      });
    });
    api.on('port', (e: any, port: number) => {
      runInAction(() => {
        store.server.port = port;
      });
    });
  }
}
