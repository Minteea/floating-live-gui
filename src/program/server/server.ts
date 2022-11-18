import { EventEmitter } from 'events';
import WebSocket from 'ws';
import express from 'express'
import expressWs from 'express-ws';

import Program from '..';
import { UniLink, UniSender } from '../link/UniLink';
import ImageStorage from './ImageStorage';

class WsUniSender implements UniSender {
  origin: WebSocket.WebSocket
  type = "websocket"
  constructor(ws: WebSocket.WebSocket) {
    this.origin = ws
  }
  send(channel: string, ...args: any[]) {
    this.origin.send(JSON.stringify({ channel, args }));
  }
}

export default class Server extends EventEmitter implements UniLink {
  private app: express.Application = express();
  private ws: expressWs.Instance = expressWs(this.app)
  port = 8130;
  service: any = null

  // imageStorage: ImageStorage = new ImageStorage()

  program: Program;

  get serving() {
    return !!this.service
  }

  constructor(program: Program, config: any) {
    super();
    this.port = config.server.port || this.port;
    this.program = program;
    this.initService();
    this.initCommamd();
  }

  private initService() {
    this.app.use("/static", express.static("./storage"))
    this.ws.app.ws("/ws", (ws, req) => {
      console.log("有客户端连接")
      this.emit('connect', new WsUniSender(ws));
      ws.on('message', (buffer) => {
        const data = JSON.parse(buffer.toString());
        this.emit(data.channel, new WsUniSender(ws), ...data.args);
      });
    })
  }

  open() {
    if (this.service) return;
    this.service = this.app.listen(this.port, "localhost")
    this.program.send('server', { key: 'sendMessage', value: this.serving });
  }

  send(channel: string, ...args: any[]) {
    this.ws?.getWss().clients.forEach((ws) => {
      ws.send(JSON.stringify({ channel, args }));
    });
  }

  sendTo(ws: WebSocket.WebSocket, channel: string, ...args: any[]) {
    ws.send(JSON.stringify({ channel, args }));
  }

  close() {
    if (!this.service) return;
    this.service.close()
    this.service = null;
    this.program.send('server', { key: 'sendMessage', value: this.serving });
  }

  changePort(num: number) {
    if (num == this.port) return;
    this.port = num;
    if (this.service) {
      this.close();
      this.open();
    }
    this.program.send('server', { key: 'port', value: this.port });
  }

  getInitData() {
    return {
      sendMessage: this.serving,
      port: this.port,
    };
  }

  private initCommamd() {
    this.program.addCommandFrom({
      server: (b = true) => {
        if (b) {
          this.open();
        } else {
          this.close();
        }
      },
      port: (num) => {
        this.changePort(Number(num));
      },
    });
  }
}
