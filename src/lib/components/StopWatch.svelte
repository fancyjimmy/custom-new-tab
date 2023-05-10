<script lang="ts">
    import {createTimer} from "../../store";
    import {onMount} from "svelte";
    import BaseClock from "./BaseClock.svelte";

    export let name: string;

    const {timer, timerState} = createTimer(name);


    let currentTime = Date.now();

    onMount(() => {
        const intervall = setInterval(() => {
            currentTime = Date.now();
        }, 1000);

        return () => {
            clearInterval(intervall);
        }
    });


    $: timeDifferenz = Math.max(1, 1 + currentTime - $timer);

    $: seconds = Math.floor((timeDifferenz % 60000) / 1000);
    $: minutes = Math.floor((timeDifferenz % 3600000) / 60000);
    $: hours = Math.floor((timeDifferenz % 86400000) / 3600000);

    function pad(num, size) {
        num = num.toString();
        while (num.length < size) num = "0" + num;
        return num;
    }
</script>


<div class="bg-slate-400 p-2 rounded shadow flex">

{#if $timerState}
    <div class="flex flex-col justify-center items-center">
        <div class="w-24 h-24">
            <BaseClock {seconds} {minutes} {hours}></BaseClock>
        </div>
        <p class="text-xl font-bold font-mono dark:text-white text-slate-900">{pad(hours, 2)}:{pad(minutes, 2)}:{pad(seconds, 2)}</p>
    </div>

{/if}
    <div>
        <button on:click={() => {timer.stop()}}>Reset</button>
        <button on:click={() => {timer.start()}}>Start</button>
    </div>

</div>

