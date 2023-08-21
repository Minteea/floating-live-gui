import { proxy } from "valtio";

export interface IStateSave {
  saveMessage: boolean;
  saveRaw: boolean;
  path: string;
}

export const storeSave: IStateSave = proxy({
  saveMessage: false,
  saveRaw: false,
  path: "",
});
