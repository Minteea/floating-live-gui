import { proxy } from "valtio";

export interface IStateCommand {
  /** 输入值 */
  input: string;
  /** 显示命令输入 */
  show: boolean;
}

export const storeCommand: IStateCommand = proxy({
  input: "",
  show: true,
});
