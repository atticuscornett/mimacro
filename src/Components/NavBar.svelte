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

<div class="NavBarWrapper">
    <div class="NavBar">
        {#each pages as {name, pageTo}}
            <NavButton id={pageTo} name={name} checked={name==="Devices"} bind:page={page}></NavButton>
        {/each}
        </div>
    <hr>
</div>

<style>
    hr {
        color: var(--background-gray);
    }

    .NavBarWrapper {
        position: sticky;
        padding-top: 8px;
        top: 0;
        background-color: white;
        z-index: 5;
    }

    .NavBar {
        padding-left: 8px;
    }

    @media (prefers-color-scheme: dark) {
        hr {
            color: white;
        }
        .NavBarWrapper {
            background-color: var(--background-gray);
        }
    }
</style>