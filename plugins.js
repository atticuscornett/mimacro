const layouts = require("./layouts.json");
const fs = require("fs");
const {join} = require("path");
const path = require("path");
const {readFileSync} = require("fs");
const Store = require('electron-store');
const AdmZip = require("adm-zip");
const store = new Store();
const { app} = require("electron")


function refreshInstalledPlugins(){
    console.log(installedPlugins);
    if (!fs.existsSync("./plugins")){
        fs.mkdirSync("./plugins");
    }
    let pluginFolderList = getFoldersInDirectory(getPluginDir());
    let tempInstalledPlugins = [];
    for (let folder in pluginFolderList){
        try{
            let folderPath = join(getPluginDir(), pluginFolderList[folder]);
            let packageObj = pluginPackageJSON(folderPath);
            packageObj.path = folderPath;
            if (getInstalledPluginIndexByPackageName(packageObj.packageName) > -1){
                try{
                    packageObj.enabled = installedPlugins[getInstalledPluginIndexByPackageName(packageObj.packageName)].enabled;
                }
                catch(e){
                    packageObj.enabled = false;
                }
            }
            else {
                packageObj.enabled = false;
            }
            tempInstalledPlugins.push(packageObj);
        }
        catch(e){
            console.log(e);
        }
    }
    installedPlugins = tempInstalledPlugins;
    console.log(installedPlugins)
    store.set("installedPlugins", installedPlugins);
}

function loadEnabledPlugins(){
    for (let plugin in installedPlugins){
        if (installedPlugins[plugin].enabled){
            loadPlugin(installedPlugins[plugin].path);
        }
    }
}

function getFoldersInDirectory(directoryPath) {
    try {
        const items = fs.readdirSync(directoryPath);

        // Filter out only the folders from the items
        return items.filter((item) => {
            const itemPath = path.join(directoryPath, item);
            return fs.statSync(itemPath).isDirectory();
        });
    } catch (err) {
        console.error('Error reading directory:', err);
        return [];
    }
}

function getPluginIndexByPackageName(packageName){
    for (let i = 0; i < loadedPlugins.length; i++){
        if (loadedPlugins[i].packageName === packageName){
            return i;
        }
    }
    return -1;
}

function getInstalledPluginIndexByPackageName(packageName){
    for (let i = 0; i < installedPlugins.length; i++){
        if (installedPlugins[i].packageName === packageName){
            return i;
        }
    }
    return -1;
}

function getPlugin(packageName){
    let index = getPluginIndexByPackageName(packageName);
    if (index > -1){
        return loadedPlugins[index];
    }
    return null;
}

function getPluginREADME(event, packageName){
    try {
        return fs.readFileSync(join("./plugins/", packageName, "README.md"), "utf8");
    }
    catch (e) {
        return "";
    }
}

function pluginPackageJSON(pluginPath){
    const packageJson = JSON.parse(readFileSync(join(pluginPath, "package.json"), 'utf-8'));
    return {
        packageName: packageJson.name,
        pluginName: packageJson.displayName,
        version: packageJson.version,
        description: packageJson.description,
        author: packageJson.author,
        icon: join(pluginPath, packageJson.icon)
    };
}

function createPluginAPI(){
    global.storage = {
        set: (plugin, key, value) => {
            pluginStorage[plugin.packageName][key] = value;
            store.set("pluginStorage", pluginStorage);
            return value;
        },
        get: (plugin, key) => {return pluginStorage[plugin.packageName][key];}
    }

    global.registerSetting = (plugin, settingID, settingLabel, settingDescription, settingType, settingDefault, options=null) => {
        if (!pluginSettings[plugin.packageName][settingID]){
            let settingTypes = ["boolean", "choice", "string", "number"]
            if (settingType === "options" && options === null){
                throw new Error("Error registering setting '" + settingID + "' for plugin '" + plugin.packageName + "': Options must be provided for choice setting.")
            }
            if (!settingTypes.includes(settingType)){
                throw new Error("Error registering setting '" + settingID + "' for plugin '" + plugin.packageName + "': Unknown setting type.")
            }
            pluginSettings[plugin.packageName][settingID] = {
                label: settingLabel,
                description: settingDescription,
                type: settingType,
                value: settingDefault,
                options: options
            }
            store.set("pluginSettings", pluginSettings);
        }
    }

    global.getSetting = (plugin, settingID) => {
        if (pluginSettings[plugin.packageName][settingID]) {
            return pluginSettings[plugin.packageName][settingID];
        }
        else {
            throw new Error("Error getting setting '" + settingID + "' for plugin '" + plugin.packageName + "': Setting has not been registered.")
        }
    }

    global.setSetting = (plugin, settingID, value) => {
        if (pluginSettings[plugin.packageName][settingID]) {
            pluginSettings[plugin.packageName][settingID].value = value;
            fireEventForPlugin(plugin.packageName, "onSettingUpdate", settingID, value)
            store.set("pluginSettings", pluginSettings)
            return pluginSettings[plugin.packageName][settingID];
        }
        else {
            throw new Error("Error setting setting '" + settingID + "' for plugin '" + plugin.packageName + "': Setting has not been registered.")
        }
    }

    global.sendMessageToDevice = (device, message) => {writeDevice(null, device, message)}

    global.use = require;
}

