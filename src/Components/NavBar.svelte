<script>
    export let page;
</script>

<button on:click="{e => page = 'Devices'}">Devices</button>
<button on:click="{e => page = 'DeviceSetup'}">Device Setup</button>
<hr>