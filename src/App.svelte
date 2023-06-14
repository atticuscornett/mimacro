<script>
	import DeviceSetup from "./DeviceSetup.svelte";
    import Devices from "./Devices.svelte";
    import NavBar from "./Components/NavBar.svelte";
	let page = "Devices";

	window.setPage = (pageName) => {page = pageName};

	const components = {Devices, DeviceSetup}
</script>

<main>
	<NavBar bind:page={page}></NavBar>
	<svelte:component this={components[page]}></svelte:component>
</main>

<style>
</style>