// Get plugin directory, which is different when in dev vs production.
function getPluginDir(){
    if (app.getAppPath().endsWith(".asar")){
        return join(path.dirname(app.getPath("exe")), "/plugins")
    }
    else {
        return join(app.getAppPath(), "/plugins");
    }
}

function loadPlugin(pluginPath) {
    let pluginName;
    try {
        const packageJson = JSON.parse(readFileSync(join(pluginPath, "package.json"), 'utf-8'));
        pluginName = packageJson.name;
        const pluginObj = {
            packageName: packageJson.name,
            pluginName: packageJson.displayName,
            version: packageJson.version,
            description: packageJson.description,
            author: packageJson.author,
            events: {}
        }
        loadedPlugins.push(pluginObj);
        if (!pluginStorage[pluginName]){
            pluginStorage[pluginName] = {};
        }
        if (!pluginSettings[pluginName]){
            pluginSettings[pluginName] = {};
        }
        store.set("pluginStorage", pluginStorage);
        store.set("pluginSettings", pluginSettings);
        console.log("Loading plugin: " + pluginName);
        pluginModules[pluginName] = require(pluginPath);
        console.log("Plugin loaded.")
        fireEventForPlugin(pluginName, "onEnable", pluginObj);
    } catch (err) {
        console.error('Error loading plugin (' + pluginPath + '):', err);
        if (installedPlugins[getInstalledPluginIndexByPackageName(pluginName)]){
            installedPlugins[getInstalledPluginIndexByPackageName(pluginName)].error = true;
            installedPlugins[getInstalledPluginIndexByPackageName(pluginName)].errorDetails = err;
        }
    }
}

function enablePlugin(event, packageName){
    installedPlugins[getInstalledPluginIndexByPackageName(packageName)].enabled = true;
    loadPlugin(installedPlugins[getInstalledPluginIndexByPackageName(packageName)].path);
    store.set("installedPlugins", installedPlugins);
}

function disablePlugin(event, packageName){
    console.log("Disabling plugin: " + packageName)
    installedPlugins[getInstalledPluginIndexByPackageName(packageName)].enabled = false;
    store.set("installedPlugins", installedPlugins);
    fireEventForPlugin(packageName, "onDisable");
    loadedPlugins.splice(getPluginIndexByPackageName(packageName), 1);
}

function uninstallPlugin(event, pluginName){
    if (getPluginIndexByPackageName(pluginName) >= 0){
        try{
            disablePlugin(null, pluginName);
        }
        catch(e){
            console.log("Could not disable plugin.");
        }
    }
    fs.rmSync(installedPlugins[getInstalledPluginIndexByPackageName(pluginName)].path, { recursive: true, force: true });
    refreshInstalledPlugins();
}
function addPluginFromFile(event, filePath){
    console.log(filePath)
    try{
        let pluginZip = new AdmZip(filePath);
        let packageJson = JSON.parse(pluginZip.readAsText("package.json"));
        let pluginFolder = join("./plugins/", packageJson.name);
        if (!fs.existsSync(pluginFolder)){
            fs.mkdirSync(pluginFolder);
        }
        pluginZip.extractAllTo(pluginFolder, true);
        refreshInstalledPlugins();
        enablePlugin(null, packageJson.name);
        return true;
    }
    catch(e){
        return false;
    }
}

function handleTriggers(input, device){
    let command = input.split(" ");
    console.log(command);
    if (command[0] === "BUTTON" && command[2] === "UP"){
        clearHold(device.serialNumber, command[1]);
    }
    for (let i = 0; i < global.userMacros.length; i++){
        let thisMacro = global.userMacros[i];
        if (thisMacro.device.serialNumber === device.serialNumber){
            if (command[0] === "POTENT" && thisMacro.part.id === "40"){
                let potentValue = Number(command[2]);
                if (thisMacro.device.mimacroType === "Arduino Uno"){
                    potentValue = potentValue/1024;
                }
                if (String(thisMacro.trigger.pin.pinNumber) === command[1]){
                    if (thisMacro.trigger.name === "Value Change"){
                        runActions(thisMacro.actions, potentValue);
                    }
                    if (thisMacro.trigger.name === "Above" && potentValue > (Number(thisMacro.trigger.parameters[0].value)/100)){
                        runActions(thisMacro.actions, potentValue);
                    }
                    if (thisMacro.trigger.name === "Below" && potentValue < (Number(thisMacro.trigger.parameters[0].value)/100)){
                        runActions(thisMacro.actions, potentValue);
                    }
                    if (thisMacro.trigger.name === "Between" && potentValue > (Number(thisMacro.trigger.parameters[0].value)/100)
                    && potentValue < (Number(thisMacro.trigger.parameters[1].value)/100)){
                        runActions(thisMacro.actions, potentValue);
                    }
                }
            }
            if (command[0] === "BUTTON" && thisMacro.part.id === "1"){
                if (String(thisMacro.trigger.pin.pinNumber) === command[1]){
                    if (thisMacro.trigger.name === "Up" && command[2] === "UP"){
                        runActions(thisMacro.actions);
                    }
                    if (thisMacro.trigger.name === "Down" && command[2] === "DOWN"){
                        runActions(thisMacro.actions);
                    }
                    if (thisMacro.trigger.name === "Hold" && command[2] === "DOWN"){
                        handleHolds(device.serialNumber, command[1], thisMacro.actions, thisMacro.trigger.parameters[0].value)
                    }
                }
            }
        }
        //console.log(userMacros[i]);
    }
    fireEvent("onDeviceMessage", input, device);
}

