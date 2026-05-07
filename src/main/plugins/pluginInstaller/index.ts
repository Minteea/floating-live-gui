import {
  AppPluginExposesMap,
  BasePlugin,
  FloatingLive,
  PluginConstructor,
  PluginContext,
  PluginItem,
} from "floating-live";
import path from "node:path";
import { promises as fs } from "node:fs";
import { tmpdir } from "node:os";
import { PluginInfo } from "../pluginLoader";
import { zip } from "compressing"
import { getCountId, getDateId, getRandomId } from "./utils";


declare module "floating-live" {
  interface AppCommandMap {
    "pluginInstaller.install": (pluginPath: string, open?: boolean) => Promise<void>;
    "pluginInstaller.uninstall": (pluginName: string) => Promise<void>;
  }
  interface AppEventDetailMap {
    "pluginInstaller:install": { pluginName: string, path: string };
    "pluginInstaller:uninstall": { pluginName: string };
  }
}

/** 插件包安装器
 * 
 * @description
 * **框架插件**，通过安装器将插件包文件夹或压缩包安装到指定目录，并由插件加载器加载启用
 */
export default class PluginInstaller extends BasePlugin {
  static pluginName = "pluginInstaller";

  async init(ctx: PluginContext) {

    // 注册命令处理
    ctx.registerCommand("pluginInstaller.install", async (commandContext, pluginPath: string, open?: boolean) => {
      return await this.installPlugin(pluginPath, open ?? false);
    });

    ctx.registerCommand("pluginInstaller.uninstall", async (commandContext, pluginName: string) => {
      return await this.uninstall(pluginName);
    });
  }

  async installPlugin(pluginPath: string, open = false) {
    if (!this.ctx.hasPlugin("pluginLoader")) {
      throw new Error("插件加载器未初始化");
    }

    const stat = await fs.stat(pluginPath);
    let pluginInfo: PluginInfo;
    // 插件包来源目录
    let sourceDir = "";
    // 插件包临时解压目录
    let tempDir = "";

    // 解析插件包，获取插件信息
    if (stat.isDirectory()) {
      // 插件为文件夹，且包含plugin.json（输入文件夹或plugin.json文件路径）

      // 读取plugin.json，获取插件信息
      const pluginJsonPath = path.join(pluginPath, "plugin.json");
      const pluginJsonContent = await fs.readFile(pluginJsonPath, "utf-8");
      pluginInfo = JSON.parse(pluginJsonContent);
      sourceDir = pluginPath;

    } else if (pluginPath.endsWith("plugin.json")) {
      // 如果输入是plugin.json文件，获取其所在目录

      const pluginJsonContent = await fs.readFile(pluginPath, "utf-8");
      pluginInfo = JSON.parse(pluginJsonContent);
      sourceDir = path.dirname(pluginPath);

    } else if (pluginPath.endsWith(".zip")) {
      // 插件为zip文件，解压后包含plugin.json

      try {

        // 创建临时目录用于解压插件包
        tempDir = path.join(tmpdir(), `floating-live-plugin-${getDateId()}-${getRandomId()}-${getCountId()}`);
        await fs.mkdir(tempDir, { recursive: true });

        // 解压zip文件到临时目录
        await zip.uncompress(pluginPath, tempDir);

        // 读取plugin.json，获取插件信息
        const pluginJsonPath = path.join(tempDir, "plugin.json");
        const pluginJsonContent = await fs.readFile(pluginJsonPath, "utf-8");
        pluginInfo = JSON.parse(pluginJsonContent);
        sourceDir = tempDir;
      } catch (err) {
        if (tempDir) {
          // await fs.rm(tempDir, { recursive: true, force: true });
          console.log(tempDir)
        }
        throw new Error(`处理zip文件失败: ${err}`);
      }
    } else {
      throw new Error(`不支持的插件包格式: ${pluginPath}`);
    }

    const pluginName = pluginInfo.name;
    if (!pluginName) {
      throw new Error("plugin.json缺少name字段");
    }

    // 将解压后的插件文件夹复制到指定目录（位于pluginLoader指定的basePath下，插件包文件夹名称与plugin.json中的name字段一致）





    const basePath = this.ctx.getValue("pluginLoader.basePath");
    if (!basePath) {
      throw new Error("无法获取插件加载器的基础路径");
    }

    // 将插件复制到目标目录
    const targetDir = path.join(basePath, pluginName);
    if (await fs.access(targetDir).catch(() => false)) {
      throw new Error(`目标目录${targetDir}已存在，无法安装插件${pluginName}`);
    }
    await fs.mkdir(targetDir, { recursive: true });

    // 复制所有文件
    await copyDir(sourceDir, targetDir);

    try {
      // 将插件路径注册到插件加载器。如果安装时指定启用插件，则由插件加载器启用
      this.ctx.call("pluginLoader.register", { path: `./${pluginName}`, open });
    } catch (err) {
      // 如果注册失败，清理已复制的文件
      await fs.rm(targetDir, { recursive: true, force: true });
      throw err;
    } finally {
      // 清理临时目录
      if (tempDir) {
        await fs.rm(tempDir, { recursive: true, force: true });
      }
    }
  }

  async uninstall(pluginName: string) {

    if (!this.ctx.hasPlugin("pluginLoader")) {
      throw new Error("插件加载器未初始化");
    }

    // 卸载插件信息
    try {
      await this.ctx.call("pluginLoader.unregister", pluginName);
    } catch (err) {
      throw new Error(`无法从插件加载器中卸载插件${pluginName}: ${err}`);
    }

    // 删除插件文件夹
    const basePath = this.ctx.getValue("pluginLoader.basePath");
    if (!basePath) {
      throw new Error("无法获取插件加载器的基础路径");
    }

    const targetDir = path.join(basePath, pluginName);
    try {
      await fs.rm(targetDir, { recursive: true, force: true });
    } catch (err) {
      throw new Error(`无法删除插件文件夹: ${err}`);
    }
  }
}

/**
 * 递归复制目录
 */
async function copyDir(src: string, dest: string): Promise<void> {
  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await fs.mkdir(destPath, { recursive: true });
      await copyDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}
