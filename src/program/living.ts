import FloatingLiving from 'floating-living';
import { MessageType, MessageImage } from 'floating-living/src/Message/MessageInterface';
import Program from '.'

export default class Living extends FloatingLiving {
  started = false; // 表示是否已开始记录

  timestamp = 0;

  program: Program;

  processPipe: Array<(data: MessageType) => void> = []

  constructor(program: Program, config: any) {
    const { rooms } = config.living;
    super({ rooms });
    this.program = program;
    this.initEvent();
    this.initCommamd();
    this.on('msg', (data: MessageType) => {
      // 加工
      this.process(data)
      this.program.send('msg', data);
    });
  }

  private process(data: MessageType) {
    this.processPipe.forEach((func) => {
      func(data)
    })
  }
  storeImage(data: MessageImage) {
    if (data.info.image.url) {
      // this.program.server.imageStorage.emotion.store(data.platform, data.info.image.id || "noname", data.info.image.url || "", "png")
    }
  }
  openAll() {
    this.start();
    this.liveRoomController.openAll();
  }

  start() {
    if (this.started) return;
    this.started = true;
    this.timestamp = new Date().valueOf();
    this.emit('start', { timestamp: this.timestamp });
    this.program.send('living', {
      key: 'start',
      value: { timestamp: this.timestamp },
    });
  }

  end() {
    if (!this.started) return;
    this.liveRoomController.closeAll();
    this.started = false;
    this.emit('end', { timestamp: this.timestamp });
    this.program.send('living', {
      key: 'end',
      value: { timestamp: this.timestamp },
    });
  }

  getInitData() {
    return {
      rooms: this.liveRoomController.roomList.map((r) => [
        r,
        this.getRoomInfo(r),
      ]),
      started: this.started,
      timestamp: this.timestamp,
    };
  }

  searchRoom(r: string | { platform: string; id: string | number }) {
    const liveRoom = this.liveRoomController.liveRoomGenerator.generate(
      r,
      false
    );
    if (!liveRoom) {
      this.program.send('search', { key: 'updateRoomInfo', value: null });
      return;
    }
    liveRoom.room.on('update', (roomInfo) => {
      this.program.send('search', { key: 'updateRoomInfo', value: roomInfo });
    });
  }

  async updateRoomInfo(roomKey: string) {
    const roomInfo = await super.updateRoomInfo(roomKey);
    this.program.send('living', {
      key: 'updateRoomInfo',
      value: { key: roomKey, room: roomInfo },
    });
  }

  private initEvent() {
    this.on('room', ({ status, roomKey, roomInfo }) => {
      switch (status) {
        case 'added':
          this.program.send('living', {
            key: 'addRoom',
            value: {
              key: roomKey,
              room: this.liveRoomController.getRoom(roomKey)?.roomInfo,
            },
          });
          break;
        case 'removed':
          this.program.send('living', {
            key: 'removeRoom',
            value: { key: roomKey },
          });
          break;
        case 'update':
          this.program.send('living', {
            key: 'updateRoomInfo',
            value: { key: roomKey, room: roomInfo },
          });
          break;
        case 'open':
          this.program.send('living', {
            key: 'openRoom',
            value: { key: roomKey },
          });
          if (!this.started) this.start();
          break;
        case 'close':
          this.program.send('living', {
            key: 'closeRoom',
            value: { key: roomKey },
          });
          break;
      }
    });
  }

  private initCommamd() {
    this.program.addCommandFrom({
      addRoom: (
        r: string | { platform: string; id: string | number },
        open: boolean | undefined
      ) => {
        this.addRoom(r, open);
      },
      removeRoom: (r: string) => {
        this.removeRoom(r);
      },
      openRoom: (r: string) => {
        this.openRoom(r);
      },
      closeRoom: (r: string) => {
        this.closeRoom(r);
      },
      updateRoomInfo: (r: string) => {
        this.updateRoomInfo(r);
      },
      searchRoom: (r: any) => {
        this.searchRoom(r);
      },
      start: () => {
        this.start();
      },
      end: () => {
        this.end();
      },
      openAll: () => {
        this.openAll();
      },
    });
  }
}
