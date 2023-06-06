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

SerialPort.list().then(
    (ports) => {
        console.log("Ports:");
        ports.forEach((port) => {
            console.log(port.path);
            console.log(port);
        });
    }
)

const serialport = new SerialPort({path: "COM5", baudRate: 9600});

let dataString = "";

serialport.on("data", function (data){
    dataString += data.toString();

    // Runs when data is done being received
    if (data.toString().includes("\n")){
        dataString = dataString.split("\n")[0];
        console.log(dataString);
        dataString = data.toString().split("\n")[1];
    }
})