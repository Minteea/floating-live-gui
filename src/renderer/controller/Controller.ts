import api from "./api";
import version from "./version";
import commandParser from "../../utils/commandParser";
import { getAtom, setAtom, store } from "../store";
import ControllerLive from "./Live";
import ControllerLink from "./Link";

export default class Controller {
  listenerMap: Map<string, Array<(...args: any) => void>> = new Map();

  live = new ControllerLive();
  link = new ControllerLink();

  constructor() {
    this.initState();
    api.send("connect");
    api.on("version", (e: any, appVersion: string) => {
      if (version.client != "electron") version.app = appVersion;
    });
  }

  cmd(cmd: string, ...args: any[]) {
    return api.send("command", cmd, ...args);
  }

  exec(str: string) {
    try {
      let [cmd, ...args] = commandParser(str);
      this.cmd(cmd, ...args);
    } catch (err) {
      console.log(`指令错误: ${str}`);
    }
  }

  initState() {
    api.on("state", (state: Record<string, Record<string, any>>) => {
      console.log(state);
      for (let kg in state) {
        let group = (store as Record<string, any>)[kg];
        if (group) {
          for (let ki in state[kg]) {
            setAtom(group[ki], state[kg][ki]);
          }
        }
      }
    });

    api.on("state:set", (name: string, value: any) => {
      const [kg, ki] = name.split(".");
      try {
        const item = (store as any)[kg][ki];
        if (!item) return;
        setAtom(item, value);
      } catch (err) {
        console.log(`更新状态失败: ${name}`);
        console.error(err);
      }
    });

    api.on("state:array_push", (name: string, value: any) => {
      const [kg, ki] = name.split(".");
      try {
        const item = (store as any)[kg][ki];
        if (!item) return;
        const arr = [...(getAtom(item) as any[])];
        arr.push(value);
        setAtom(item, arr);
      } catch (err) {
        console.log(`更新状态失败: ${name}`);
        console.error(err);
      }
    });

    api.on("state:array_remove", (name: string, key: string, val: string) => {
      const [kg, ki] = name.split(".");
      try {
        const item = (store as any)[kg][ki];
        if (!item) return;
        const arr = [...(getAtom(item) as any[])];
        const index = arr.findIndex((item) => item[key] == val);
        arr.splice(index, 1);
        setAtom(item, arr);
      } catch (err) {
        console.log(`更新状态失败: ${name}`);
        console.error(err);
      }
    });
  }
}
