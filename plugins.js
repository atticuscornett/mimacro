const layouts = require("./layouts.json");
const fs = require("fs");
const {join} = require("path");
const path = require("path");
const {readFileSync} = require("fs");
const vm = require("vm");
const Store = require('electron-store');
const AdmZip = require("adm-zip");
const store = new Store();

const pluginAPI = {
    require: null,
    PluginEvents: {
    },
    PluginUtils: {
        log: (message) => console.log(message),
        getDevices: () => global.devices,
        getDeviceLayouts: () => layouts,
        getMacros: () => global.userMacros,
        //TODO - Remove this, could make it possible for plugins to make themselves impossible to disable.
        use: require
    },
    PluginStorage: {
    },
    RegisterRunnable: () => console.log("WIP"),
    setTimeout: null,
    setInterval: null,
    Forever: null
}

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

function createEvents(pluginName){
    return {
        onEnable: (callback) => {getPlugin(pluginName).events.onEnable = callback;},
        onDisable: (callback) => {getPlugin(pluginName).events.onDisable = callback;},
        onRunnable: (callback) => {getPlugin(pluginName).events.onRunnable = callback;},
        onDeviceMessage: (callback) => {getPlugin(pluginName).events.onDeviceMessage = callback;}
    }
}

function createStorage(pluginName){
    if (!pluginStorage[pluginName]){
        pluginStorage[pluginName] = {};
        store.set("pluginStorage", pluginStorage);
    }
    return {
        set: (key, value) => {
            pluginStorage[pluginName][key] = value;
            store.set("pluginStorage", pluginStorage);
            return value;
        },
        get: (key) => {return pluginStorage[pluginName][key];}
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

function loadPlugin(pluginPath) {
    let pluginName;
    try {
        pluginAPI.require = createRequire(pluginPath);
        const code = readFileSync(join(pluginPath, 'index.js'), 'utf-8');
        const context = vm.createContext(pluginAPI);
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
        pluginAPI.PluginEvents = createEvents(pluginObj.packageName);
        pluginAPI.PluginStorage = createStorage(pluginObj.packageName);
        pluginAPI.Forever = createForever(pluginObj.packageName);
        pluginAPI.setTimeout = createSetTimeout(pluginObj.packageName);
        pluginAPI.setInterval = createSetInterval(pluginObj.packageName);
        console.log("Loading plugin: " + pluginName);
        vm.runInContext(code, context, { timeout: 5000 });
        console.log("Plugin loaded.")
        if (getPlugin(pluginName).events.onEnable){
            getPlugin(pluginName).events.onEnable();
        }
    } catch (err) {
        console.error('Error loading plugin (' + pluginPath + '):', err);
        installedPlugins[getInstalledPluginIndexByPackageName(pluginName)].error = true;
    }
}

function createRequire(pluginPath) {
    return (moduleName) => {
        const modulePath = require.resolve(moduleName, { paths: [pluginPath] });
        delete require.cache[modulePath];
        return require(modulePath);
    };
}

function createForever(pluginName){
    if (pluginForever[pluginName] === undefined){
        pluginForever[pluginName] = [];
    }
    return (callback) => {pluginForever[pluginName].push(callback);}
}

function createSetTimeout(pluginName){
    if (pluginTimeouts[pluginName] === undefined){
        pluginTimeouts[pluginName] = [];
    }
    return (callback, timeout) => pluginTimeouts[pluginName].push(setTimeout(callback, timeout));
}

function createSetInterval(pluginName){
    if (pluginIntervals[pluginName] === undefined){
        pluginIntervals[pluginName] = [];
    }
    return (callback, timeout) => pluginIntervals[pluginName].push(setInterval(callback, timeout));
}

function enablePlugin(event, packageName){
    installedPlugins[getInstalledPluginIndexByPackageName(packageName)].enabled = true;
    loadPlugin(installedPlugins[getInstalledPluginIndexByPackageName(packageName)].path);
    store.set("installedPlugins", installedPlugins);
}

function disablePlugin(event, packageName){
    if (getPlugin(packageName).events.onDisable){
        getPlugin(packageName).events.onDisable();
    }
    pluginForever[packageName] = [];
    if (pluginTimeouts[packageName]){
        for (let i = 0; i < pluginTimeouts[packageName].length; i++){
            clearTimeout(pluginTimeouts[packageName][i]);
        }
    }
    if (pluginIntervals[packageName]){
        for (let i = 0; i < pluginIntervals[packageName].length; i++){
            clearInterval(pluginIntervals[packageName][i]);
        }
    }
    installedPlugins[getInstalledPluginIndexByPackageName(packageName)].enabled = false;
    store.set("installedPlugins", installedPlugins);
}

function uninstallPlugin(event, pluginName){
    if (getPluginIndexByPackageName(pluginName) >= 0){
        disablePlugin(null, pluginName);
    }
    fs.rmSync(installedPlugins[getInstalledPluginIndexByPackageName(pluginName)].path, { recursive: true, force: true });
    refreshInstalledPlugins();
}

function fireForever(){
    for (let key in pluginForever){
        for (let index in pluginForever[key]){
            try{
                pluginForever[key][index]();
            }
            catch(e){
                console.log("Error running forever callback for " + key + " (index " + index + ")")
            }
        }
    }
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
}

function getInstalledPlugins(){
    return installedPlugins;
}

function getLoadedPlugins(){
    return loadedPlugins;
}

function fireOnDisable(){
    for (let i = 0; i < loadedPlugins.length; i++){
        if (loadedPlugins[i].events.onDisable){
            loadedPlugins[i].events.onDisable();
        }
    }
}

let installedPlugins = store.get("installedPlugins");
refreshInstalledPlugins();
let pluginStorage = store.get("pluginStorage");
let pluginForever = {};
let pluginTimeouts = {};
let pluginIntervals = {};
let loadedPlugins = [];
loadEnabledPlugins();

module.exports = {refreshInstalledPlugins, loadEnabledPlugins, getFoldersInDirectory, getPluginIndexByPackageName,
    getInstalledPluginIndexByPackageName, getPlugin, getPluginREADME, pluginPackageJSON, loadPlugin, enablePlugin,
    disablePlugin, uninstallPlugin, fireForever, addPluginFromFile, getInstalledPlugins, getLoadedPlugins,
    fireOnDisable, handleTriggers};