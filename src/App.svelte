<script>
	export let name;
	import ImageTile from "./ImageTile.svelte";
	import DeviceSetup from "./DeviceSetup.svelte";
    import Devices from "./Devices.svelte";
	let page = "Devices";

	let detectedDevices = "Auto detect not run."

	window.setPage = (pageName) => {page = pageName};

	electronAPI.onAutoDetect ((event, detected) => {
		detectedDevices = JSON.stringify(detected);
	});
</script>

<main>
	{#if page == "Devices"}
		<Devices detectedDevices={detectedDevices}></Devices>
	{/if}
	{#if page == "DeviceSetup"}
		<DeviceSetup></DeviceSetup>
	{/if}
	<button on:click="{e => page = 'Devices'}">Devices</button>
	<button on:click="{e => page = 'DeviceSetup'}">Device Setup</button>
</main>

<style>
</style>