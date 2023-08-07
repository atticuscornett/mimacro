<script>
    import { onMount } from "svelte";

    onMount(async () => {
        document.getElementById("colorTheme").value = await electronAPI.getColorTheme();
        document.getElementById("runAtStartup").checked = await electronAPI.getOpenAtLogin();
    })

    function updateColorTheme(){
        electronAPI.setColorTheme(document.getElementById("colorTheme").value);
    }

    function updateStartup(){
        electronAPI.setOpenAtLogin(document.getElementById("runAtStartup").checked);
    }
</script>
<h1>Settings</h1>

<label for="colorTheme">Color Theme: </label>
<select id="colorTheme" on:change={updateColorTheme}>
    <option value="system">System Default</option>
    <option value="light">Light</option>
    <option value="dark">Dark</option>
</select>
<br>
<input type="checkbox" id="runAtStartup" on:change={updateStartup}>
<label for="runAtStartup">Run mimacro in background on startup</label>
<br>
<input type="checkbox" id="automaticallyUpdate">
<label for="automaticallyUpdate">Automatically update device firmware</label>
<style>
    input, label {
        display: inline;
        font-size: 20px;
        margin-right: 10px;
        margin-bottom: 15px;
    }
    h1 {
        margin-top: 0;
    }
</style>