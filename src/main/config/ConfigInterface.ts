export interface ConfigInterface {
  /** 直播设置 */
  room: {
    list: { platform: string; id: string | number }[];
  };
  /** 服务设置 */
  server: {
    open: boolean;
    port: number;
  };
  save: {
    path: string;
    message: boolean;
    raw: boolean;
  };
  [key: string]: any;
}
