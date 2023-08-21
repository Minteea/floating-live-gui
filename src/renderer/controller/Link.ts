import Controller from './Controller';
import store from '../store';
import api from './api';
import version from './version';

export default class ControllerLink {
  controller: Controller;

  ws: WebSocket | null = null;

  url: string = 'localhost:8130';

  timeout: number = 5000;

  connected: boolean = false;

  constructor(controller: Controller) {
    this.controller = controller;
    if (api.browserApi) {
      api.browserApi.sendHandler = (channel, ...args) => {
        this._browserApiSend(channel, ...args);
      };
    }
  }

  connect() {
    if (this.ws) this.ws.close();
    this.ws = new WebSocket(`ws://${this.url}/ws`);
    console.log(`ws://${this.url}/ws`)
    this.ws.onopen = (e) => {
      console.log('已连接上');
      this.connected = true;
        store.link.connected = true;
    };
    this.ws.onclose = (e) => {
      console.log('已断开连接');
      this.connected = false;
        store.link.connected = false;
      if (version.client != 'electron') version.app = '';
    };
    this.ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      this._browserApiEmit(data.channel, ...data.args);
    };
  }

  disconnect() {
    if (!this.ws) return;
    this.ws.close();
  }

  _browserApiEmit(channel: string, ...args: any[]) {
    api.browserApi?.emit(channel, ...args);
  }

  _browserApiSend(channel: string, ...args: any[]) {
    console.log({ channel, args });
    this.ws?.send(JSON.stringify({ channel, args }));
  }

  link(url: string = this.url) {
    this.url = url;
    this.disconnect();
    this.connect();
  }

  updateStore({ key, value }: { key: string; value: any }) {
    switch (key) {
    }
  }
}
