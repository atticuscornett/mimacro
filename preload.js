const { contextBridge, ipcRenderer } = require('electron')


contextBridge.exposeInMainWorld('electronAPI', {
  autoDetectDevices: () => ipcRenderer.send('autoDetectDevices'),
  onAutoDetect: (callback) => ipcRenderer.on("autoDetectResult", callback),
  addDevice: (device) => ipcRenderer.send("addDevice", device),
  getDevices: () => ipcRenderer.invoke("getDevices"),
  setColorTheme: (color) => ipcRenderer.invoke("setColorTheme", color),
  getColorTheme: () => ipcRenderer.invoke("getColorTheme"),
  saveMacro: (macro) => ipcRenderer.invoke("saveMacro", JSON.stringify(macro)),
  setMacros: (macros) => ipcRenderer.invoke("setMacros", JSON.stringify(macros)),
  removeMacro: (uuid) => ipcRenderer.invoke("removeMacro", uuid),
  getMacros: () => ipcRenderer.invoke("getMacros"),
  onDeviceRefresh: (callback) => ipcRenderer.on("refreshDevices", callback),
  getLayouts: () => ipcRenderer.invoke("getLayouts"),
  getParts: () => ipcRenderer.invoke("getParts"),
  removeDevice: (index) => {ipcRenderer.invoke("removeDevice", index)},
  renameDevice: (index, name) => {ipcRenderer.invoke("renameDevice", index, name)},
  flashDevice: (index, callback) => ipcRenderer.invoke("flashDevice", index),
  onFlashResult: (callback) => {ipcRenderer.on("flashResult", callback)},
  writeDevice: (device, message) => ipcRenderer.invoke("writeDevice", device, message),
  setDevicePinOut: (device, config) => ipcRenderer.invoke("setDevicePinOut", device, config),
  setDevicePinProperties: (device, config) => ipcRenderer.invoke("setDevicePinProperties", device, config),
  getInstalledPlugins: () => ipcRenderer.invoke("getInstalledPlugins"),
  enablePlugin: (packageName) => ipcRenderer.invoke("enablePlugin", packageName),
  disablePlugin: (packageName) => ipcRenderer.invoke("disablePlugin", packageName),
  uninstallPlugin: (packageName) => ipcRenderer.invoke("uninstallPlugin", packageName),
  addPluginDialog: () => ipcRenderer.invoke("addPluginDialog"),
  addPluginFromFile: (pluginPath) => ipcRenderer.invoke("addPluginFromFile", pluginPath),
  setOpenAtLogin: (openAtLogin) => ipcRenderer.invoke("setOpenAtLogin", openAtLogin),
  getOpenAtLogin: () => ipcRenderer.invoke("getOpenAtLogin")
});