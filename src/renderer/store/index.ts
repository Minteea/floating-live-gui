import { storeRoom } from './storeRoom';
import { storeMessage } from './storeMessage';
import { storeSearch } from "./storeSearch";
import { storeServer } from "./storeServer";
import { storeSave } from "./storeSave";
import { storeLink } from "./storeLink";
import { storeCommand } from "./storeCommand";

const store = {
  search: storeSearch,

  server: storeServer,

  link: storeLink,

  save: storeSave,

  command: storeCommand,

  message: storeMessage,

  room: storeRoom,
};

export default store;
