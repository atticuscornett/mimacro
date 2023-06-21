export interface ArduinoDevice {
    path: string;
    manufacturer: string,
    serialNumber: string,
    pnpId: string,
    locationId: string,
    friendlyName: string,
    vendorId: string,
    productId: string,
    mimacroVersion: string,
    looksCompatible: boolean,
    mimacroType: string,
    flashed: boolean,
    nickname: string,

    pinOut: {
        digital: number[],
        analog: number[]
    }
}

export function placeholderDevice(): ArduinoDevice {
    return {
        path: "COM8",
            manufacturer: "Arduino LLC (www.arduino.cc)",
        serialNumber: "557393234373510110C1",
        pnpId: "USB\\VID_2341&PID_0043\\557393234373510110C1",
        locationId: "Port_#0001.Hub_#0002",
        friendlyName: "Arduino Uno (COM8)",
        vendorId: "2341",
        productId: "0043",
        mimacroVersion: "UNO 0.0.1",
        looksCompatible: true,
        mimacroType: "Arduino Uno",
        flashed: true,
        nickname: "Testing",

        pinOut: {
        digital: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            analog: [40, 0, 0, 0, 0, 0]
    }
    }
}

export let devices: ArduinoDevice[];
const getDevices = async () => {
    devices = await electronAPI.getDevices();
}
getDevices();