import { atom, batched, computed } from "nanostores";
import { RoomInfo } from "floating-live";
import { $rooms } from "../controller";

export const $commandInput = atom("");
export const $commandShow = atom(true);

export const $searchPlatform = atom("");
export const $searchId = atom("");
export const $searchResult = atom<RoomInfo | null>(null);

export const $authSave = atom(false);
