import { EventEmitter } from "events";
import WebSocket from "ws";
import Koa from "koa";
import cors from "@koa/cors";
import Router from "koa-router";
import websockify from "koa-websocket";

import bodyParser from "koa-bodyparser";
import { FloatingLive, FloatingLivePlugin } from "floating-live";

class Server extends EventEmitter {
  private app = websockify(new Koa());
  port = 8130;
  service: any = null;

  // imageStorage: ImageStorage = new ImageStorage()

  main: FloatingLive;

  get opened() {
    return !!this.service;
  }

  constructor(main: FloatingLive, config: { port: number; opened: boolean }) {
    super();
    this.port = config?.port || this.port;
    this.main = main;
    this.initService();
    config?.opened && this.open();
  }

  private initService() {
    this.app.use(cors());
    this.app.use(bodyParser());
    const router = new Router();
    const wsRouter = new Router<
      any,
      websockify.MiddlewareContext<Koa.DefaultState>
    >();
    router.post("/post", async (ctx) => {
      const [channel, ...args] = ctx.request.body as [string, ...any[]];
      if (channel == "command") {
        try {
          const [name, ...cArgs] = args;
          const result = await this.main.command.execute(name, ...cArgs);
          ctx.body = JSON.stringify([1, result]);
        } catch (err) {
          ctx.body = JSON.stringify([0, err]);
        }
      } else {
        ctx.body = JSON.stringify([0]);
      }
    });
    wsRouter.all("/ws", (ctx) => {
      console.log("有客户端连接");
      this.emit("connect", ctx.websocket);
    });
    this.app.use(router.routes()).use(router.allowedMethods());
    this.app.ws
      .use(wsRouter.routes() as any)
      .use(wsRouter.allowedMethods() as any);
  }

  open() {
    if (this.service) return;
    this.service = this.app.listen(this.port);
    this.main.emit("server:open");
  }

  send(channel: string, ...args: any[]) {
    this.app.ws.server.clients.forEach((ws) => {
      ws.send(JSON.stringify([channel, ...args]));
    });
  }

  sendTo(ws: WebSocket.WebSocket, channel: string, ...args: any[]) {
    ws.send(JSON.stringify([channel, ...args]));
  }

  close() {
    if (!this.service) return;
    this.service.close();
    this.service = null;
    this.main.emit("server:close");
  }

  changePort(num: number) {
    if (num == this.port) return;
    this.port = num;
    if (this.service) {
      this.close();
      this.open();
    }
    this.main.emit("server:port", this.port);
  }
}

const pluginServer: FloatingLivePlugin<{
  opened: boolean;
  port: number;
}> = () => {
  return {
    name: "server",
    register: (ctx, config) => {
      const server = new Server(ctx, config);
      server.on("connect", (e) => {
        server.sendTo(e, "state", ctx.state.generate());
      });
      ctx.command.register("server.open", () => {
        server.open();
      });
      ctx.command.register("server.close", () => {
        server.close();
      });
      ctx.command.register("server.port", (num) => {
        server.changePort(Number(num));
      });

      ctx.state.register("server", () => {
        return {
          port: server.port,
          opened: server.opened,
        };
      });

      ctx.on("event", (channel, ...args) => server.send(channel, ...args));
      ctx.on("server:open", () => ctx.state.set("server.opened", true));
      ctx.on("server:close", () => ctx.state.set("server.opened", false));
      ctx.on("server:port", (val) => ctx.state.set("server.port", val));
    },
  };
};

export default pluginServer;
