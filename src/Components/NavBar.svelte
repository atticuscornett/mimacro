<script>
    import NavButton from "./NavButton.svelte";

    export let page;
    let pages = [
        {
            "name": "Devices",
            "pageTo": "Devices",
        },
        {
            "name": "Device Setup",
            "pageTo": "DeviceSetup"
        },
        {
            "name": "Macros",
            "pageTo": "Macros"
        },
        {
            "name": "Plugins",
            "pageTo": "Plugins"
        },
        {
            "name": "Settings",
            "pageTo": "Settings"
        }
    ];
</script>

{#each pages as {name, pageTo}}
    <NavButton id={pageTo} name={name} checked={name=="Devices"} bind:page={page}></NavButton>
{/each}
<hr>