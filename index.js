const { SerialPort } = require('serialport')
const Avrgirl = require("@sienci/avrgirl-arduino");
const { app, BrowserWindow, ipcMain, nativeTheme, Tray, Menu } = require("electron");
const Store = require('electron-store');
const store = new Store();
const path = require("path");
const parts = require("./parts.json");
const layouts = require("./layouts.json");
const supportedVersions = require("./supportedVersions.json");
const {usb} = require('usb');

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

if (!store.has("devices")){
    store.set("devices", []);
}
let devices = store.get("devices");
let serialPorts = {};
for (let i = 0; i < devices.length; i++){
    devices[i].status = "disconnected";
}

if (!store.has("colorTheme")){
    store.set("colorTheme", "system")
}
let colorTheme = store.get("colorTheme");
nativeTheme.themeSource = colorTheme;

if (!store.has("userMacros")){
    store.set("userMacros", []);
}
let userMacros = store.get("userMacros");

function flashDevice(event, index){
    try{
        serialPorts[index].close()
    }
    catch(e){}
    devices[index].status = "disconnected";
    refreshRendererDevices()
    if (devices[index].mimacroType == "Arduino Uno"){
        var avrgirl = new Avrgirl(
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
// var avrgirl = new Avrgirl(
//     {
//         board: "uno",
//         port: "COM5"
//     }
// );

// avrgirl.flash("./arduino/test/build/arduino.avr.uno/test.ino.hex", function(e){
//     if (e){
//         console.log(e);
//     }
//     else{
//         console.log("Flash complete.");
//     }
// });

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
                closePorts[i].close();
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
        if (devices[i].serialNumber == serial){
            return true;
        }
    }
    return false;
}

// Checks if arduino at port has mimacro software flashed.
function autoDetectListener(port, detectedPorts, closePorts, deviceType){
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
            if (temp == "mimacro" && line == 1){
                port.flashed = true;
                isMimacro = true;
                detectedPorts[deviceType].splice(detectedPorts[deviceType].indexOf(port), 1);
                detectedPorts["mimacro"].push(port);
                index = detectedPorts["mimacro"].indexOf(port);
            }
            if (isMimacro && line == 2){
                detectedPorts["mimacro"][index].mimacroVersion = temp;
            }
            temp = data.toString().split("\n")[1];
        }
    });
    closePorts.push(sp);
}

function sendAutoPorts(ports){
    mainWindow.webContents.send("autoDetectResult", ports)
}

function addDevice(device){
    device.status = "disconnected";
    devices.push(device);
    store.set("devices", devices)
}

function removeDevice(event, deviceIndex){
    devices.splice(deviceIndex, 1);
    store.set("devices", devices);
    try{
        serialPorts[index].close()
    }
    catch(e){}
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
    serialNumbers = [];
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
            if (temp == "MEMRESET"){
                return;
            }
            if (line < 8){
                line++;
            }
            temp = temp.split("\n")[0].replace("\r", "");
            console.log(temp);
            if (line == 2){
                devices[index].mimacroVersion = temp;
                if (!supportedVersions.includes(devices[index].mimacroVersion)){
                    outdated = true;
                    sp.close()
                }
            }
            if (line == 3){
                devices[index].pinOut.digital = temp.split(", ").map(Number);
            }
            if (line == 4){
                devices[index].pinOut.analog = temp.split(", ").map(Number);
            }
            if (line == 5){
                devices[index].pinProperties.digital.timeout = temp.split(", ").map(Number);
            }
            if (line == 6){
                devices[index].pinProperties.analog.timeout = temp.split(", ").map(Number);
            }
            if (line == 7){
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
        else{
            devices[index].status = "disconnected";
        }
        refreshRendererDevices();
    });
}

function deviceOpen(device){
    for (let j = 0; j < devices.length; j++){
        if (device.serialNumber == devices[j].serialNumber){
            console.log(devices[j].status)
            if (devices[j].status == "connected"){
                console.log("yes yes")
                return true;
            }
        }
    }
    return false;
}

function refreshDevices(){
    SerialPort.list().then((ports) => {
        serialNumbers = [];
        for (let i = 0; i < devices.length; i++){
            serialNumbers.push(devices[i].serialNumber);
        }
        for (let i = 0; i < ports.length; i++){
            if (true){
                if (serialNumbers.includes(ports[i].serialNumber)){
                    console.log(devices[i].nickname);
                    listenToDevice(serialNumbers.indexOf(ports[i].serialNumber), ports[i].path);
                }
            }
        }
    });
}

function writeDevice(event, device, message){
    serialPorts[device].write(message+"\n", ()=>{});
}

usb.on('attach', (device) => {
    refreshDevices();
});

function saveMacro(event, macro){
    userMacros.push(JSON.parse(macro));
    store.set("userMacros", userMacros);
}

function removeMacro(event, uuid) {
    userMacros = userMacros.filter(macro => macro.uuid !== uuid);
    store.set("userMacros", userMacros);
}


function getMacros(){
    return userMacros;
}

connectToDevices();

ipcMain.on("autoDetectDevices", (event) => autoDetectPorts(sendAutoPorts, 5000))
ipcMain.on("addDevice", (event, device) => addDevice(device));
ipcMain.handle("getDevices", getDevices);
ipcMain.handle("setColorTheme", setColorTheme);
ipcMain.handle("getColorTheme", () => {return colorTheme;})
ipcMain.handle("saveMacro", saveMacro);
ipcMain.handle("getMacros", getMacros);
ipcMain.handle("removeMacro", removeMacro);
ipcMain.handle("getLayouts", ()=>{return layouts;});
ipcMain.handle("getParts", ()=>{return parts;});
ipcMain.handle("removeDevice", removeDevice);
ipcMain.handle("flashDevice", flashDevice);
ipcMain.handle("writeDevice", writeDevice);


app.on("ready", () => {
    tray = new Tray("icon.png");
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
                app.quit()
                process.exit(0);
            }
        }
    ];
    let trayMenu = Menu.buildFromTemplate(trayMenuTemplate)
	tray.setContextMenu(trayMenu);
    tray.on('click', function(e){
            mainWindow.show()
        }
    );

    mainWindow = new BrowserWindow({
        webPreferences: {
        preload: path.join(__dirname, "preload.js")
        }
    });
    mainWindow.on('close', e => {
        e.preventDefault();
        mainWindow.hide();
    });
    mainWindow.loadFile(path.join(__dirname, "public/index.html"));
});
