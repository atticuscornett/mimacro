const { SerialPort } = require('serialport')
const Avrgirl = require("@sienci/avrgirl-arduino");
const { app, BrowserWindow, ipcMain, nativeTheme, Tray, Menu, dialog } = require("electron");
const Store = require('electron-store');
const store = new Store();
const path = require("path");
const parts = require("./parts.json");
const layouts = require("./layouts.json");
const supportedVersions = require("./supportedVersions.json");
const {usb} = require('usb');
const { readFileSync } = require('fs');
const { join } = require('path');
const fs = require("fs");
const AdmZip = require("adm-zip");
const PluginManager = require("./plugins")

let mainWindow;

const processLock = app.requestSingleInstanceLock();
let tray = null;
if (!processLock){
    app.quit()
}
else{
    app.on('second-instance', () => {
        mainWindow.show();
    });
}

initializeStores();
global.devices = store.get("devices");
let serialPorts = {};
for (let i = 0; i < devices.length; i++){
    devices[i].status = "disconnected";
}

let colorTheme = store.get("colorTheme");
nativeTheme.themeSource = colorTheme;

global.userMacros = store.get("userMacros");
console.log("global test")


function initializeStores(){
    if (!store.has("devices")){
        store.set("devices", []);
    }
    if (!store.has("colorTheme")){
        store.set("colorTheme", "system")
    }
    if (!store.has("userMacros")){
        store.set("userMacros", []);
    }
    if (!store.has("installedPlugins")){
        store.set("installedPlugins", []);
    }
}

function addPluginDialog(){
    let selected = dialog.showOpenDialogSync(mainWindow, {
        properties: ['openFile'],
        filters: [{name: "Mimacro Extensions", extensions:["zip"]}]
    });
    if (!selected){
        return null;
    }
    try{
        let pluginZip = new AdmZip(selected[0]);
        let packageJson = JSON.parse(pluginZip.readAsText("package.json"));
        packageJson.path = selected[0];
        pluginZip.extractEntryTo(packageJson.icon, "temp", true, true);
        console.log(packageJson)
        return packageJson;
    }
    catch (e){
        console.log(e)
        return false;
    }
}


function flashDevice(event, index){
    if (serialPorts[index].isOpen){
        serialPorts[index].close()
    }
    devices[index].status = "updating";
    refreshRendererDevices()
    if (devices[index].mimacroType === "Arduino Uno"){
        let avrgirl = new Avrgirl(
            {
                board: "uno",
                port: devices[index].port
            }
        );
        avrgirl.flash("./arduino/uno/build/arduino.avr.uno/uno.ino.hex", function(e){
            refreshDevices();
            if (e){
                console.log(e);
                mainWindow.webContents.send("flashResult", false);
            }
            else{
                console.log("Flash complete.");
                mainWindow.webContents.send("flashResult", true);
            }
        });
            
    }
}

function flashPort(event, port, type){
    if (type === "Arduino Uno"){
        console.log(port)
        let avrgirl = new Avrgirl(
            {
                board: "uno",
                port: port
            }
        );
        try{
            avrgirl.flash("./arduino/uno/build/arduino.avr.uno/uno.ino.hex", function(e){
                if (e){
                    console.log(e);
                    mainWindow.webContents.send("portFlashResult", false);
                }
                else{
                    console.log("Flash complete.");
                    let tempPort = new SerialPort({path: port, baudRate: 9600});
                    tempPort.write("MEMRESET\n");
                    setTimeout(()=> {
                        tempPort.close();
                        mainWindow.webContents.send("portFlashResult", true);
                    }, 1000);
                }
            });
        }
        catch (e) {
            console.log(e);
            mainWindow.webContents.send("portFlashResult", false);
        }

    }
}

// Detect mimacro and Arduino devices.
function autoDetectPorts(callback, timeout){
    let detectedPorts = {
        "mimacro": [],
        "uno": [],
        "other": []
    }
    let closePorts = [];
    SerialPort.list().then(
        (ports) => {
            ports.forEach((port) => {
                if (deviceExists(port.serialNumber)){
                    return;
                }
                port.mimacroVersion = "Not installed."
                if (port.friendlyName.includes("Uno")){
                    port.looksCompatible = true;
                    port.mimacroType = "Arduino Uno";
                    port.flashed = false;
                    detectedPorts["uno"].push(port);
                    autoDetectListener(port, detectedPorts, closePorts, "uno");
                }
                else{
                    port.looksCompatible = false;
                    port.flashed = false;
                    port.mimacroType = "Unknown";
                    detectedPorts["other"].push(port);
                }
            });
        }
    );
    setTimeout(function(){
        for (let i = 0; i < closePorts.length; i++){
            try{
                if (closePorts[i].isOpen){
                    closePorts[i].close();
                }
                console.log(closePorts[i].isOpen)
            }
            catch(e){
                console.log(e);
            }
        }
        callback(detectedPorts);
    }, timeout);
}

