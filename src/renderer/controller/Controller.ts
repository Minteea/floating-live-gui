import ControllerLiving from './Live';
import ControllerSearch from './Search';
import ControllerServer from './Server';
import api from './api';
import ControllerLink from './Link';
import version from './version';
import { CommandSet, FLCommandSet } from '../../program/command/CommandTypes';
import commandParser from '../../utils/commandParser';
import store from '../store';
import ControllerSave from './Saving';

export default class Controller {
  listenerMap: Map<string, Array<(...args: any) => void>> = new Map();

  save = new ControllerSave(this)

  server = new ControllerServer(this);

  live = new ControllerLiving(this);

  search = new ControllerSearch(this);

  link = new ControllerLink(this);

  constructor() {
    api.send('connect');
    api.on('init', (e: any, initData: {[module: string]: {[key: string]: any}}) => {
      this.updateStore(initData)
    });
    api.on('version', (e: any, appVersion: string) => {
      if (version.client != 'electron') version.app = appVersion;
    });
  }

  cmd<S extends CommandSet = FLCommandSet, K extends string = keyof S & string>(cmd: K, ...args: S[K]) {
    api.send('cmd', { cmd, args });
  }

  exec(str: string) {
    try {
      let [cmd, ...args] = commandParser(str)
      this.cmd(cmd, ...args)
    } catch(err) {
      console.log(`指令错误: ${str}`)
    }
  }

  updateStore(data: {[module: string]: {[key: string]: any}}) {
    for (let moduleName in data) {
      let storeModule = (store as unknown as {[module: string]: {[key: string]: any}})[moduleName]
      if (storeModule) {
        for (let key in data[moduleName]) {
          storeModule[key] = data[moduleName][key]
        }
      }
    }
  }

}
