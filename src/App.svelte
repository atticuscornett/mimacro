<script lang="ts">
	import DeviceSetup from "./DeviceSetup.svelte";
    import Devices from "./Devices.svelte";
    import NavBar from "./Components/NavBar.svelte";
    import Settings from "./Settings.svelte";
	import Macros from "./Macros.svelte";
	let page = "Devices";

	window.setPage = (pageName) => {page = pageName};

	const components = {Devices, DeviceSetup, Settings, Macros}
</script>

<main>
	<NavBar bind:page={page}></NavBar>
	<svelte:component this={components[page]}></svelte:component>
</main>

<style>
	:global(:root){
		--primary-dark: #001524;
		--primary-blue: #15616D;
		--secondary-blue: #48BEFF;
		--primary-green: #399E5A;
		--secondary-green: #23CE6B;
		--background-gray: #242424;
	}

	@media (prefers-color-scheme: dark){
		:global(body) {
			color: white;
			background-color: var(--background-gray);
		}
	}
</style>