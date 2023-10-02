import { ConfigInterface } from "./ConfigInterface";

export const defaultConfig: ConfigInterface = {
  room: {
    list: [],
  },
  server: {
    open: true,
    port: 8130,
  },
  save: {
    path: "../save",
    message: true,
    raw: false,
  },
};
