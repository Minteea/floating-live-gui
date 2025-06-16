declare global {
  interface Window {
    process: {
      versions: NodeJS.ProcessVersions;
      env: NodeJS.ProcessEnv;
      platform: NodeJS.Platform;
    };
    version: {
      gui: string;
      floating: string;
    };
    ipcRenderer: {
      invoke(channel: "command", ...args: any[]): Promise<[boolean, any]>;
      invoke(channel: "connect"): Promise<[boolean]>;
      // invoke(channel: string, ...args: any[]): Promise<any>;
      on(
        channel: string,
        func: (e: any, ...args: any[]) => void
      ): (() => void) | undefined;
      // once(channel: string, func: (e: any, ...args: any[]) => void): void;
    };
  }
}

export {};
