import { BasePlugin, PluginContext, ValueContext } from "floating-live";
import { JsonSerializer } from "../../../../utils/serializer";

declare const NODE_ENV: string;
declare module "floating-live" {
  interface AppCommandMap {
    link: (url: string) => void;
  }

  interface AppEventDetailMap {
    link: { url: string };
    "link:disconnect": {};
  }

  interface AppValueMap {
    "link.url": string;
    "link.connected": boolean;
  }
}

export class WebLink extends BasePlugin {
  static pluginName = "webLink";

  ws: WebSocket | null = null;
  url: string =
    NODE_ENV == "production" ? `${location.host}` : "localhost:8130";
  timeout: number = 5000;
  connected: boolean = false;
  wsRoute: string = "/ws";
  httpRoute: string = "/api";

  private valueContexts: {
    url: ValueContext<string>;
    connected: ValueContext<boolean>;
  };

  get wsUrl() {
    return `${this.url}${this.wsRoute}`;
  }
  get httpUrl() {
    return `${this.url}${this.httpRoute}`;
  }
  constructor(ctx: PluginContext) {
    super(ctx);

    this.valueContexts = {
      url: ctx.registerValue("link.url", {
        get: () => this.url,
        set: (url) => {
          this.setUrl(url);
        },
      }),
      connected: ctx.registerValue("link.connected", {
        get: () => this.connected,
      }),
    };
  }

  init(ctx: PluginContext) {
    ctx.registerCommand("send", (e, channel, ...args) =>
      this._send(channel, ...args)
    );
    ctx.registerCommand("link", (e, url: string) => this.link(url));
  }

  connect() {
    if (this.ws) this.ws.close();
    this.ws = new WebSocket(`ws://${this.wsUrl}`);
    this.ws.onopen = (e) => {
      console.log("已连接上");
      this.connected = true;
      this.valueContexts.connected.emit(true);
      this.ctx.emit("link", { url: this.url });
    };
    this.ws.onclose = (e) => {
      console.log("已断开连接");
      this.connected = false;
      this.valueContexts.connected.emit(false);
      this.ctx.emit("link:disconnect", {});
    };
    this.ws.onmessage = (e) => {
      console.log(e.data);
      const [channel, ...args] = JsonSerializer.deserialize(e.data);
      this._emit(channel, ...args);
    };
  }

  _emit(channel: string, ...args: any[]) {
    switch (channel) {
      case "event": {
        const [name, detail] = args;
        this.ctx.emit(name, detail);
        return;
      }
      case "snapshot": {
        const [snapshot] = args;
        this.ctx.emit("snapshot", snapshot);
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
        body: JsonSerializer.serialize([channel, ...args]),
      })
        .then((response) => response.json())
        .then(([ok, res]) => {
          if (ok) return res;
          else throw res;
        })
        .catch((err) => {
          if (err._error) {
            this.ctx.throw(err);
          } else {
            throw err;
          }
        });
    } else {
      throw new this.Error("link:send_disconnected", {
        message: "消息发送失败",
        cause: "未连接服务",
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
      this.valueContexts.url.emit(url);
    } else {
      this.link(url);
    }
  }

  link(url: string) {
    this.url = url;
    this.valueContexts.url.emit(url);
    this.disconnect();
    this.connect();
  }
}
