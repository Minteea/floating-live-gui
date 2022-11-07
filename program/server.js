const { EventEmitter } = require("events")
const WebSocketServer = require("ws").Server

class Server extends EventEmitter{
  wss = null
  port = 8130
  constructor(service, config) {
    super()
    this.port = config.server.port || this.port
    this.service = service
    this.command = this.service.command
    this._initCommamd()
  }
  get serving() {
    return !!this.wss
  }
  open() {
    if(this.wss) return
    this.wss = new WebSocketServer({port: this.port})
    console.log(`已在端口${this.port}启动`)

    this.wss.on("connection", (ws) => {
      this.emit("connect", ws)
      ws.on("message", (buffer) => {
        let data = JSON.parse(buffer.toString())
        this.emit(data.channel, ...data.args)
      })
    })

    this.service.send("server", {key: "sendMessage", value: this.serving})
  }
  send(channel, ...args) {
    this.wss?.clients.forEach((ws) => {
      ws.send(JSON.stringify({channel, args}))
    })
  }
  sendTo(ws, channel, ...args) {
    ws.send(JSON.stringify({channel, args}))
  }
  close() {
    if(!this.wss) return
    this.wss.close()
    this.wss.removeAllListeners()
    this.wss = null
    this.service.send("server", {key: "sendMessage", value: this.serving})
  }
  changePort(num) {
    if(num == this.port) return
    this.port = num
    if(this.wss) {
      this.close()
      this.open()
    }
    this.service.send("server", {key: "port", value: this.port})
    
  }
  getInitData() {
    return {
      sendMessage: this.serving,
      port: this.port
    }
  }
  _initCommamd() {
    this.command.addFromObj({
      server: (b = true) => {
        if (b) {
          this.open()
        } else {
          this.close()
        }
      },
      port: (num) => {
        this.changePort(Number(num))
      }
    })
  }
}

module.exports = Server