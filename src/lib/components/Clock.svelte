<script>
    import { onMount } from 'svelte';
    import BaseClock from "./BaseClock.svelte";

    let time = new Date();

    // these automatically update when `time`
    // changes, because of the `$:` prefix
    $: hours = time.getHours();
    $: minutes = time.getMinutes();
    $: seconds = time.getSeconds();

    onMount(() => {
        const interval = setInterval(() => {
            time = new Date();
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    });

</script>


<BaseClock bind:hours bind:minutes bind:seconds ></BaseClock>

<style>
    svg {
        width: 100%;
        height: 100%;
    }

    .clock-face {
        stroke: #333;
        fill: white;
    }

    .minor {
        stroke: #999;
        stroke-width: 0.5;
    }

    .major {
        stroke: #333;
        stroke-width: 1;
    }

    .hour {
        stroke: #333;
    }

    .minute {
        stroke: #666;
    }

    .second, .second-counterweight {
        stroke: rgb(28, 118, 255);
    }

    .second-counterweight {
        stroke-width: 3;
    }
</style>