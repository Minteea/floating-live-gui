import { msgSave } from 'floating-living/tools';
import Program from '.';

export default class Saving {
  path: string = './save';

  pluginSaveMessage: msgSave;

  pluginSaveOrigin: msgSave;

  program: Program;

  living: Program['living'];

  fileId: string = '';

  constructor(program: Program, config: any) {
    this.path = config.saving.path || this.path;
    this.program = program;
    this.living = this.program.living;
    this.initCommamd();
    this.updateFileId();
    this.pluginSaveMessage = this.living.addPlugin(
      'saveMessage',
      (main) => new msgSave(main, 'msg', `${this.path}/${this.fileId}.txt`)
    );
    this.pluginSaveOrigin = this.living.addPlugin(
      'saveOrigin',
      (main) =>
        new msgSave(main, 'origin', `${this.path}/${this.fileId}-origin.txt`)
    );
    this.living.on('start', () => {
      // 直播监听重新开启时，文件名将更新
      this.updateFileId();
      this.updateFilePath();
    });
  }

  saveMessage(b: boolean) {
    this.pluginSaveMessage.paused = !b;
    this.program.send('saving', {
      key: 'saveMessage',
      value: !this.pluginSaveMessage.paused,
    });
  }

  saveOrigin(b: boolean) {
    this.pluginSaveOrigin.paused = !b;
    this.program.send('saving', {
      key: 'saveOrigin',
      value: !this.pluginSaveOrigin.paused,
    });
  }

  savePath(path: string) {
    this.path = path;
    if (path) {
      this.updateFilePath();
      this.program.send('saving', { key: 'savePath', value: this.path });
    }
  }

  private updateFileId() {
    const startDate = new Date(this.living.timestamp);
    this.fileId = `${startDate.getFullYear()}${(startDate.getMonth() + 1)
      .toString()
      .padStart(2, '0')}${startDate
      .getDate()
      .toString()
      .padStart(2, '0')}_${startDate
      .getHours()
      .toString()
      .padStart(2, '0')}${startDate
      .getMinutes()
      .toString()
      .padStart(2, '0')}${startDate
      .getSeconds()
      .toString()
      .padStart(2, '0')}-${this.living.liveRoomController.roomList[0]?.replace(
      ':',
      '-'
    )}`;
  }

  private updateFilePath() {
    this.pluginSaveMessage.changeFile(`${this.path}/${this.fileId}.txt`);
    this.pluginSaveOrigin.changeFile(`${this.path}/${this.fileId}-origin.txt`);
  }

  getInitData() {
    return {
      saveMessage: !this.pluginSaveMessage.paused,
      saveOrigin: !this.pluginSaveOrigin.paused,
      savePath: this.path,
    };
  }

  private initCommamd() {
    this.program.addCommandFrom({
      saveMessage: (b) => {
        this.saveMessage(b);
      },
      saveOrigin: (b) => {
        this.saveOrigin(b);
      },
      savePath: (path) => {
        this.savePath(path);
      },
    });
  }
}
