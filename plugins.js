const layouts = require("./layouts.json");
const fs = require("fs");
const {join} = require("path");
const path = require("path");
const {readFileSync} = require("fs");
const Store = require('electron-store');
const AdmZip = require("adm-zip");
const store = new Store();
const {getQuickJS} = require("quickjs-emscripten");


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

function createPluginAPI(pluginPath, pluginName, vm){
    return {
        require: createRequire(pluginPath),
        PluginEvents: createEvents(pluginName),
        PluginUtils: {
            log: (message) => console.log(message),
            getDevices: () => global.devices,
            getDeviceLayouts: () => layouts,
            getMacros: () => global.userMacros,
            //TODO - Remove this, could make it possible for plugins to make themselves impossible to disable.
            use: require
        },
        PluginStorage: createStorage(pluginName),
        RegisterRunnable: () => console.log("WIP"),
        setTimeout: createSetTimeout(pluginName),
        setInterval: createSetInterval(pluginName, vm),
        Forever: createForever(pluginName)
    }
}

async function loadPlugin(pluginPath) {
    let pluginName;
    let quickJS = await getQuickJS();
    let runtime = quickJS.newRuntime();
    try {
        const code = readFileSync(join(pluginPath, 'index.js'), 'utf-8');
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
        let vm = quickJS.newContext();
        let pluginAPI = createPluginAPI(pluginPath, pluginName, vm)
        let PluginUtils = vm.newObject();
        let test = vm.newFunction("log", (...args) => {console.log(...args.map(vm.dump))});
        vm.setProp(PluginUtils, "log", test);
        test.dispose();
        vm.setProp(vm.global, "PluginUtils", PluginUtils)
        PluginUtils.dispose();
        //vm.setProp(vm.global, "setInterval", vm.newFunction("setInterval", pluginAPI.setInterval));
        createRegisterEvent(pluginName, vm);
        vm.evalCode(code);
        pluginVMs.push(vm);
        console.log("Plugin loaded.")
        fireEventForPlugin(pluginName, "onEnable");
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

function createSetInterval(pluginName, vm){
    if (pluginIntervals[pluginName] === undefined){
        pluginIntervals[pluginName] = [];
    }
    return async (callback, timeout) => {
        console.log("This is a test.")
        let testing = vm.dump(callback);
        console.log(testing)
        //pluginIntervals[pluginName].push(setInterval(await vm.evalCodeAsync.bind(this, testing), Number(vm.dump(timeout))))
    };
}

function createRegisterEvent(pluginName, vm){
    if (!pluginEvents[pluginName]){
        pluginEvents[pluginName] = [];
    }
    let regEvent = vm.newFunction("registerEvent", (event)=>{
        event = vm.dump(event);
        if (!pluginEvents[pluginName].includes(event)){
            pluginEvents[pluginName].push(event);
            console.log("Event registered for " + pluginName + ": " + event);
        }
    });
    vm.setProp(vm.global, "registerEvent", regEvent);
    regEvent.dispose();
}

function enablePlugin(event, packageName){
    installedPlugins[getInstalledPluginIndexByPackageName(packageName)].enabled = true;
    loadPlugin(installedPlugins[getInstalledPluginIndexByPackageName(packageName)].path);
    store.set("installedPlugins", installedPlugins);
}

function disablePlugin(event, packageName){
    console.log("Disabling plugin: " + packageName)
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
    fireEventForPlugin(packageName, "onDisable");
    pluginVMs[getPluginIndexByPackageName(packageName)].dispose();
    pluginVMs.splice(getPluginIndexByPackageName(packageName), 1);
    loadedPlugins.splice(getPluginIndexByPackageName(packageName), 1);
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

function fireEvent(event, ...args){
    let buildString = "";
    for (let i = 0; i < args.length; i++){
        buildString += JSON.stringify(args[i]) + ",";
    }
    buildString = event + "(" + buildString.slice(0, buildString.length-1) + ");";
    console.log(buildString);
    for (let i = 0; i < loadedPlugins.length; i++){
        if (pluginEvents[loadedPlugins[i].packageName].includes(event)){
            pluginVMs[i].evalCode(buildString);
        }
    }
}

function fireEventForPlugin(pluginName, event, ...args){
    let buildString = "";
    for (let i = 0; i < args.length; i++){
        buildString += JSON.stringify(args[i]) + ",";
    }
    buildString = event + "(" + buildString.slice(0, buildString.length-1) + ");";
    console.log(buildString);
    if (pluginEvents[pluginName].includes(event)){
        pluginVMs[getPluginIndexByPackageName(pluginName)].evalCode(buildString);
    }
}

let installedPlugins = store.get("installedPlugins");
refreshInstalledPlugins();
let pluginStorage = store.get("pluginStorage");
let pluginForever = {};
let pluginTimeouts = {};
let pluginIntervals = {};
let loadedPlugins = [];
let pluginVMs = [];
let pluginEvents = {};
loadEnabledPlugins();

module.exports = {refreshInstalledPlugins, loadEnabledPlugins, getFoldersInDirectory, getPluginIndexByPackageName,
    getInstalledPluginIndexByPackageName, getPlugin, getPluginREADME, pluginPackageJSON, loadPlugin, enablePlugin,
    disablePlugin, uninstallPlugin, fireForever, addPluginFromFile, getInstalledPlugins, getLoadedPlugins, handleTriggers,
    fireEvent};