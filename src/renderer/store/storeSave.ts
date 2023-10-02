import { atom } from "jotai";

export interface IStateSave {
  message: boolean;
  raw: boolean;
  path: string;
}

export const storeSave = {
  message: atom(false),
  raw: atom(false),
  path: atom(""),
};
