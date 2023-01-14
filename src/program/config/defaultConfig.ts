import { ConfigInterface } from "./ConfigInterface";

export const defaultConfig: ConfigInterface = {
  live: {
    rooms: [],
  },
  server: {
    open: true,
    port: 8130,
  },
  save: {
    path: "../save",
    save_message: true,
    save_origin: false,
  }
};