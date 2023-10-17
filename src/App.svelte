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
	import {onMount} from "svelte";
	import Popup from "./Components/Popup.svelte";
	let page = "Devices";
	let appOutdated = false;
	let currentAppVersion = "";
	let newAppVersion = "";

	window.setPage = (pageName) => {page = pageName};

	const components = {Devices, Settings, MacroPage, Plugins}

	// Check if an update is available
	onMount(async () => {
		let response = await fetch("https://api.github.com/repos/atticuscornett/mimacro/releases/latest");
		if (!response.ok){
			return;
		}
		let responseJson = await response.json();
		currentAppVersion = await electronAPI.getAppVersion();
		currentAppVersion = "v" + currentAppVersion;
		newAppVersion = responseJson.tag_name;
		appOutdated = (newAppVersion !== currentAppVersion);
		console.log(appOutdated ? "An update is available!" : "mimacro is up to date.");
	})

	function updateNow(){
		electronAPI.installUpdates();
		appOutdated = false;
	}

	function remindLater(){
		appOutdated = false;
	}
</script>

<main>
	<Background></Background>
	<NavBar bind:page={page}></NavBar>
	<div class="mainApp">
		<svelte:component class="mainApp" this={components[page]}></svelte:component>
	</div>
	{#if appOutdated}
		<Popup bind:show={appOutdated}>
			<div class="centered">
				<h1>A new version of mimacro is available.</h1>
				<h2>Installed mimacro version: {currentAppVersion}</h2>
				<h2>New mimacro version: {newAppVersion}</h2>
				<button class="installButton" on:click={updateNow}>Install now</button>
				<button class="installButton" on:click={remindLater}>Remind me later</button>
			</div>
		</Popup>
	{/if}
</main>

<style>
	@font-face {
		font-family: Kanit;
		src: url("../../src/fonts/Kanit-Regular.ttf");
	}

	:global(:root){
		--primary-dark: #001524;
		--primary-blue: #15616D;
		--secondary-blue: #48BEFF;
		--primary-green: #399E5A;
		--secondary-green: #23CE6B;
		--background-gray: #171717;
	}

	:global(body){
		font-family: Kanit, sans-serif;
		padding: 0;
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

	.installButton {
		padding-left: 25px;
		padding-right: 25px;
		margin-right: 10px;
		border-radius: 15px;
		font-weight: bold;
		background-color: var(--primary-blue);
		color: white;
		border: none;
		user-select: none;
	}

	.centered {
		text-align: center;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
</style>