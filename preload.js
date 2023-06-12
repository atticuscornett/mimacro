const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  autoDetectDevices: () => ipcRenderer.send('autoDetectDevices'),
  onAutoDetect: (callback) => ipcRenderer.on("autoDetectResult", callback)
});