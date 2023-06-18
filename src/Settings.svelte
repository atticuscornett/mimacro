<script>
    import { onMount } from "svelte";

    onMount(async () => {
        document.getElementById("colorTheme").value = await electronAPI.getColorTheme();
    })

    function updateColorTheme(){
        electronAPI.setColorTheme(document.getElementById("colorTheme").value);
    }
</script>
<h1>Very Yes GOod Settings...</h1>

<label for="colorTheme">Color Theme: </label>
<select id="colorTheme" on:change={updateColorTheme}>
    <option value="system">System Default</option>
    <option value="light">Light</option>
    <option value="dark">Dark</option>
</select>