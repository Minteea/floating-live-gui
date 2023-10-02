import { Atom, getDefaultStore, WritableAtom } from "jotai/vanilla";
import { storeRoom } from "./storeRoom";
import { storeMessage } from "./storeMessage";
import { storeSearch } from "./storeSearch";
import { storeServer } from "./storeServer";
import { storeSave } from "./storeSave";
import { storeLink } from "./storeLink";
import { storeCommand } from "./storeCommand";
import { storeAuth } from "./storeAuth";

export const atomStore = getDefaultStore();

export function getAtom<T>(atom: Atom<T>) {
  return atomStore.get(atom);
}
export function setAtom<T>(
  atom: WritableAtom<unknown, [T], unknown>,
  value: T
) {
  return atomStore.set(atom, value);
}

export const store = {
  search: storeSearch,

  server: storeServer,

  link: storeLink,

  save: storeSave,

  command: storeCommand,

  message: storeMessage,

  room: storeRoom,

  auth: storeAuth,
};
