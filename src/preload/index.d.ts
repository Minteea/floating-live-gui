declare global {
  interface Window {
    nodeProcess: {
      versions: NodeJS.ProcessVersions;
      env: NodeJS.ProcessEnv;
      platform: NodeJS.Platform;
    };
    appVersions: {
      gui: string;
      floating: string;
    };
    ipcRenderer: {
      invoke(channel: "command", ...args: any[]): Promise<[boolean, any]>;
      invoke(channel: "connect"): Promise<[boolean]>;
      // invoke(channel: string, ...args: any[]): Promise<any>;
      on(channel: string, func: (e: any, ...args: any[]) => void): (() => void) | undefined;
      // once(channel: string, func: (e: any, ...args: any[]) => void): void;
    };
    appMode: {
      dev: boolean;
    };
  }
}

export {};
