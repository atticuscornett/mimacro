<script lang="ts">
    import {SvelteComponent} from "svelte";
    import IconArrowLeft from "@tabler/icons-svelte/dist/svelte/icons/IconArrowLeft.svelte";
    import IconArrowRight from "@tabler/icons-svelte/dist/svelte/icons/IconArrowRight.svelte";
    import {getPrimaryThemeColor} from "../utilities";

    export let pages: typeof SvelteComponent[];

    /**
     * Called only when the pages successfully make a loop and wrap back to the first page.
     */
    export let onLoop: () => void;

    let canProgress = true;
    let canRegress = true;
    let canLeave = true;

    $: {
        // if on the home page
        if (index == 0) {
            canRegress = false;
            canProgress = true;
        }
    }

    $: console.log("canProgress: " + canProgress);
    $: console.log("canRegress: " + canRegress);
    $: console.log("canLeave: " + canLeave);

    let index = 0;
    let page: SvelteComponent;
    $: page = pages[index];

    const iconColor = getPrimaryThemeColor();
    const iconSize = 15;
    const iconStroke = 4;

    let onReset: () => void;
    function reset(): void {
        onReset?.call(onReset);

        if (!canLeave || !canProgress) return;

        index = 0;
    }

    let onProgress: () => void;
    function next(): void {
        onProgress?.call(onProgress);

        if (!canLeave || !canProgress) return;

        if (index + 1 >= pages.length) {
            index = 0;
            onLoop?.call(onLoop);
        }

        else {
            index++;
        }
    }

    let onRegress: () => void;
    function previous(): void {
        onRegress?.call(onRegress);

        if (!canLeave || !canRegress) return;

        if (index <= 0) {
            index = 0;
        }

        else {
            index--;
        }
    }

    $: {
        index = index;

        onReset = null;
        onProgress = null;
        onRegress = null;
    }
</script>

<svelte:component
        this={page}

        reset={reset}
        next={next}
        previous={previous}

        bind:canLeave={canLeave}
        bind:canRegress={canRegress}
        bind:canProgress={canProgress}

        bind:onReset={onReset}
        bind:onProgress={onProgress}
        bind:onRegress={onRegress}
/>

<div class="nav-buttons">
    <button id="previous-page-button" class="unselectable" disabled={canLeave && canRegress ? "" : "disabled"} on:click={previous}>
        <IconArrowLeft
                size={iconSize}
                stroke={iconStroke}
                color={canLeave && canRegress ? iconColor : "dimgray"}
        />
    </button>

    <button id="next-page-button" class="unselectable" disabled={canLeave && canProgress ? "" : "disabled"} on:click={next}>
        <IconArrowRight
                size={iconSize}
                stroke={iconStroke}
                color={canLeave && canProgress ? iconColor : "dimgray"}
        />
    </button>
</div>

<style>
    .nav-buttons {
        display: flex;
        position: absolute;

        top: 0;
        right: 0;
    }

    .nav-buttons > button {
        margin: 5px;

        background: none;
        border: none;
    }
</style>