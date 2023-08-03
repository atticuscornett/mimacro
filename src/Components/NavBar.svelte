<script>
    import NavButton from "./NavButton.svelte";

    export let page;
    let pages = [
        {
            "name": "Devices",
            "pageTo": "Devices",
        },
        {
            "name": "Macros",
            "pageTo": "MacroPage"
        },
        {
            "name": "Plugins",
            "pageTo": "Plugins"
        },
        {
            "name": "Settings",
            "pageTo": "Settings"
        }
    ];
</script>

{#each pages as {name, pageTo}}
    <NavButton id={pageTo} name={name} checked={name==="Devices"} bind:page={page}></NavButton>
{/each}
<hr>

<style>
    hr {
        color: var(--background-gray);
    }

    @media (prefers-color-scheme: dark) {
        hr {
            color: white;
        }
    }
</style>