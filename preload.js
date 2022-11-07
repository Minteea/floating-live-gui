const { ipcRenderer, contextBridge } = require('electron')
const os = require('os')

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  env: () => undefined,  
  app: () => process.env.npm_package_version,
  platform: ()=> [os.platform(), os.release()]
})

contextBridge.exposeInMainWorld('ipcRenderer', {
  send: (...args) => ipcRenderer.send(...args),
  on: (...args) => ipcRenderer.on(...args)
})