import { EventEmitter } from "events";
import fastify from "fastify";
import cors from "@fastify/cors";

import { FloatingCommandMap, FloatingLive } from "floating-live";
import fastifyWebsocket from "@fastify/websocket";

declare module "floating-live" {
  interface FloatingCommandMap {
    "server.open": () => void;
    "server.close": () => void;
  }
  interface FloatingEventMap {
    "server:open": () => void;
    "server:close": () => void;
  }
  interface FloatingValueMap {
    "server.open": boolean;
    "server.port": number;
  }
}

export default class Server {
  static readonly pluginName = "server";
  readonly app = fastify();
  port = 8130;
  initialized = false;

  // imageStorage: ImageStorage = new ImageStorage()

  main: FloatingLive;

  get opened() {
    return !!this.app.server.address();
  }

  constructor(main: FloatingLive, options: { port: number; opened: boolean }) {
    this.port = options?.port || this.port;
    this.main = main;
    this.initService();
    options?.opened && this.open();
  }

  register() {
    this.main.command.register("server.open", () => {
      this.open();
    });
    this.main.command.register("server.close", () => {
      this.close();
    });

    this.main.value.register("server.open", {
      get: () => this.opened,
      set: (value) => (value ? this.open() : this.close()),
    });
    this.main.value.register("server.port", {
      get: () => this.port,
      set: (value) => this.changePort(value),
    });

    this.main.on("event", (channel, ...args) =>
      this.send("event", channel, ...args)
    );
  }

  private initService() {
    this.app.register(cors);
    this.app.register(fastifyWebsocket);
    this.app.register(async (app) => {
      app.get("/ws", { websocket: true }, (connection, request) => {
        // 连接后发送初始化消息
        connection.socket.send(
          JSON.stringify(["snapshot", this.main.getSnapshot()])
        );
      });
    });
    this.app.post(
      "/post",
      {
        schema: {
          body: {
            type: "array",
          },
        },
      },
      async (request, reply) => {
        const [channel, ...args] = request.body as [string, ...any[]];
        if (channel == "command") {
          try {
            const [name, ...cArgs] = args as [
              keyof FloatingCommandMap,
              ...Parameters<FloatingCommandMap[keyof FloatingCommandMap]>
            ];
            const result = await this.main.call(name, ...cArgs);
            reply.send(JSON.stringify([1, result]));
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
            reply.send(JSON.stringify([0, rej]));
          }
        } else {
          reply.send(
            JSON.stringify([
              0,
              {
                message: "请求失败",
                reason: "未知的channel请求",
                id: "server:unknown_channel",
              },
            ])
          );
        }
      }
    );
  }

  open() {
    if (this.opened) return;
    console.log("服务开启");
    if (!this.initialized) {
      this.app.listen({ port: this.port });
      this.initialized = true;
    } else {
      this.app.server.listen(this.port);
    }
    this.main.emit("server:open");
    this.main.value.emit("server.open", true);
  }

  send(channel: string, ...args: any[]) {
    this.app?.websocketServer?.clients.forEach((ws: WebSocket) => {
      ws.send(JSON.stringify([channel, ...args]));
    });
  }

  close() {
    if (!this.opened) return;
    console.log("服务关闭");
    this.app.server.close();
    this.main.emit("server:close");
    this.main.value.emit("server.open", false);
  }

  changePort(num: number) {
    if (num == this.port) return;
    this.port = num;
    if (this.opened) {
      this.app.server.close();
      this.app.server.listen(this.port);
    }
    this.main.value.emit("server.port", this.port);
  }
}
