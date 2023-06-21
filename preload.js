const { contextBridge, ipcRenderer } = require('electron')


contextBridge.exposeInMainWorld('electronAPI', {
  autoDetectDevices: () => ipcRenderer.send('autoDetectDevices'),
  onAutoDetect: (callback) => ipcRenderer.on("autoDetectResult", callback),
  addDevice: (device) => ipcRenderer.send("addDevice", device),
  getDevices: () => ipcRenderer.invoke("getDevices"),
  setColorTheme: (color) => ipcRenderer.invoke("setColorTheme", color),
  getColorTheme: () => ipcRenderer.invoke("getColorTheme"),
  saveMacro: (macro) => ipcRenderer.invoke("saveMacro", JSON.stringify(macro)),
  removeMacro: (uuid) => ipcRenderer.invoke("removeMacro", uuid),
  getMacros: () => ipcRenderer.invoke("getMacros"),
  onDeviceRefresh: (callback) => ipcRenderer.on("refreshDevices", callback),
  getLayouts: () => ipcRenderer.invoke("getLayouts"),
  getParts: () => ipcRenderer.invoke("getParts"),
  removeDevice: (index) => {ipcRenderer.invoke("removeDevice", index)},
  flashDevice: (index, callback) => ipcRenderer.invoke("flashDevice", index),
  onFlashResult: (callback) => {ipcRenderer.on("flashResult", callback)},
  writeDevice: (device, message) => ipcRenderer.invoke("writeDevice", device, message)
});