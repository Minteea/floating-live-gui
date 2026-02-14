export interface SendChannelMap {
  connect: { snapshot: string[] };
}

export interface PermissionInfo {
  control: boolean;
}

export interface ReplyChannelMap {}

export interface InvokeChannelMap {
  command: (commandName: string, ...args: any[]) => any;
}