function handleHolds(deviceSerial, pin, actions, duration){
    if (!pinHolds[deviceSerial+"-"+pin]){
        pinHolds[deviceSerial+"-"+pin] = [];
    }
    pinHolds[deviceSerial+"-"+pin].push(
        setTimeout(()=>{
            runActions(actions);
        }, duration*1000
    ));
}

function clearHold(deviceSerial, pin){
    if (pinHolds[deviceSerial+"-"+pin]){
        for (let i = 0; i < pinHolds[deviceSerial+"-"+pin].length; i++){
            clearTimeout(pinHolds[deviceSerial+"-"+pin][i]);
        }
        pinHolds[deviceSerial+"-"+pin] = [];
    }
}

async function runActions(actions, value = 1) {
    for (let i = 0; i < actions.length; i++) {
        // Remove ordinals from actions
        let actionId = actions[i].id;
        let ordinal = actions[i].ordinal;
        actionId = actionId.slice(0, -36);
        let metaData = {};
        for (let key in actions[i].metaData) {
            metaData[key.slice(0, -36)] = actions[i].metaData[key];
        }
        console.log("Metadata: " + JSON.stringify(metaData))
        await fireAction(actions[i].pluginId, actionId, metaData, value);
    }
}

function getInstalledPlugins(){
    return installedPlugins;
}

function getLoadedPlugins(){
    return loadedPlugins;
}

function fireEvent(event, ...args){
    let returns = [];
    for (let pluginName in pluginModules){
        returns.push(fireEventForPlugin(pluginName, event, ...args));
    }
    return returns;
}

function fireEventForPlugin(pluginName, event, ...args){
    if (event === "onEnable" && pluginModules[pluginName].onEnable){
        return pluginModules[pluginName].onEnable(...args);
    }
    if (event === "onDisable" && pluginModules[pluginName].onDisable){
        return pluginModules[pluginName].onDisable(...args);
    }
    if (event === "onDeviceMessage" && pluginModules[pluginName].onDeviceMessage){
        return pluginModules[pluginName].onDeviceMessage(...args);
    }
    if (event === "onSettingUpdate" && pluginModules[pluginName].onSettingUpdate){
        return pluginModules[pluginName].onSettingUpdate(...args);
    }
    if (event === "onGetActions" && pluginModules[pluginName].onGetActions){
        let modules = pluginModules[pluginName].onGetActions(...args);
        for (let i = 0; i < modules.length; i++){
            modules[i].pluginId = pluginName;
        }
        return modules;
    }
    if (event === "onAction" && pluginModules[pluginName].onAction){
        return fireAction(pluginName, ...args);
    }
}

async function fireAction(pluginName, ...args) {
    if (pluginModules[pluginName].onAction){
        await pluginModules[pluginName].onAction(...args);
    }
}

function getPluginSettings(event, pluginName){
    return pluginSettings[pluginName];
}

function setPluginSettings(event, pluginName, settings){
    let keys = Object.keys(settings);
    let currentSettings = pluginSettings[pluginName];
    pluginSettings[pluginName] = settings;
    store.set("pluginSettings", pluginSettings);
    for (let i = 0; i < keys.length; i++){
        if (currentSettings[keys[i]].value !== settings[keys[i]].value){
            fireEventForPlugin(pluginName, "onSettingUpdate", keys[i])
        }
    }
}

if (!store.has("pluginStorage")){
    store.set("pluginStorage", {});
}
if (!store.has("pluginSettings")){
    store.set("pluginSettings", {});
}

createPluginAPI();
let installedPlugins = store.get("installedPlugins");
let pluginStorage = store.get("pluginStorage");
let pluginSettings = store.get("pluginSettings");
let loadedPlugins = [];
let pinHolds = {};
let pluginModules = {};

loadPlugin(join(app.getAppPath(), "/public/bundled-plugins/keyboard"));
loadPlugin(join(app.getAppPath(), "/public/bundled-plugins/mouse"))
loadPlugin(join(app.getAppPath(), "/public/bundled-plugins/media-controls"))
refreshInstalledPlugins();
loadEnabledPlugins();

module.exports = {refreshInstalledPlugins, loadEnabledPlugins, getFoldersInDirectory, getPluginIndexByPackageName,
    getInstalledPluginIndexByPackageName, getPlugin, getPluginREADME, pluginPackageJSON, loadPlugin, enablePlugin,
    disablePlugin, uninstallPlugin, addPluginFromFile, getInstalledPlugins, getLoadedPlugins, handleTriggers,
    fireEvent, getPluginSettings, setPluginSettings};