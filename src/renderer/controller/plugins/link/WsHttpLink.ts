import FloatingController from "../../Controller";

declare module "../../types" {
  interface ControllerCommandMap {
    link: (url: string) => void;
  }

  interface ControllerEventMap {
    link: (url: string) => void;
    "link:disconnect": () => void;
  }

  interface ControllerValueMap {
    "link.url": string;
    "link.connected": boolean;
  }
}

export class WsHttpLink {
  static pluginName = "link";

  ws: WebSocket | null = null;
  url: string = "localhost:8130";
  timeout: number = 5000;
  connected: boolean = false;
  wsRoute: string = "/ws";
  httpRoute: string = "/post";

  get wsUrl() {
    return `${this.url}${this.wsRoute}`;
  }
  get httpUrl() {
    return `${this.url}${this.httpRoute}`;
  }

  readonly main: FloatingController;

  constructor(main: FloatingController) {
    this.main = main;
    main.registerSender((channel, ...args) => this._send(channel, ...args));
    main.value.register("link.url", {
      get: () => this.url,
      set: (url) => {
        this.setUrl(url);
      },
    });
    main.value.register("link.connected", {
      get: () => this.connected,
    });
    main.command.register("link", (url: string) => this.link(url));
  }

  connect() {
    if (this.ws) this.ws.close();
    this.ws = new WebSocket(`ws://${this.wsUrl}`);
    this.ws.onopen = (e) => {
      console.log("已连接上");
      this.connected = true;
      this.main.emit("link", this.url);
    };
    this.ws.onclose = (e) => {
      console.log("已断开连接");
      this.connected = false;
      this.main.emit("link:disconnect");
    };
    this.ws.onmessage = (e) => {
      console.log(e.data);
      const [channel, ...args] = JSON.parse(e.data);
      this._emit(channel, ...args);
    };
  }

  _emit(channel: string, ...args: any[]) {
    switch (channel) {
      case "event": {
        const [name, ...eArgs] = args;
        this.main.emit(name, ...eArgs);
        return;
      }
      case "snapshot": {
        const [snapshot] = args;
        this.main.emit("snapshot", snapshot);
        return;
      }
    }
  }
  async _send(channel: string, ...args: any[]) {
    if (this.connected) {
      return await fetch(`http://${this.httpUrl}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify([channel, ...args]),
      })
        .then((response) => response.json())
        .then(([ok, res]) => (ok ? res : this.main.throw(res)))
        .catch((err) => {
          this.main.throw(err);
        });
    } else {
      this.main.throw({
        message: "消息发送失败",
        reason: "未连接服务",
        id: "link:send_disconnected",
      });
    }
  }

  disconnect() {
    if (!this.ws) return;
    this.ws.close();
  }
  setUrl(url: string) {
    if (!this.connected) {
      this.url = url;
      this.main.value.emit("link.url", url);
    } else {
      this.link(url);
    }
  }

  link(url: string) {
    this.url = url;
    this.main.value.emit("link.url", url);
    this.disconnect();
    this.connect();
  }
}
