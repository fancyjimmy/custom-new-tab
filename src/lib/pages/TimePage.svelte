<script lang="ts">
    import Clock from "../components/time/Time.svelte";
    import {onMount} from "svelte";
    import {createTimer} from "../../store";
    import StopWatch from "../components/time/StopWatch.svelte";
    import StopWatchManager from "../components/time/StopWatchManager.svelte";

    let time = new Date();

    onMount(() => {
        const interval = setInterval(() => {
            time = new Date();
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    });

    const timer = createTimer("test");

    $: hours = time.getHours();
    $: minutes = time.getMinutes();
    $: seconds = time.getSeconds();

    function pad(num, size) {
        num = num.toString();
        while (num.length < size) num = "0" + num;
        return num;
    }
</script>

<div class="h-full w-full flex items-center justify-center">

    <div class="flex items-center justify-center flex-col flex-1">
        <div class="w-96 h-96 mb-5">
            <Clock></Clock>
        </div>

        <p class="text-8xl font-bold font-mono dark:text-white text-slate-900">{pad(hours, 2)}:{pad(minutes, 2)}:{pad(seconds, 2)}</p>

    </div>
    <StopWatchManager class='h-full p-3 w-96 bg-slate-300/30 dark:bg-slate-900/60'/>
</div>
