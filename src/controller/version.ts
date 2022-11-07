import React from "react"
import getBrowserInfo from "../utils/browserInfo";

//@ts-ignore
const electronVersions = window.versions
const userAgent = navigator.userAgent
const browserInfo = !electronVersions ? getBrowserInfo(userAgent) : null

const version: {
  // 通用属性
  client: "electron" | "browser"; // 客户端类型
  react: string;      // react版本
  app: string;        // 应用版本
  // electron应用端属性
  electron?: string;  // electron版本
  node?: string;      // node版本
  chrome?: string;    // Chrome版本
  platform?: [string, string];  // 操作系统
  env?: string        // 运行环境
  // 浏览器端属性
  browser?: [string, string, string]; // 浏览器版本
} = {
  client: electronVersions ? "electron" : "browser",
  react: React.version,
  app: electronVersions?.app() || "",
  electron: electronVersions?.electron() || undefined,
  node: electronVersions?.node() || undefined,
  chrome: electronVersions?.chrome() || undefined,
  platform: electronVersions?.platform() || undefined,
  env: electronVersions?.env() || undefined,
  browser: browserInfo ? [browserInfo?.name, browserInfo?.version, browserInfo?.deviceOS] : undefined,
}
export default version