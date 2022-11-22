import StoreLive from './modules/Live';
import StoreSearch from './modules/Search';
import StoreSaving from './modules/Save';
import StoreServer from './modules/Server';
import StoreFavor from './modules/Favor';
import StoreMessage from './modules/Message';
import StoreLink from './modules/Link';
import StoreCommon from './modules/Common';

class Store {
  live = new StoreLive();

  search = new StoreSearch();

  favor = new StoreFavor();

  server = new StoreServer();

  link = new StoreLink();

  save = new StoreSaving();

  message = new StoreMessage();

  common = new StoreCommon();
}

export default new Store();
