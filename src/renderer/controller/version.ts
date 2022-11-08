import React from 'react';
import getBrowserInfo from '../utils/browserInfo';

const { nodeProcess } = window;
const { userAgent } = navigator;
const browserInfo = !nodeProcess ? getBrowserInfo(userAgent) : null;

const version: {
  // 通用属性
  client: 'electron' | 'browser'; // 客户端类型
  react: string; // react版本
  app: string; // 应用版本
  // electron应用端属性
  electron?: string; // electron版本
  node?: string; // node版本
  chrome?: string; // Chrome版本
  platform?: string; // 操作系统
  env?: string; // 运行环境
  // 浏览器端属性
  browser?: [string, string, string]; // 浏览器版本
} = {
  client: nodeProcess ? 'electron' : 'browser',
  react: React.version,
  app: nodeProcess?.env.npm_package_version || '',
  electron: nodeProcess?.versions.electron || undefined,
  node: nodeProcess?.versions.node || undefined,
  chrome: nodeProcess?.versions.chrome || undefined,
  platform: nodeProcess?.platform || undefined,
  env: undefined,
  browser: browserInfo
    ? [browserInfo?.name, browserInfo?.version, browserInfo?.deviceOS]
    : undefined,
};
export default version;
