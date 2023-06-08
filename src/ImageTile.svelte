<script>
    export let src;
    export let text;
</script>

<div>
    <!-- svelte-ignore a11y-missing-attribute -->
    <img src={src}>
    <h2>{text}</h2>
</div>

<style>
    div {
        width: 150px;
        border: 3px solid gray;
        border-radius: 7px;
        padding: 10px;
    }
    img {
        width: 100px;
    }
    h2{
        font-size: 20px;
        padding: 0px;
        margin: 5px;
    }
</style>