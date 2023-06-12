const { SerialPort } = require('serialport')
const Avrgirl = require("@sienci/avrgirl-arduino");
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

let mainWindow;

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
        "arduino": [],
        "other": []
    }
    let closePorts = [];
    SerialPort.list().then(
        (ports) => {
            ports.forEach((port) => {
                if (port.friendlyName.includes("Uno")){
                    detectedPorts["arduino"].push(port);
                    autoDetectListener(port, detectedPorts, closePorts);
                }
                else{
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

// Checks if arduino at port has mimacro software flashed.
function autoDetectListener(port, detectedPorts, closePorts){
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
                isMimacro = true;
                detectedPorts["arduino"].splice(detectedPorts["arduino"].indexOf(port), 1);
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

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    webPreferences: {
        preload: path.join(__dirname, "preload.js")
    }
  });
  mainWindow.loadFile(path.join(__dirname, "public/index.html"));
  mainWindow.webContents.openDevTools();
  ipcMain.on("autoDetectDevices", (event) => autoDetectPorts(sendAutoPorts, 5000))
});