function deviceExists(serial){
    for (let i = 0; i < devices.length; i++){
        if (devices[i].serialNumber === serial){
            return true;
        }
    }
    return false;
}

// Checks if arduino at port has mimacro software flashed.
function autoDetectListener(port, detectedPorts, closePorts, deviceType){
    try{
        let sp = new SerialPort({path: port.path, baudRate: 9600});
        let temp = "";
        let isMimacro = false;
        let line = 0;
        let index = 0;
        sp.on("data", function (data){
            temp += data.toString();
            // Runs when data is done being received
            if (data.toString().includes("\n")){
                line++;
                temp = temp.split("\n")[0].replace("\r", "");
                if (temp === "mimacro" && line === 1){
                    port.flashed = true;
                    isMimacro = true;
                    detectedPorts[deviceType].splice(detectedPorts[deviceType].indexOf(port), 1);
                    detectedPorts["mimacro"].push(port);
                    index = detectedPorts["mimacro"].indexOf(port);
                }
                if (isMimacro && line === 2){
                    detectedPorts["mimacro"][index].mimacroVersion = temp;
                }
                temp = data.toString().split("\n")[1];
            }
        });
        closePorts.push(sp);
    }
    catch(e){

    }
}

function sendAutoPorts(ports){
    mainWindow.webContents.send("autoDetectResult", ports)
}

function addDevice(device){
    device.status = "disconnected";
    devices.push(device);
    store.set("devices", devices)
    refreshDevices();
    refreshRendererDevices();
}

function removeDevice(event, deviceIndex){
    devices.splice(deviceIndex, 1);
    store.set("devices", devices);
    try{
        serialPorts[deviceIndex].close()
    }
    catch(e){
        console.log(e);
    }
    refreshRendererDevices();
}

function renameDevice(event, deviceIndex, deviceName){
    devices[deviceIndex].nickname = deviceName;
    store.set("devices", devices);
    refreshRendererDevices();
}

function getDevices(){
    return devices;
}

function setColorTheme(event, mode){
    colorTheme = mode;
    store.set("colorTheme", mode);
    nativeTheme.themeSource = mode;
}

function connectToDevices(){
    let serialNumbers = [];
    for (let i = 0; i < devices.length; i++){
        serialNumbers.push(devices[i].serialNumber);
    }
    SerialPort.list().then((ports) => {
        for (let i = 0; i < ports.length; i++){
            if (serialNumbers.includes(ports[i].serialNumber)){
                listenToDevice(serialNumbers.indexOf(ports[i].serialNumber), ports[i].path);
            }
        }
    })
}

function refreshRendererDevices(){
    mainWindow.webContents.send("refreshDevices");
}


function listenToDevice(index, devicePath){
    let thisDevice = devices[index];
    devices[index].port = devicePath;
    devices[index].pinOut = {}
    devices[index].pinProperties = {
        "digital": {},
        "analog": {}
    }
    let sp = new SerialPort({path: devicePath, baudRate: 9600});
    serialPorts[index] = sp;
    console.log(thisDevice.nickname);
    let temp = "";
    let line = 0;
    let outdated = false;
    sp.on("data", function (data){
        temp += data.toString();
        // Runs when data is done being received
        if (data.toString().includes("\n")){
            if (temp === "MEMRESET"){
                return;
            }
            if (line < 8){
                line++;
            }
            temp = temp.split("\n")[0].replace("\r", "");
            if (devices[index].status === "connected"){
                PluginManager.handleTriggers(temp, devices[index]);
            }
            if (line === 2){
                devices[index].mimacroVersion = temp;
                if (!supportedVersions.includes(devices[index].mimacroVersion)){
                    outdated = true;
                    sp.close()
                }
            }
            if (line === 3){
                devices[index].pinOut.digital = temp.split(", ").map(Number);
            }
            if (line === 4){
                devices[index].pinOut.analog = temp.split(", ").map(Number);
            }
            if (line === 5){
                devices[index].pinProperties.digital.timeout = temp.split(", ").map(Number);
            }
            if (line === 6){
                devices[index].pinProperties.analog.timeout = temp.split(", ").map(Number);
            }
            if (line === 7){
                devices[index].pinProperties.analog.minChange = temp.split(", ").map(Number);
                devices[index].status = "connected";
                store.set("devices", devices);
                refreshRendererDevices();
            }
            temp = data.toString().split("\n")[1];
        }
    });
    sp.on("close", () => {
        if (outdated){
            devices[index].status = "outdated";
        }
        else if (devices[index].status !== "updating"){
            devices[index].status = "disconnected";
        }
        refreshRendererDevices();
    });
}

