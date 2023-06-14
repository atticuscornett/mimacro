<script>
	export let name;
	import ImageTile from "./ImageTile.svelte";
	import DeviceSetup from "./DeviceSetup.svelte";
    import Devices from "./Devices.svelte";
    import NavBar from "./Components/NavBar.svelte";
	let page = "Devices";

	let detectedDevices = "Auto detect not run."

	window.setPage = (pageName) => {page = pageName};

	electronAPI.onAutoDetect ((event, detected) => {
		detectedDevices = JSON.stringify(detected);
	});
</script>

<main>
	<NavBar bind:page={page}></NavBar>
	{#if page == "Devices"}
		<Devices detectedDevices={detectedDevices}></Devices>
	{/if}
	{#if page == "DeviceSetup"}
		<DeviceSetup></DeviceSetup>
	{/if}
</main>

<style>
</style>