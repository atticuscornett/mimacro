const { SerialPort } = require('serialport')
const Avrgirl = require("@sienci/avrgirl-arduino");

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
                    autoDetectListener(port, detectedPorts);
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
function autoDetectListener(port, detectedPorts){
    let sp = new SerialPort({path: port.path, baudRate: 9600});
    let temp = "";
    sp.on("data", function (data){
        temp += data.toString();
        // Runs when data is done being received
        if (data.toString().includes("\n")){
            temp = temp.split("\n")[0];
            console.log(temp);
            if (temp.includes("mimacro")){
                console.log("testing");
                detectedPorts["arduino"].splice(detectedPorts["arduino"].indexOf(port), 1);
                detectedPorts["mimacro"].push(port);
            }
            temp = data.toString().split("\n")[1];
        }
    });
}

autoDetectPorts((ports) => {console.log(ports)}, 5000);

// const serialport = new SerialPort({path: "COM8", baudRate: 9600});

// let dataString = "";

// serialport.on("data", function (data){
//     dataString += data.toString();

//     // Runs when data is done being received
//     if (data.toString().includes("\n")){
//         dataString = dataString.split("\n")[0];
//         console.log(dataString);
//         dataString = data.toString().split("\n")[1];
//     }
// });

const { app, BrowserWindow } = require("electron");
const path = require("path");

app.on("ready", () => {
  const mainWindow = new BrowserWindow();
  mainWindow.loadFile(path.join(__dirname, "public/index.html"));
  mainWindow.webContents.openDevTools();
});
