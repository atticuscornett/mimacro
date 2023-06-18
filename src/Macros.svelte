<script>
    import {onMount} from "svelte";

    onMount(async () => console.log(await electronAPI.getDevices()))
</script>

<main>
    <h1>Macros</h1>
</main>
