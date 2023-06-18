<script>
    export let name;
    export let id;
    export let label;
</script>

<input type="radio" value={id} id={id} name={name}>
<label for={id}><div>{label}</div></label>

<style>
    input {
        display: none;
    }

    label {
        font-size: 1.5em;
        cursor: pointer;
    }

    input + label > div{
        border: 2px gray solid;
        border-radius: 15px;
        padding: 10px;
        margin: 10px;
        color: black;
    }

    input:checked + label > div {
        border: 2px dodgerblue solid;
        background-color: dodgerblue;
        border-color: none;
        color: white;
    }

    div {
        transition: all 0.5s ease-in-out;
    }

    div:hover {
        box-shadow: 0 5px 15px rgba(30, 144, 255, .4);
    }

    @media (prefers-color-scheme: dark){
        input + label > div{
            color: white;
        }
    }
</style>