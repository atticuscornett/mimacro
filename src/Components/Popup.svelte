<div class="container">
    <div class="popup">
        <slot></slot>
    </div>
</div>

<style>
    .container {
        top: 0;
        left: 0;

        position: fixed;

        width: 100%;
        height: 100%;

        background-color: rgba(0, 0, 0, .75);
    }

    .popup {
        width: 75%;
        height: 75%;

        top: 50%;
        left: 50%;

        translate: -50% -50%;

        position: absolute;

        background-color: var(--background-gray);

        border-radius: 10px;

        padding: 10px;
    }

    @media (prefers-color-scheme: light) {
        .popup {
            background-color: white;
        }
    }
</style>