<script lang="ts">
    import MacroViewingPage from "./Macros/MacroViewingPage.svelte";
    import MacroCreationPage from "./Macros/MacroCreationPage.svelte";
    import PageHandler from "./Components/PageHandler.svelte";
    import {writable} from "svelte/store";
    import {MacroData} from "./Macros/Data/macro";
    import {setContext} from "svelte";

    let macros = writable([] as MacroData[]);

    let firstWrite = true;

    macros.subscribe(value => {
        if (firstWrite) {
            firstWrite = false;
            return;
        }

        electronAPI.setMacros(value);
    })

    const updateMacros = async () => {
        $macros = await electronAPI.getMacros()
    }
    updateMacros()

    setContext("macros", macros);
</script>

<PageHandler pages={[
    MacroViewingPage,
    MacroCreationPage,
]} />