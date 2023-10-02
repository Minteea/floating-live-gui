import { Config } from "../../main/config/config";
import path from "path";
import { appDataPath } from "../../main/appConfig";

export const authConfig = new Config<Record<string, { encryptedAuth: string }>>(
  path.resolve(appDataPath, "./config/auth.json"),
  {}
);
