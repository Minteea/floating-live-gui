import IpcLink from "./link/ipcLink";
import { UniLink, UniSender } from "./types/UniLink";
import { FloatingLive, Reglist } from "floating-live";
import path from "path";

import bilibiliGetAvatar from "./plugins/bilibiliGetAvatar";
import bilibili from "floating-live/plugin/bilibili";
import acfun from "floating-live/plugin/acfun";
import server from "./plugins/server";
import save from "./plugins/save";
import search from "./plugins/search";
import consoleEvent from "floating-live/plugin/consoleEvent";
import Config from "./config/config";
import { ConfigInterface } from "./config/ConfigInterface";
import { defaultConfig } from "./config/defaultConfig";

export default class Program extends FloatingLive {
  /** 命令集 */
  public command: Reglist<(...args: any) => void>;
  /** 初始化函数 */
  public initState: Reglist<() => { [store: string]: { [key: string]: any } }>;
  /** 前端连接通道 */
  links: UniLink[];
  /** 应用数据存储路径 */
  readonly appDataPath: string;
  /** 环境 */
  readonly env: string;
  /** 配置 */
  public config: Config;
  constructor(conf: {
    /** 应用数据存储路径 */
    appDataPath: string;
  }) {
    super();
    this.command = new Reglist(this, "command");
    this.initState = new Reglist(this, "initState");
    this.config = new Config(
      path.resolve(conf.appDataPath, "./config/config.json"),
      defaultConfig
    );
    this.links = [new IpcLink()];
    this.appDataPath = conf.appDataPath;
    this.env = process.env.NODE_ENV || "development";
    this.initPlugin();
    this.initCommand();
    this.initEvent();
    this.initLive();
    this.initInit();
    this.links.forEach((link) => {
      link.on("cmd", (e, { cmd, args }) => {
        console.log(`cmd: ${[cmd, ...args].join(" ")}`);
        this.cmd(cmd, ...args);
      });
      link.on("connect", (e) => {
        // 连接后发送当前数据
        const initData: { [module: string]: { [key: string]: any } } = {};
        this.initState.getList().forEach((func) => {
          let data = func();
          for (let module in data) {
            // 合并初始化数据
            initData[module] = Object.assign(
              initData[module] || {},
              data[module]
            );
          }
        });
        e.send("init", initData);
        e.send(
          "room_list",
          this.room.keyList.map((key) => [key, this.room.info(key)])
        );
      });
    });
  }
  /** 重写事件触发: 事件触发时, 同时发送给前端 */
  public emit(eventName: string | symbol, ...args: any[]) {
    if (typeof eventName == "string") this.send(eventName, ...args);
    return super.emit(eventName, ...args);
  }
  /** 广播发送 */
  public send(channel: string, ...args: any[]) {
    this.links.forEach((link) => {
      link.send(channel, ...args);
    });
  }
  /** 执行指令 */
  public cmd(cmd: string, ...args: any) {
    let func = this.command.get(cmd);
    if (func) {
      func(...args);
    }
  }
  /** 初始化内置插件 */
  private initPlugin() {
    this.plugin.register("consoleEvent", consoleEvent);
    // 房间插件
    this.plugin.register("bilibili", bilibili);
    this.plugin.register("acfun", acfun);
    // 消息优化插件
    this.plugin.register("bilibili-get-avatar", bilibiliGetAvatar);
    // 工具插件
    this.plugin.register("save", save);
    this.plugin.register("server", server);
    this.plugin.register("search", search);
  }
  /** 初始化命令 */
  private initCommand() {
    this.command.register(
      "addRoom",
      (
        r: string | { platform: string; id: string | number },
        open: boolean = false
      ) => {
        // 获取平台及id
        let platform: string;
        let id: string | number;
        if (typeof r == "string") {
          let split = r.split(":");
          platform = split[0].toLowerCase();
          id = split[1];
        } else {
          platform = r.platform.toLowerCase();
          id = r.id;
        }
        this.addRoom({ platform, id }, open);
      }
    );
    this.command.register("removeRoom", (key: string) => {
      this.removeRoom(key);
    });
    this.command.register("openRoom", (key: string) => {
      this.openRoom(key);
    });
    this.command.register("closeRoom", (key: string) => {
      this.closeRoom(key);
    });
    this.command.register("updateRoom", (key: string) => {
      this.updateRoomInfo(key);
    });
    this.command.register("openAll", () => {
      this.openAllRooms();
    });
    this.command.register("closeAll", () => {
      this.closeAllRooms();
    });
    this.command.register("start", () => {
      this.start();
    });
    this.command.register("end", () => {
      this.end();
    });
  }
  private initLive() {
    this.config
      .get("live.rooms")
      .forEach((item: { platform: string; id: string | number }) => {
        this.addRoom({ platform: item.platform, id: item.id });
      });
  }
  private initEvent() {
    this.on("room_add", (key, room) => {
      this.config.access("live.rooms", (list) => {
        if((list.value() as any[]).find(({platform, id}) => `${platform}:${id}` == key)) return
        list.value().push({ platform: room.platform, id: room.id });
      });
    });
    this.on("room_remove", (key) => {
      this.config.access("live.rooms", (list: any) => {
        list.remove((item: { platform: string; id: number | string; }) => `${item.platform}:${item.id}` == key).value();
      });
    });
  }
  private initInit() {
    this.initState.register("live", () => {
      return {
        live: {
          started: this.started,
          timestamp: this.timestamp,
        },
      };
    });
  }
}
