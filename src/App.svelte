<script>
	import DeviceSetup from "./DeviceSetup.svelte";
    import Devices from "./Devices.svelte";
    import NavBar from "./Components/NavBar.svelte";
	let page = "Devices";

	window.setPage = (pageName) => {page = pageName};
</script>

<main>
	<NavBar bind:page={page}></NavBar>
	{#if page == "Devices"}
		<Devices></Devices>
	{/if}
	{#if page == "DeviceSetup"}
		<DeviceSetup></DeviceSetup>
	{/if}
</main>

<style>
</style>