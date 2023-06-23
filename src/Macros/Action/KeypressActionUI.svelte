<script lang="ts">
    import type {Action} from "../Data/action";

    export let action: Action;
    export let canProgress: boolean;
</script>

<button on:click={() => {canProgress = true}}>Configure</button>
