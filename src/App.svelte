<script>
	import DeviceSetup from "./DeviceSetup.svelte";
    import Devices from "./Devices.svelte";
    import NavBar from "./Components/NavBar.svelte";
    import Settings from "./Settings.svelte";
	let page = "Devices";

	window.setPage = (pageName) => {page = pageName};

	const components = {Devices, DeviceSetup, Settings}
</script>

<main>
	<NavBar bind:page={page}></NavBar>
	<svelte:component this={components[page]}></svelte:component>
</main>

<style>
	@media (prefers-color-scheme: dark){
		:global(body) {
			color: white;
			background-color: black;
		}
	}
</style>