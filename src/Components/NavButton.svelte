<script>
    export let name;
    export let id;
    export let page;
    export let checked = false;

    $: {
        uncheck(page);
    }

    function uncheck(page){
        if (page !== id){
            checked = false;
        }
    }

    function setPage(){
        checked = true;
        page = id;
    }

    function handleKeydown(event){
        if (event.key === "Enter"){
            setPage();
        }
    }
</script>

<div>
    <input type="radio" value={id} checked={checked} name="NavBarButton">
    <label for={id} on:click={setPage} tabindex="0" on:keydown={handleKeydown} id="nav-{id}"><div>{name}</div></label>
</div>

<style>
    div {
        display: inline-block;
        margin-right: 10px;
    }

    input {
        display: none;
    }

    input + label > div {
        border-bottom: white 2px solid;
    }

    input:checked + label > div {
        border-bottom: black 2px solid;
    }

    @media (prefers-color-scheme:dark){
        input + label > div {
            border-bottom: var(--background-gray) 2px solid;
        }

        input:checked + label > div {
            border-bottom: white 2px solid;
        }
    }
</style>