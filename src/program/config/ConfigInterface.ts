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
    save_message: boolean;
    save_origin: boolean;
  };
  [key: string]: any
}