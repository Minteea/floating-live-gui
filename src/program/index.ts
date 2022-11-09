import Living from './living';
import Saving from './saving';
import Server from './server/server';
import Command from './command/command';
import { CommandSet, FLCommandSet } from './command/CommandTypes';
import IpcLink from './link/ipcLink';
import { UniLink, UniSender } from './link/UniLink';
import commandParser from '../utils/commandParser';

const configPath = './config/config.json';
const config = require(configPath);

export default class Program {
  command = new Command();

  living = new Living(this, config);

  saving = new Saving(this, config);

  server = new Server(this, config);

  ipcLink = new IpcLink()

  constructor() {
    this.initLink();
    this.initServer();
  }

  /** 初始化连接 */
  initLink() {
    let links: UniLink[] = [this.ipcLink, this.server]
    links.forEach((link) => {
      link.on('cmd', (e, {cmd, args}) => {
        this.command.execute({cmd, args});
      })
      link.on('connect', (e) => {
        e.send('init', this.getInitData());
      })
    })
  }

  /** 初始化服务 */
  initServer() {
    this.server.on('connect', (e) => {
      e.send('version', process.env.npm_package_version);
    })
    if (config.server.sendMessage) {
      this.server.open();
    }
  }

  /** 广播发送 */
  send(channel: string, ...args: any[]) {
    /** ipc通道 */
    this.ipcLink.send(channel, ...args)
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
    this.command.execute({cmd, args});
  }

  exec(str: string) {
    try {
      let [cmd, ...args] = commandParser(str)
      this.cmd(cmd, ...args)
    } catch(err) {
      console.log(`指令错误: ${str}`)
    }
  }

  addCommand<S extends CommandSet = FLCommandSet, K extends string = keyof S & string>(cmd: K, func: (...args: S[K]) => void) {
    this.command.add(cmd, func);
  }

  addCommandFrom<S extends CommandSet = FLCommandSet>(obj: { [K in keyof S]?: (...args: S[K]) => void }) {
    this.command.addFromObj(obj);
  }
}
