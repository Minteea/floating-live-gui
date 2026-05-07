import React from "react";
import getBrowserInfo from "../utils/browserInfo";
import { isElectron } from "@renderer/utils/environment";

const { nodeProcess } = window;
const { userAgent } = navigator;
const browserInfo = !nodeProcess ? getBrowserInfo(userAgent) : null;

const version: {
  // 通用属性

  /** 客户端类型 */
  client: "electron" | "browser";
  /** React版本 */
  react: string;

  // 服务应用端属性

  /** 应用版本 */
  app: string;

  /** floating-live 版本 */
  floating?: string;
  /** electron 版本 */
  electron?: string;
  /** node 版本 */
  node?: string;
  /** Chrome 版本 */
  chrome?: string;
  /** 操作系统 */
  platform?: string;

  // 浏览器端属性
  /** 浏览器版本 */
  browser?: [string, string, string];
} = {
  client: isElectron() ? "electron" : "browser",
  react: React.version,
  app: window.appVersions?.gui || "",
  floating: window.appVersions?.floating || "",
  electron: nodeProcess ? nodeProcess.versions.electron : undefined,

  node: nodeProcess?.versions.node || undefined,
  chrome: nodeProcess?.versions.chrome || undefined,
  platform: nodeProcess?.platform || undefined,
  browser: browserInfo
    ? [browserInfo?.name, browserInfo?.version, browserInfo?.deviceOS]
    : undefined,
};
export default version;
