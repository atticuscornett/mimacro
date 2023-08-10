<svelte:head>
	<script type="text/javascript" src="../src/Libraries/marked.min.js"></script>
	<script type="text/javascript" src="../src/Libraries/purify.min.js"></script>
</svelte:head>

<script>
    import Devices from "./Devices.svelte";
    import NavBar from "./Components/NavBar.svelte";
    import Settings from "./Settings.svelte";
	import Background from "./Components/Background.svelte";
	import MacroPage from "./MacroPage.svelte";
	import Plugins from "./Plugins.svelte";
	let page = "Devices";

	window.setPage = (pageName) => {page = pageName};

	const components = {Devices, Settings, MacroPage, Plugins}
</script>

<main>
	<Background></Background>
	<NavBar bind:page={page}></NavBar>
	<div class="mainApp">
		<svelte:component class="mainApp" this={components[page]}></svelte:component>
	</div>
</main>

<style>
	:global(:root){
		--primary-dark: #001524;
		--primary-blue: #15616D;
		--secondary-blue: #48BEFF;
		--primary-green: #399E5A;
		--secondary-green: #23CE6B;
		--background-gray: #171717;
	}

	.mainApp {
		margin-left: 10px;
		margin-right: 10px;
		margin-top: 10px;
	}

	@media (prefers-color-scheme: dark){
		:global(body) {
			color: white;
		}
	}

	@media (prefers-color-scheme: light) {
		:global(body) {
			color: var(--background-gray);
		}
	}
</style>