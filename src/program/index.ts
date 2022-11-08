import { ipcMain, webContents } from 'electron';
import Living from './living';
import Saving from './saving';
import Server from './server';
import Command from './command';
import { CommandSet, FLCommandSet } from './CommandTypes';

const configPath = './config/config.json';
const config = require(configPath);

export default class Program {
  command = new Command();

  living = new Living(this, config);

  saving = new Saving(this, config);

  server = new Server(this, config);

  constructor() {
    this.initIpc();
    this.initServer();
  }

  /** 初始化ipc通信 */
  initIpc() {
    ipcMain.on('cmd', (e, { cmd, value }) => {
      if (value) {
        this.cmd(cmd, ...value);
      } else {
        this.cmd(cmd);
      }
    });
    ipcMain.on('connect', (e) => {
      e.sender.send('init', this.getInitData());
    });
  }

  /** 初始化ws通信 */
  initServer() {
    this.server.on('cmd', ({ cmd, value }) => {
      if (value) {
        this.cmd(cmd, ...value);
      } else {
        this.cmd(cmd);
      }
    });
    this.server.on('connect', (ws) => {
      this.server.sendTo(ws, 'init', this.getInitData());
      this.server.sendTo(ws, 'version', process.env.npm_package_version);
    });
    if (config.server.sendMessage) {
      this.server.open();
    }
  }

  /** 广播发送 */
  send(channel: string, ...args: any[]) {
    /** ipc通道 */
    webContents.getAllWebContents().forEach((e) => {
      e.send(channel, ...args);
    });
    /** ws通道 */
    this.server.send(channel, ...args);
  }

  getInitData() {
    return {
      living: this.living.getInitData(),
      saving: this.saving.getInitData(),
      server: this.server.getInitData(),
    };
  }

  cmd<S extends CommandSet = FLCommandSet, K extends string = keyof S & string>(cmd: K, ...args: S[K]) {
    this.command.execute(cmd, ...args);
  }

  addCommand<S extends CommandSet = FLCommandSet, K extends string = keyof S & string>(cmd: K, func: (...args: S[K]) => void) {
    this.command.add(cmd, func);
  }

  addCommandFrom<S extends CommandSet = FLCommandSet>(obj: { [K in keyof S]?: (...args: S[K]) => void }) {
    this.command.addFromObj(obj);
  }
}
