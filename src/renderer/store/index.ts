import { atom, batched, computed } from "nanostores";
import { LiveRoomData } from "floating-live";
import { $rooms, controller } from "../controller";
import { persistentAtom } from "@nanostores/persistent";

function storageAtom<T>(name: string, initial: T) {
  return persistentAtom<T>(name, initial, {
    encode: JSON.stringify,
    decode: JSON.parse,
  });
}

export const $commandInput = atom("");
export const $commandShow = atom(true);

export const $searchPlatform = atom("");
export const $searchId = atom("");
export const $searchResult = atom<LiveRoomData | Error | null>(null);
export const $searchInfo = computed(
  [$rooms, $searchResult],
  (rooms, searchResult) => {
    if (searchResult instanceof Error) return null;
    const roomInList = rooms
      .find((r) => r.get().key == searchResult?.key)
      ?.get();
    return roomInList
      ? { ...roomInList, added: true }
      : searchResult
      ? { ...searchResult, added: false }
      : null;
  }
);

export const $authSave = atom(true);

export const $boardShow = storageAtom("config.boardShow", true);
export const $boardAutoShow = storageAtom("config.boardAutoShow", false);

export const $roomsListOpened = storageAtom("config.roomsListOpened", false);

// 自动显示消息板初始化设置
if ($boardAutoShow.get()) {
  $boardShow.set(!!$rooms.get().find((r) => r.get().opened));
}

controller.on("room:open", () => {
  $boardAutoShow.get() && $boardShow.set(true);
});
