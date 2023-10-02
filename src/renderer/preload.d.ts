declare global {
  interface Window {
    process: {
      versions: NodeJS.ProcessVersions;
      env: NodeJS.ProcessEnv;
      platform: NodeJS.Platform;
    };
    ipcRenderer: {
      invoke(channel: string, ...args: any[]): Promise<any>;
      on(
        channel: string,
        func: (e: any, ...args: any[]) => void
      ): (() => void) | undefined;
      once(channel: string, func: (e: any, ...args: any[]) => void): void;
    };
  }
}

export {};
