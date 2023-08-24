const layouts = require("./layouts.json");
const fs = require("fs");
const {join} = require("path");
const path = require("path");
const {readFileSync} = require("fs");
const Store = require('electron-store');
const AdmZip = require("adm-zip");
const store = new Store();

function refreshInstalledPlugins(){
    console.log(installedPlugins);
    if (!fs.existsSync("./plugins")){
        fs.mkdirSync("./plugins");
    }
    let pluginFolderList = getFoldersInDirectory("./plugins");
    let tempInstalledPlugins = [];
    for (let folder in pluginFolderList){
        try{
            let folderPath = join("./plugins", pluginFolderList[folder]);
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
        set: (pluginName, key, value) => {
            pluginStorage[pluginName][key] = value;
            store.set("pluginStorage", pluginStorage);
            return value;
        },
        get: (pluginName, key) => {return pluginStorage[pluginName][key];}
    }

    global.use = require;
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
        console.log("Loading plugin: " + pluginName);
        pluginModules[pluginName] = require("./" + pluginPath);
        console.log("Plugin loaded.")
        fireEventForPlugin(pluginName, "onEnable");
    } catch (err) {
        console.error('Error loading plugin (' + pluginPath + '):', err);
        installedPlugins[getInstalledPluginIndexByPackageName(pluginName)].error = true;
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
        disablePlugin(null, pluginName);
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
    for (let i = 0; i < global.userMacros.length; i++){
        if (global.userMacros[i].device.serialNumber === device.serialNumber){
            if (command[0] === "POTENT" && userMacros[i].part.id === "40"){
                if (String(global.userMacros[i].trigger.pin.pinNumber) === command[1]){
                    console.log("Check trigger conditions")
                }
            }
        }
        //console.log(userMacros[i]);
    }
    fireEvent("onDeviceMessage", input, device);
}

function getInstalledPlugins(){
    return installedPlugins;
}

function getLoadedPlugins(){
    return loadedPlugins;
}

function fireEvent(event, ...args){
    for (let pluginName in pluginModules){
        fireEventForPlugin(pluginName, event, ...args)
    }
}

function fireEventForPlugin(pluginName, event, ...args){
    if (event === "onEnable" && pluginModules[pluginName].onEnable){
        pluginModules[pluginName].onEnable(...args);
    }
    if (event === "onDisable" && pluginModules[pluginName].onDisable){
        pluginModules[pluginName].onDisable(...args);
    }
    if (event === "onDeviceMessage" && pluginModules[pluginName].onDeviceMessage){
        pluginModules[pluginName].onDeviceMessage(...args);
    }
}
createPluginAPI();
let installedPlugins = store.get("installedPlugins");
refreshInstalledPlugins();
let pluginStorage = store.get("pluginStorage");
let loadedPlugins = [];
let pluginModules = {};
loadEnabledPlugins();

module.exports = {refreshInstalledPlugins, loadEnabledPlugins, getFoldersInDirectory, getPluginIndexByPackageName,
    getInstalledPluginIndexByPackageName, getPlugin, getPluginREADME, pluginPackageJSON, loadPlugin, enablePlugin,
    disablePlugin, uninstallPlugin, addPluginFromFile, getInstalledPlugins, getLoadedPlugins, handleTriggers,
    fireEvent};