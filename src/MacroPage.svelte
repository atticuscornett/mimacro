<script lang="ts">
    import MacroViewingPage from "./Macros/MacroViewingPage.svelte";
    import PageHandler from "./Components/PageHandler.svelte";
    import {writable} from "svelte/store";
    import {MacroData} from "./Macros/Data/macro";
    import {setContext} from "svelte";
    import ActionConfigPage from "./Macros/ActionConfigPage.svelte";
    import MacroConfigPage from "./Macros/MacroConfigPage.svelte";

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

    let wipMacro = writable({} as MacroData)
    setContext("wipMacro", wipMacro);
</script>

<PageHandler onLoop={() => {
                 // Push wipMacro
                 $macros = $macros.concat([$wipMacro])

                 // and then reset it to get ready for the next cycle
                 $wipMacro = null;
             }}

             pages={[
    MacroViewingPage,
    MacroConfigPage,
    ActionConfigPage
]}
/>