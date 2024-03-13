import { RoomInfo } from "floating-live";
import FloatingController from "../Controller";

export interface FloatingSnapshot {
  room: RoomInfo[];
  value: Record<string, any>;
  manifest: Record<string, Record<string, any>>;
  command: string[];
  hook: Record<string, any>;
}

/** 插件对象 */
export interface ControllerPluginItem {
  pluginName?: string;
  register?(main: FloatingController, options: any): void | Promise<void>;
  destroy?(): void | Promise<void>;
  [name: string]: any;
}
/** 插件构造器 */
export interface ControllerPluginConstructor<
  P extends ControllerPluginItem = ControllerPluginItem
> {
  pluginName: string;
  new (main: FloatingController, options: any): P;
}
