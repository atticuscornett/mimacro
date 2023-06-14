const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  autoDetectDevices: () => ipcRenderer.send('autoDetectDevices'),
  onAutoDetect: (callback) => ipcRenderer.on("autoDetectResult", callback),
  addDevice: (device) => ipcRenderer.send("addDevice", device),
  getDevices: () => ipcRenderer.invoke("getDevices")
});