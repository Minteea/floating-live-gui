import ControllerLiving from './Living';
import ControllerSaving from './Saving';
import ControllerSearch from './Search';
import ControllerServer from './Server';
import api from './api';
import ControllerLink from './Link';
import version from './version';

function objectForEach(
  obj: { [k: string]: any },
  func: (key: string, value?: any) => any
) {
  for (const k in obj) {
    func(k, obj[k]);
  }
}

export default class Controller {
  listenerMap: Map<string, Array<(...args: any) => void>> = new Map();

  saving = new ControllerSaving(this);

  server = new ControllerServer(this);

  living = new ControllerLiving(this);

  search = new ControllerSearch(this);

  link = new ControllerLink(this);

  constructor() {
    api.send('connect');
    api.on(
      'init',
      (
        e: any,
        initData: {
          living: { [k: string]: any };
          saving: { [k: string]: any };
          server: { [k: string]: any };
        }
      ) => {
        console.log(initData);
        objectForEach(initData.living, (key, value) => {
          this.living.updateStore({ key, value });
        });
        objectForEach(initData.server, (key, value) => {
          this.server.updateStore({ key, value });
        });
        objectForEach(initData.saving, (key, value) => {
          this.saving.updateStore({ key, value });
        });
      }
    );
    api.on('version', (e: any, appVersion: string) => {
      if (version.client != 'electron') version.app = appVersion;
    });
  }

  cmd(cmd: string, ...args: any) {
    api.send('cmd', { cmd, value: [...args] });
  }
}
