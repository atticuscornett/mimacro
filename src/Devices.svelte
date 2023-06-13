<script>
    export let detectedDevices;

    import ImageTile from "./ImageTile.svelte";

    function autoDetectButtons(){
		detectedDevices = "Running auto detect..."
		electronAPI.autoDetectDevices();
	}
</script>

<main>
    <h1>Devices</h1>
    <ImageTile src={"https://cdn.pixabay.com/photo/2017/03/23/12/32/arduino-2168193_1280.png"} text="Arduino Name"></ImageTile>
	<button on:click={autoDetectButtons}>Auto Detect Devices</button>
    <p>{detectedDevices}</p>
</main>