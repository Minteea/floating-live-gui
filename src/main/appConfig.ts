import { app } from "electron";

export const appDataPath = app.getPath("userData");
export const appEnv = process.env.NODE_ENV || "development";
