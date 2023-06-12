<script>
	export let name;
	import ImageTile from "./ImageTile.svelte";

	let detectedDevices = "Auto detect not run."

	electronAPI.onAutoDetect ((event, detected) => {
		detectedDevices = JSON.stringify(detected);
	});

	function autoDetectButtons(){
		detectedDevices = "Running auto detect..."
		electronAPI.autoDetectDevices();
	}
</script>

<main>
	<!-- Just a test, don't load from pixabay! -->
	<ImageTile src={"https://cdn.pixabay.com/photo/2017/03/23/12/32/arduino-2168193_1280.png"} text="Arduino Name"></ImageTile>
	<button on:click={autoDetectButtons}>Auto Detect Devices</button>
	<p>{detectedDevices}</p>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>