const { msgSave } = require("floating-living/tools")

class Saving {
  path = "./save"
  pluginSaveMessage = null
  pluginSaveOrigin = null
  constructor(service, config) {
    this.path = config.saving.path || this.path
    this.service = service
    this.command = this.service.command
    this.living = this.service.living
    this._initCommamd()
    this.fileId = ""
    this._updateFileId()
    this.pluginSaveMessage = this.living.addPlugin("saveMessage", (main) => (new msgSave(main, "msg", `${this.path}/${this.fileId}.txt`)))
    this.pluginSaveOrigin = this.living.addPlugin("saveOrigin", (main) => (new msgSave(main, "origin", `${this.path}/${this.fileId}-origin.txt`)))
    this.living.on("start", () => {  // 直播监听重新开启时，文件名将更新
      this._updateFileId()
      this._updateFilePath()
    })
  }
  saveMessage(b) {
    this.pluginSaveMessage.paused = !b
    this.service.send("saving", {key: "saveMessage", value: !this.pluginSaveMessage.paused})
  }
  saveOrigin(b) {
    this.pluginSaveOrigin.paused = !b
    this.service.send("saving", {key: "saveOrigin", value: !this.pluginSaveOrigin.paused})
  }
  savePath(path) {
    this.path = path
    if(path) {
      this._updateFilePath()
      this.service.send("saving", {key: "savePath", value: this.path})
    }
  }
  _updateFileId() {
    let startDate = new Date(this.living.timestamp)
    this.fileId = `${startDate.getFullYear()}${(startDate.getMonth() + 1).toString().padStart(2, '0')}${startDate.getDate().toString().padStart(2, '0')}_${startDate.getHours().toString().padStart(2, '0')}${startDate.getMinutes().toString().padStart(2, '0')}${startDate.getSeconds().toString().padStart(2, '0')}-${this.living.liveRoomController.roomList[0]?.replace(":", "-")}`
  }
  _updateFilePath() {
    this.pluginSaveMessage.changeFile(`${this.path}/${this.fileId}.txt`)
    this.pluginSaveOrigin.changeFile(`${this.path}/${this.fileId}-origin.txt`)
  }
  getInitData() {
    return {
      saveMessage: !this.pluginSaveMessage.paused,
      saveOrigin: !this.pluginSaveOrigin.paused,
      savePath: this.path
    }
  }
  _initCommamd() {
    this.command.addFromObj({
      saveMessage: (b) => {
        this.saveMessage(b)
      },
      saveOrigin: (b) => {
        this.saveOrigin(b)
      },
      savePath: (path) => {
        this.savePath(path)
      },
    })
  }
}

module.exports = Saving