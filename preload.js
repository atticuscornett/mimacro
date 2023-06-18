const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  autoDetectDevices: () => ipcRenderer.send('autoDetectDevices'),
  onAutoDetect: (callback) => ipcRenderer.on("autoDetectResult", callback),
  addDevice: (device) => ipcRenderer.send("addDevice", device),
  getDevices: () => ipcRenderer.invoke("getDevices"),
  setColorTheme: (color) => ipcRenderer.invoke("setColorTheme", color),
  getColorTheme: () => ipcRenderer.invoke("getColorTheme"),
  saveMacro: (macro) => ipcRenderer.invoke("saveMacro", macro),
  getMacros: () => ipcRenderer.invoke("getMacros"),
  onDeviceRefresh: (callback) => ipcRenderer.on("refreshDevices", callback)
});