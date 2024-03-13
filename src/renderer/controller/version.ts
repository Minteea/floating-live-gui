import React from "react";
import getBrowserInfo from "../utils/browserInfo";

const { process } = window;
const { userAgent } = navigator;
const browserInfo = !process ? getBrowserInfo(userAgent) : null;

const version: {
  // 通用属性
  client: "electron" | "browser"; // 客户端类型
  react: string; // react版本
  // electron应用端属性
  app: string; // 应用版本
  floating?: string; // floating版本
  electron?: string; // electron版本
  node?: string; // node版本
  chrome?: string; // Chrome版本
  platform?: string; // 操作系统
  env?: string; // 运行环境
  // 浏览器端属性
  browser?: [string, string, string]; // 浏览器版本
} = {
  client: process ? "electron" : "browser",
  react: React.version,
  app: window.version?.gui || "",
  floating: window.version?.floating || "",
  electron: process?.versions.electron || undefined,
  node: process?.versions.node || undefined,
  chrome: process?.versions.chrome || undefined,
  platform: process?.platform || undefined,
  env: undefined,
  browser: browserInfo
    ? [browserInfo?.name, browserInfo?.version, browserInfo?.deviceOS]
    : undefined,
};
export default version;
