declare global {
  interface Window {
    nodeProcess: {
      versions: NodeJS.ProcessVersions;
      env: NodeJS.ProcessEnv;
      platform: NodeJS.Platform;
    };
    electron: {
      ipcRenderer: {
        send(channel: string, ...args: any[]): void;
        on(
          channel: string,
          func: (e: any, ...args: any[]) => void
        ): (() => void) | undefined;
        once(channel: string, func: (e: any, ...args: any[]) => void): void;
      };
    };
  }
}

export {};
