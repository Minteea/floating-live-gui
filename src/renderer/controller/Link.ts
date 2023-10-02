import Controller from "./Controller";
import { store, setAtom } from "../store";
import api from "./api";
import version from "./version";

export default class ControllerLink {
  controller: Controller;

  ws: WebSocket | null = null;

  url: string = "localhost:8130";

  timeout: number = 5000;

  connected: boolean = false;

  constructor() {
    if (api.browserApi) {
      api.browserApi.sendHandler = (channel, ...args) => {
        if (this.connected) return this._browserApiSend(channel, ...args);
      };
    }
  }

  connect() {
    if (this.ws) this.ws.close();
    this.ws = new WebSocket(`ws://${this.url}/ws`);
    console.log(`ws://${this.url}/ws`);
    this.ws.onopen = (e) => {
      console.log("已连接上");
      this.connected = true;
      setAtom(store.link.connected, true);
    };
    this.ws.onclose = (e) => {
      console.log("已断开连接");
      this.connected = false;
      setAtom(store.link.connected, false);
      if (version.client != "electron") version.app = "";
    };
    this.ws.onmessage = (e) => {
      console.log(e.data);
      const [channel, ...args] = JSON.parse(e.data);
      this._browserApiEmit(channel, ...args);
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
    return fetch(`http://${this.url}/post`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify([channel, ...args]),
    })
      .then((response) => response.json())
      .then(([ok, res]) => (ok ? res : undefined));
  }

  link(url: string = this.url) {
    this.url = url;
    this.disconnect();
    this.connect();
  }
}
