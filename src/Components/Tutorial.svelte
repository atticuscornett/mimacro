<script>
    import FloatingPopup from "./FloatingPopup.svelte";

    export let name;
    export let x;
    export let y;

    // Show once and then never again
    let show = !window.localStorage.getItem(name);

    let dismiss = () => {
        show = false;
        window.localStorage.setItem(name, "true");
    }
</script>
<FloatingPopup bind:show={show} x={x} y={y} clickOut={false} maxWidth="300px">
    <h2>{name}</h2>
    <slot>
    </slot>
    <br>
    <button on:click={dismiss}>Okay</button>
</FloatingPopup>

<style>
    h2 {
        margin-top: 5px;
    }

    button {
        padding-left: 10px;
        padding-right: 10px;
        float: right;
        margin-left: 10px;
        border-radius: 15px;
        font-weight: bold;
        border: solid black 3px;
        user-select: none;
        background: none;
        color: black;
    }
    
    @media (prefers-color-scheme: dark) {
        button{
            border: solid white 3px;
            color: white;
        }
    }
</style>