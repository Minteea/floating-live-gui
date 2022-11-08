import { EventEmitter } from 'events';
import WebSocket, { Server as WebSocketServer } from 'ws';

import Program from '.';

export default class Server extends EventEmitter {
  wss: WebSocketServer | null = null;

  port = 8130;

  program: Program;

  constructor(program: Program, config: any) {
    super();
    this.port = config.server.port || this.port;
    this.program = program;
    this._initCommamd();
  }

  get serving() {
    return !!this.wss;
  }

  open() {
    if (this.wss) return;
    this.wss = new WebSocketServer({ port: this.port });
    console.log(`已在端口${this.port}启动`);

    this.wss.on('connection', (ws) => {
      this.emit('connect', ws);
      ws.on('message', (buffer) => {
        const data = JSON.parse(buffer.toString());
        this.emit(data.channel, ...data.args);
      });
    });

    this.program.send('server', { key: 'sendMessage', value: this.serving });
  }

  send(channel: string, ...args: any[]) {
    this.wss?.clients.forEach((ws) => {
      ws.send(JSON.stringify({ channel, args }));
    });
  }

  sendTo(ws: WebSocket.WebSocket, channel: string, ...args: any[]) {
    ws.send(JSON.stringify({ channel, args }));
  }

  close() {
    if (!this.wss) return;
    this.wss.close();
    this.wss.removeAllListeners();
    this.wss = null;
    this.program.send('server', { key: 'sendMessage', value: this.serving });
  }

  changePort(num: number) {
    if (num == this.port) return;
    this.port = num;
    if (this.wss) {
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

  _initCommamd() {
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
