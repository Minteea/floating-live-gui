export interface ConfigInterface {
  /** 直播设置 */
  live: {
    rooms: { platform: string; id: string | number }[];
  };
  /** 服务设置 */
  server: {
    open: boolean;
    port: number;
  };
  save: {
    path: string;
    saveMessage: boolean;
    saveOrigin: boolean;
  };
  [key: string]: any
}
