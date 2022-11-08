import StoreLiving from './modules/Living';
import StoreSearch from './modules/Search';
import StoreSaving from './modules/Saving';
import StoreServer from './modules/Server';
import StoreFavor from './modules/Favor';
import StoreMessage from './modules/Message';
import StoreLink from './modules/Link';
import StoreCommon from './modules/Common';

class Store {
  living = new StoreLiving();

  search = new StoreSearch();

  favor = new StoreFavor();

  server = new StoreServer();

  link = new StoreLink();

  saving = new StoreSaving();

  message = new StoreMessage();

  common = new StoreCommon();
}

export default new Store();