function deviceOpen(device){
    for (let j = 0; j < devices.length; j++){
        if (device.serialNumber === devices[j].serialNumber){
            console.log(devices[j].status)
            if (devices[j].status === "connected"){
                console.log("yes yes")
                return true;
            }
        }
    }
    return false;
}

function refreshDevices(){
    SerialPort.list().then((ports) => {
        let serialNumbers = [];
        for (let i = 0; i < devices.length; i++){
            serialNumbers.push(devices[i].serialNumber);
        }
        for (let i = 0; i < ports.length; i++){
            if (serialNumbers.includes(ports[i].serialNumber)) {
                if (!deviceOpen(serialNumbers.indexOf(ports[i].serialNumber))) {
                    listenToDevice(serialNumbers.indexOf(ports[i].serialNumber), ports[i].path);
                }
            }
        }
    });
}

function writeDevice(event, device, message){
    serialPorts[device].write(message+"\n", ()=>{});
}

function setDevicePinOut(event, device, config){
    let pinMod = 0;
    for (let i = 0; i < config.digital.length; i++){
        if (config.digital[i] !== String(devices[device].pinOut.digital[i])){
            console.log("DPIN S " + String(layouts[devices[device].mimacroType]["digital"][i]+pinMod).padStart(2, "0") + " " + String(config.digital[i]).padStart(2, "0"))
            writeDevice(null, device, "DPIN S " + String(layouts[devices[device].mimacroType]["digital"][i]+pinMod).padStart(2, "0") + " " + String(config.digital[i]).padStart(2, "0"))
        }
    }
    // TODO
    // Modify pin code for Arduino software (temp solution)
    pinMod = 0;
    if (devices[device].mimacroType === "Arduino Uno"){
        pinMod = -14;
    }
    for (let i = 0; i < config.analog.length; i++){
        if (config.analog[i] !== String(devices[device].pinOut.analog[i])){
            console.log("APIN S " + String(layouts[devices[device].mimacroType]["analog"][i]+pinMod).padStart(2, "0") + " " + String(config.analog[i]).padStart(2, "0"))
            writeDevice(null, device, "APIN S " + String(layouts[devices[device].mimacroType]["analog"][i]+pinMod).padStart(2, "0") + " " + String(config.analog[i]).padStart(2, "0"))
        }
    }
    devices[device].pinOut = config;
    refreshRendererDevices();
}

function setDevicePinProperties(event, device, config){
    for (let i = 0; i < config.digital.timeout.length; i++){
        let newConf = config.digital.timeout[i];
        if (newConf !== devices[device].pinProperties.digital.timeout[i]){
            console.log("DPIN T " + String(layouts[devices[device].mimacroType]["digital"][i]).padStart(2, "0") + " " + String(config.digital.timeout[i]).padStart(3, "0"))
            writeDevice(null, device, "DPIN T " + String(layouts[devices[device].mimacroType]["digital"][i]).padStart(2, "0") + " " + String(config.digital.timeout[i]).padStart(3, "0"))
        }
    }
    // TODO
    // Modify pin code for Arduino software (temp solution)
    let pinMod = 0;
    if (devices[device].mimacroType === "Arduino Uno"){
        pinMod = -14;
    }
    for (let i = 0; i < config.analog.timeout.length; i++){
        let newConf = config.analog.timeout[i];
        if (newConf !== devices[device].pinProperties.analog.timeout[i]){
            console.log("APIN T " + String(layouts[devices[device].mimacroType]["analog"][i]+pinMod).padStart(2, "0") + " " + String(config.analog.timeout[i]).padStart(3, "0"))
            writeDevice(null, device, "APIN T " + String(layouts[devices[device].mimacroType]["analog"][i]+pinMod).padStart(2, "0") + " " + String(config.analog.timeout[i]).padStart(3, "0"))
        }
    }
    for (let i = 0; i < config.analog.minChange.length; i++){
        let newConf = config.analog.minChange[i];
        if (newConf !== devices[device].pinProperties.analog.minChange[i]){
            console.log("APIN V " + String(layouts[devices[device].mimacroType]["analog"][i]+pinMod).padStart(2, "0") + " " + String(config.analog.minChange[i]).padStart(3, "0"))
            writeDevice(null, device, "APIN V " + String(layouts[devices[device].mimacroType]["analog"][i]+pinMod).padStart(2, "0") + " " + String(config.analog.minChange[i]).padStart(3, "0"))
        }
    }
    devices[device].pinProperties = config;
}

