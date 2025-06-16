import { Context, Hono, HonoRequest } from "hono";
import { BlankEnv, BlankInput, MergePath } from "hono/types";
import { cors } from "hono/cors";
import { serve, ServerType } from "@hono/node-server";
import { createNodeWebSocket } from "@hono/node-ws";

import {
  AppCommandMap,
  BasePlugin,
  FloatingLive,
  ValueContext,
} from "floating-live";
import { UpgradeWebSocket, WSContext } from "hono/ws";
import WebSocket from "ws";
import { Server as HttpServer } from "http";
import { Http2Server, Http2SecureServer } from "http2";

declare module "floating-live" {
  interface AppCommandMap {
    "server.open": () => void;
    "server.close": () => void;
  }
  interface AppEventDetailMap {
    "server:open": {};
    "server:close": {};
  }
  interface AppValueMap {
    "server.open": boolean;
    "server.port": number;
  }
}

export default class Server extends BasePlugin {
  static readonly pluginName = "server";
  readonly app = new Hono();
  protected server: ServerType | null = null;
  private honoWebsocketClients = new Map<WSContext, {}>();
  port = 8130;
  initialized = false;

  private injectWebSocket!: (
    server: HttpServer | Http2Server | Http2SecureServer
  ) => void;
  private upgradeWebSocket!: UpgradeWebSocket<WebSocket>;

  private valueCtxPort!: ValueContext<number>;
  private valueCtxOpen!: ValueContext<boolean>;

  // imageStorage: ImageStorage = new ImageStorage()

  get opened() {
    return !!this.server?.address();
  }

  init(ctx: FloatingLive, options: { port: number; opened: boolean }) {
    const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({
      app: this.app,
    });

    this.injectWebSocket = injectWebSocket;
    this.upgradeWebSocket = upgradeWebSocket;

    this.port = options?.port || this.port;
    this.initService();
    options?.opened && this.open();

    this.ctx.registerCommand("server.open", () => {
      this.open();
    });
    this.ctx.registerCommand("server.close", () => {
      this.close();
    });

    this.valueCtxOpen = this.ctx.registerValue("server.open", {
      get: () => this.opened,
      set: (value) => (value ? this.open() : this.close()),
    });
    this.valueCtxPort = this.ctx.registerValue("server.port", {
      get: () => this.port,
      set: (value) => this.changePort(value),
    });

    this.ctx.on("event", (channel, ...args) =>
      this.send("event", channel, ...args)
    );
  }

  private initService() {
    this.app.use("/*", cors());
    this.app.get(
      "/ws",
      this.upgradeWebSocket((c) => {
        let connected = false;
        return {
          onMessage: (e, ws) => {
            const { snapshots } = JSON.parse(e.data as string);
            const allSnapshots: Record<string, any> = {};
            (snapshots as string[]).forEach((name) => {
              try {
                allSnapshots.name = this.ctx.call(`${name}.snapshot`);
              } catch (e) {}
            });
            ws.send(JSON.stringify(["snapshot", allSnapshots]));
          },
          onOpen: (e, ws) => {
            this.honoWebsocketClients.set(ws, {});
            const timeout = setTimeout(() => {
              clearTimeout(timeout);
              if (!connected) ws.close();
            }, 5000);
          },
          onClose: (e, ws) => {
            this.honoWebsocketClients.delete(ws);
          },
        };
      })
    );

    this.app.post("/post", async (c) => {
      const [channel, ...args] = (await c.req.json()) as [string, ...any[]];
      if (channel == "command") {
        try {
          const [name, ...cArgs] = args as [
            keyof AppCommandMap,
            ...Parameters<AppCommandMap[keyof AppCommandMap]>
          ];
          const result = await this.ctx.call(name, ...cArgs);
          return Response.json([1, result]);
        } catch (err) {
          let rej;
          if (err instanceof Error) {
            rej = Object.assign(
              { message: err.message, name: err.name, _error: true },
              err
            );
          } else {
            rej = err;
          }
          return Response.json([0, rej]);
        }
      } else {
        Response.json([
          0,
          {
            message: "请求失败",
            reason: "未知的channel请求",
            id: "server:unknown_channel",
          },
        ]);
      }
    });
  }

  open() {
    if (this.opened) return;
    console.log("服务开启");

    this.server = serve(this.app);
    this.injectWebSocket(this.server);
    this.initialized = true;

    this.ctx.emit("server:open", {});
    this.valueCtxOpen.emit(true);
  }

  send(channel: string, ...args: any[]) {
    this.honoWebsocketClients.forEach((val, ws) => {
      ws.send(JSON.stringify([channel, ...args]));
    });
  }

  close() {
    if (!this.opened) return;
    console.log("服务关闭");
    this.server?.close();
    this.server = null;
    this.ctx.emit("server:close", {});
    this.valueCtxOpen.emit(false);
  }

  changePort(num: number) {
    if (num == this.port) return;
    this.port = num;
    if (this.opened) {
      this.server?.close();
      this.server = serve(this.app);
      this.injectWebSocket(this.server);
    }
    this.valueCtxPort.emit(this.port);
  }
}
