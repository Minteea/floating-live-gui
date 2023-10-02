import { atom } from "jotai";
import { AuthOptions } from "floating-live/src/types";

export const storeAuth = {
  options: atom<Record<string, AuthOptions>>({}),
  status: atom<Record<string, string | number>>({}),
  save: atom(false),
};
