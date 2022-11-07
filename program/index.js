const { ipcMain } = require("electron")
const Living = require("./living")
const Saving = require("./saving")
const Server = require("./server")
const Command = require("./command")

const configPath = "../config/config.json"
const config = require(configPath)

class Program {
  constructor() {
    this.ipcSender = new Set()
    this.command = new Command(this)
    this.living = new Living(this, config)
    this.saving = new Saving(this, config)
    this.server = new Server(this, config)
    this.initIpc()
    this.initServer()
  }
  initIpc() {
    ipcMain.on("cmd", (e, {cmd, value}) => {
      if (value) {
        this.command.do(cmd, ...value)
      } else {
        this.command.do(cmd)
      }
    })
    ipcMain.on("connect", (e) => {
      this.ipcSender.add(e.sender)
      e.sender.send("init", this.getInitData())
    })
  }
  initServer() {
    this.server.on("cmd", ({cmd, value}) => {
      if (value) {
        this.command.do(cmd, ...value)
      } else {
        this.command.do(cmd)
      }
    })
    this.server.on("connect", (ws) => {
      this.server.sendTo(ws, "init", this.getInitData())
      this.server.sendTo(ws, "version", process.env.npm_package_version )
    })
    if (config.server.sendMessage) {
      this.server.open()
    }
  }
  ipcDisconnect(sender) {
    this.ipcSender.delete(sender)
  }
  send(channel, ...args) {
    [...this.ipcSender]?.forEach((sender) => {
      sender.send(channel, ...args)
    })
    this.server?.send(channel, ...args)
  }
  getInitData() {
    return {
      living: this.living.getInitData(),
      saving: this.saving.getInitData(),
      server: this.server.getInitData(),
    }
  }
}

module.exports = new Program()