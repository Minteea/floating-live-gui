const FloatingLiving = require("floating-living")

class Living extends FloatingLiving {
  started = false // 表示是否已开始记录
  timestamp = 0
  // addRoom(room, open)
  // removeRoom(room)
  // openRoom(room)
  // closeRoom(room)
  // getRoomInfo(room)
  // updateRoomInfo(room)
  constructor(service, config) {
    let rooms = config.living.rooms
    super({rooms})
    this.service = service
    this.command = this.service.command
    this._initEvent()
    this._initCommamd()
    this.on("msg", (data) => {
      this.service.send("msg", data)
    })
  }
  openAll() {
    this.start()
    this.liveRoomController.openAll()
  }
  start() {
    if (this.started) return
    this.started = true
    this.timestamp = (new Date()).valueOf()
    this.emit("start", { timestamp: this.timestamp })
    this.service.send("living", {key: "start", value: { timestamp: this.timestamp }})
  }
  end() {
    if (!this.started) return
    this.liveRoomController.closeAll()
    this.started = false
    this.emit("end", { timestamp: this.timestamp })
    this.service.send("living", {key: "end", value: { timestamp: this.timestamp }})
  }
  getInitData() {
    return {
      rooms: this.liveRoomController.roomList.map((r) => (
        [r, this.getRoomInfo(r)]
      )),
      started: this.started,
      timestamp: this.timestamp,
    }
  }

  searchRoom(r) {
    let liveRoom = this.liveRoomController.liveRoomGenerator.generate(r, false)
    if (!liveRoom) {
      this.service.send("search", {key: "updateRoomInfo", value: null})
      return
    }
    liveRoom.room.on("update", (roomInfo) => {
      this.service.send("search", {key: "updateRoomInfo", value: roomInfo})
    })
  }
  async updateRoomInfo(roomKey) {
    let roomInfo = await super.updateRoomInfo(roomKey)
    this.service.send("living", {key: "updateRoomInfo", value: {key: roomKey, room: roomInfo}})
  }
  _initEvent() {
    this.on("room", ({status, roomKey, roomInfo}) => {
      switch (status) {
        case "added":
          this.service.send("living", {key: "addRoom", value: {key: roomKey, room: this.liveRoomController.getRoom(roomKey).roomInfo}})
          break;
        case "removed":
          this.service.send("living", {key: "removeRoom", value: {key: roomKey}})
          break;
        case "update":
          this.service.send("living", {key: "updateRoomInfo", value: {key: roomKey, room: roomInfo}})
          break;
        case "open":
          this.service.send("living", {key: "openRoom", value: {key: roomKey}})
          if (!this.started) this.start()
          break;
        case "close":
          this.service.send("living", {key: "closeRoom", value: {key: roomKey}})
          break;
      }
    })
  }
  _initCommamd() {
    this.command.addFromObj({
      addRoom: (r, open) => {
        this.addRoom(r, open)
      },
      removeRoom: (r) => {
        this.removeRoom(r)
      },
      openRoom: (r) => {
        this.openRoom(r)
      },
      closeRoom: (r) => {
        this.closeRoom(r)
      },
      updateRoomInfo: (r) => {
        this.updateRoomInfo(r)
      },
      searchRoom: (r) => {
        this.searchRoom(r)
      },
      start: () => {
        this.start()
      },
      end: () => {
        this.end()
      },
      openAll: () => {
        this.openAll()
      }
    })
  }
}

module.exports = Living