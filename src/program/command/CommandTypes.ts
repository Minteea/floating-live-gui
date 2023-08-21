export type CommandSet = {
  [cmd: string]: any[];
};

export type CmdLive = {
  /** 添加房间 */
  addRoom: [string, boolean?];
  /** 移除房间 */
  removeRoom: [string];
  /** 打开房间 */
  openRoom: [string];
  /** 关闭房间 */
  closeRoom: [string];
  /** 打开所有房间 */
  openAll: [];
  /** 开始记录 */
  start: [];
  /** 结束记录 */
  end: [];
};

export type CmdSave = {
  /** 保存消息 */
  saveMessage: [boolean];
  /** 保存源消息 */
  saveRaw: [boolean];
  /** 保存路径 */
  savePath: [string];
};

export type CmdSearch = {
  /** 搜索房间 */
  searchRoom: [string | {platform: string, id: string | number}];
};

export type CmdServer = {
  /** 开启消息发送服务 */
  server: [boolean];
  /** 服务端口 */
  port: [number];
};

export type FLCommandSet = CmdLive & CmdSave & CmdSearch & CmdServer;

function t<S extends CommandSet = FLCommandSet, K extends string = keyof S & string>(cmd: K, ...args: S[K]) {
  return
}
