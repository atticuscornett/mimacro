<div class="filter-wrapper">
    <div class="background">
    </div>
</div>
<style>
    .filter-wrapper {
        filter: blur(10px) brightness(1.3);
        position: fixed;
        z-index: -1;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        /* Removes ugly edge of blur */
        scale: 1.1;
    }
    .background {
        background-image: url("../../src/Images/Backgrounds/light.png");
		background-size: cover;
		background-repeat: no-repeat;
  		background-attachment: fixed;
        position: fixed;
        z-index: -1;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
    }

    @media (prefers-color-scheme: dark){
        .background {
            background-image: url("../../src/Images/Backgrounds/dark.png");
        }

        .filter-wrapper {
            filter: blur(7px);
        }
    }
</style>