usb.on('attach', () => {
    refreshDevices();
});

function saveMacro(event, macro){
    global.userMacros.push(JSON.parse(macro));
    store.set("userMacros", global.userMacros);
}

function setMacros(event, macros) {
    global.userMacros = JSON.parse(macros);
    store.set("userMacros", global.userMacros);
}

function removeMacro(event, uuid) {
    global.userMacros = userMacros.filter(macro => macro.uuid !== uuid);
    store.set("userMacros", global.userMacros);
}


function getMacros(){
    return global.userMacros;
}

function setOpenAtLogin(event, shouldRun){
    app.setLoginItemSettings({
        openAtLogin: shouldRun
    });
}

function getOpenAtLogin(){
    return app.getLoginItemSettings().openAtLogin;
}

function getAllActions(){
    let allActions = PluginManager.fireEvent("onGetActions")
    let fullList = [];
    for (let i = 0; i < allActions.length; i++){
        if (allActions[i] !== undefined){
            fullList = fullList.concat(allActions[i]);
        }
    }
    return fullList;
}

connectToDevices();
global.writeDevice = writeDevice;

ipcMain.on("autoDetectDevices", () => autoDetectPorts(sendAutoPorts, 5000))
ipcMain.on("addDevice", (event, device) => addDevice(device));
ipcMain.handle("getDevices", getDevices);
ipcMain.handle("setColorTheme", setColorTheme);
ipcMain.handle("getColorTheme", () => {return colorTheme;})
ipcMain.handle("saveMacro", saveMacro);
ipcMain.handle("setMacros", setMacros);
ipcMain.handle("getMacros", getMacros);
ipcMain.handle("removeMacro", removeMacro);
ipcMain.handle("getLayouts", ()=>{return layouts;});
ipcMain.handle("getParts", ()=>{return parts;});
ipcMain.handle("removeDevice", removeDevice);
ipcMain.handle("renameDevice", renameDevice);
ipcMain.handle("flashDevice", flashDevice);
ipcMain.handle("flashPort", flashPort);
ipcMain.handle("writeDevice", writeDevice);
ipcMain.handle("setDevicePinOut", setDevicePinOut);
ipcMain.handle("setDevicePinProperties", setDevicePinProperties);
ipcMain.handle("getInstalledPlugins", PluginManager.getInstalledPlugins);
ipcMain.handle("enablePlugin", PluginManager.enablePlugin);
ipcMain.handle("disablePlugin", PluginManager.disablePlugin);
ipcMain.handle("uninstallPlugin", PluginManager.uninstallPlugin);
ipcMain.handle("addPluginDialog", addPluginDialog);
ipcMain.handle("addPluginFromFile", PluginManager.addPluginFromFile);
ipcMain.handle("setOpenAtLogin", setOpenAtLogin);
ipcMain.handle("getOpenAtLogin", getOpenAtLogin);
ipcMain.handle("getPluginREADME", PluginManager.getPluginREADME);
ipcMain.handle("getPlugin", (event, packageName)=>{return JSON.parse(JSON.stringify(PluginManager.getPlugin(packageName)))});
ipcMain.handle("getPluginSettings", PluginManager.getPluginSettings);
ipcMain.handle("setPluginSettings", PluginManager.setPluginSettings);
ipcMain.handle("getAllActions", getAllActions);

app.on("ready", () => {
    tray = new Tray(__dirname + "/icon.png");
    tray.setToolTip("mimacro");
    const trayMenuTemplate = [{
        label: 'mimacro',
        enabled: true,
        click: () => {
                mainWindow.show()
            }
        },
        {
            label: 'Quit',
            enabled: true,
            click: () => {
                PluginManager.fireEvent("onDisable");
                app.quit()
                process.exit(0);
            }
        }
    ];
    let trayMenu = Menu.buildFromTemplate(trayMenuTemplate)
	tray.setContextMenu(trayMenu);
    tray.on('click', function(){
            mainWindow.show()
        }
    );

    mainWindow = new BrowserWindow({
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        },
        autoHideMenuBar: true,
        minWidth: 800,
        minHeight: 600,
        icon: __dirname + "/icon.png",
        show: !getOpenAtLogin()
    });
    mainWindow.on('close', e => {
        e.preventDefault();
        mainWindow.hide();
    });
    mainWindow.loadFile(path.join(__dirname, "public/index.html"));
});